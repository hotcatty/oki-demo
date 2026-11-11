import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const host = document.querySelector('#characterMount');
const stage = document.querySelector('.character-stage');
const loading = document.querySelector('#stageLoading');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let cachedModelBytes;
let activeUnmount;

function modelBytes() {
  if (cachedModelBytes) return cachedModelBytes;
  const encoded = window.OKI_MODEL_BASE64;
  if (typeof encoded !== 'string' || !encoded.length) throw new Error('The character data is missing.');
  if (typeof Uint8Array.fromBase64 === 'function') {
    cachedModelBytes = Uint8Array.fromBase64(encoded).buffer;
  } else {
    const decoded = atob(encoded);
    const bytes = new Uint8Array(decoded.length);
    for (let index = 0; index < decoded.length; index++) bytes[index] = decoded.charCodeAt(index);
    cachedModelBytes = bytes.buffer;
  }
  delete window.OKI_MODEL_BASE64;
  return cachedModelBytes;
}

function setLoading(message, failed = false) {
  if (!loading) return;
  loading.hidden = false;
  loading.classList.toggle('has-error', failed);
  loading.querySelector('p').textContent = message;
  loading.querySelector('button')?.remove();
  if (failed) {
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = '再见一次小宁';
    retry.addEventListener('click', startCharacter, { once: true });
    loading.append(retry);
  }
}

function disposeObject(object) {
  if (!object) return;
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  const bitmaps = new Set();
  object.traverse(node => {
    if (node.geometry) geometries.add(node.geometry);
    if (node.material) {
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
        materials.add(material);
        for (const value of Object.values(material)) {
          if (value?.isTexture) textures.add(value);
        }
      }
    }
  });
  for (const texture of textures) {
    if (texture.source?.data?.close) bitmaps.add(texture.source.data);
    texture.dispose();
  }
  for (const bitmap of bitmaps) bitmap.close();
  for (const material of materials) material.dispose();
  for (const geometry of geometries) geometry.dispose();
}

function loadAtlas(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('The face atlas could not be loaded.'));
    image.src = source;
  });
}

async function startCharacter() {
  if (!host || !window.OKIStage) return;
  activeUnmount?.();
  activeUnmount = null;
  setLoading('小宁马上就来');
  host.setAttribute('aria-busy', 'true');

  let renderer;
  let character;
  let mixer;
  let scene;
  let frameRequest;
  let resizeObserver;
  let listeningObserver;
  let disposed = false;
  let contextLost = false;
  let lastTime = 0;
  let lastDraw = 0;
  let elapsed = 0;
  let camera;
  let rootBone;
  let faceTexture;
  let atlasImage;
  let faceContext;
  let faceFrame = -1;
  let currentAction;
  let reactionRemaining = null;
  let pointer = null;
  let targetRotation = 0;
  let rotation = 0;
  let autoReturnAt = 0;
  let listening = stage?.classList.contains('is-listening') || false;
  const actions = new Map();
  const atlas = window.OKI_FACE_ATLAS;
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();

  function stopDrawing() {
    if (frameRequest !== undefined) cancelAnimationFrame(frameRequest);
    frameRequest = undefined;
    lastTime = 0;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    stopDrawing();
    resizeObserver?.disconnect();
    listeningObserver?.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pageshow', onPageShow);
    window.removeEventListener('pagehide', onPageHide);
    motionPreference.removeEventListener('change', onMotionChange);
    if (renderer) {
      const canvas = renderer.domElement;
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      canvas.removeEventListener('lostpointercapture', onPointerCancel);
      canvas.removeEventListener('keydown', onKeyDown);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
    }
    mixer?.stopAllAction();
    if (character) mixer?.uncacheRoot(character);
    disposeObject(character);
    if (!character) faceTexture?.dispose();
    renderer?.dispose();
    renderer?.forceContextLoss();
    host.removeAttribute('aria-busy');
  }

  function playClip(name, reaction = false) {
    const action = actions.get(name) || actions.get('k_08') || actions.values().next().value;
    if (!action || action === currentAction && !reaction) return;
    action.reset();
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(1);
    action.setLoop(reaction ? THREE.LoopOnce : THREE.LoopRepeat, reaction ? 1 : Infinity);
    action.clampWhenFinished = reaction;
    if (currentAction && currentAction !== action) action.fadeIn(.28);
    action.play();
    if (currentAction && currentAction !== action) currentAction.fadeOut(.28);
    currentAction = action;
    reactionRemaining = reaction ? Math.min(action.getClip().duration, 3.3) : null;
  }

  function updateFace() {
    if (!faceContext || !atlasImage || !faceTexture || !atlas?.count) return;
    const nextFrame = motionPreference.matches ? 0 : Math.floor(elapsed * (atlas.fps || 15)) % atlas.count;
    if (nextFrame === faceFrame) return;
    faceFrame = nextFrame;
    for (let quadrant = 0; quadrant < 4; quadrant++) {
      const tile = atlas.perm[nextFrame * 4 + quadrant];
      const sx = tile % atlas.cols * 256;
      const sy = Math.floor(tile / atlas.cols) * 256;
      faceContext.drawImage(atlasImage, sx, sy, 256, 256, (quadrant & 1) * 256, (quadrant >> 1) * 256, 256, 256);
    }
    faceTexture.needsUpdate = true;
  }

  function draw(time) {
    frameRequest = undefined;
    if (disposed || contextLost || document.hidden || !character) return;
    if (!motionPreference.matches && time - lastDraw < 1000 / 30) {
      frameRequest = requestAnimationFrame(draw);
      return;
    }
    const delta = lastTime ? Math.min((time - lastTime) / 1000, .05) : .001;
    lastTime = time;
    lastDraw = time;
    if (!motionPreference.matches) {
      elapsed += delta;
      mixer?.update(delta);
      if (reactionRemaining !== null) {
        reactionRemaining -= delta;
        if (reactionRemaining <= .2) playClip('k_08');
      }
      if (!pointer && elapsed > autoReturnAt) targetRotation = 0;
      rotation = THREE.MathUtils.damp(rotation, targetRotation, 9, delta);
      character.rotation.y = rotation;
    }
    if (rootBone) {
      rootBone.position.x = 0;
      rootBone.position.z = 0;
    }
    updateFace();
    renderer.render(scene, camera);
    if (!motionPreference.matches) frameRequest = requestAnimationFrame(draw);
  }

  function requestDraw() {
    if (disposed || contextLost || document.hidden || frameRequest !== undefined) return;
    frameRequest = requestAnimationFrame(draw);
  }

  function resize() {
    if (!renderer || !camera || disposed) return;
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    const verticalSpan = 1.07;
    const horizontalSpan = verticalSpan * width / height;
    camera.left = -horizontalSpan / 2;
    camera.right = horizontalSpan / 2;
    camera.top = verticalSpan / 2;
    camera.bottom = -verticalSpan / 2;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    requestDraw();
  }

  function onVisibility() {
    if (document.hidden) {
      stopDrawing();
      pointer = null;
    } else requestDraw();
  }

  function onPageHide(event) {
    if (event.persisted) stopDrawing();
    else activeUnmount?.();
  }

  function onPageShow() { requestDraw(); }

  function onMotionChange() {
    targetRotation = 0;
    rotation = 0;
    if (character) character.rotation.y = 0;
    stopDrawing();
    requestDraw();
  }

  function greet() {
    if (motionPreference.matches) return;
    playClip('k_09', true);
    autoReturnAt = elapsed + 2.5;
    requestDraw();
  }

  function onPointerDown(event) {
    if (!character || event.button !== 0 || pointer) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointerNdc.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointerNdc, camera);
    if (!raycaster.intersectObject(character, true).length) return;
    pointer = { id: event.pointerId, x: event.clientX, rotation: targetRotation, dragged: false };
    renderer.domElement.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!pointer || pointer.id !== event.pointerId || motionPreference.matches) return;
    const difference = event.clientX - pointer.x;
    if (Math.abs(difference) > 6) pointer.dragged = true;
    if (pointer.dragged) {
      targetRotation = THREE.MathUtils.clamp(pointer.rotation + difference / Math.max(host.clientWidth, 1) * 1.4, -.36, .36);
      autoReturnAt = elapsed + 3;
      requestDraw();
    }
  }

  function onPointerUp(event) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const tapped = !pointer.dragged;
    pointer = null;
    autoReturnAt = elapsed + 3;
    if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
    if (tapped) greet();
  }

  function onPointerCancel() { pointer = null; }

  function onKeyDown(event) {
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      if (!event.repeat) greet();
    } else if (['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) {
      event.preventDefault();
      if (motionPreference.matches) return;
      targetRotation = event.key === 'Home' ? 0 : THREE.MathUtils.clamp(targetRotation + (event.key === 'ArrowLeft' ? -.12 : .12), -.36, .36);
      autoReturnAt = elapsed + 3;
      requestDraw();
    }
  }

  function onContextLost(event) {
    event.preventDefault();
    contextLost = true;
    stopDrawing();
    setLoading('小宁稍微歇一下，马上回来');
  }

  function onContextRestored() {
    contextLost = false;
    if (character && loading) loading.hidden = true;
    resize();
    requestDraw();
  }

  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'button');
    canvas.setAttribute('aria-label', '和小宁互动，轻触或按空格打招呼，左右拖动转身');
    host.setAttribute('role', 'group');
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);
    canvas.addEventListener('lostpointercapture', onPointerCancel);
    canvas.addEventListener('keydown', onKeyDown);
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);
    activeUnmount = window.OKIStage.mount(canvas, dispose);

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-.35, .35, .535, -.535, .1, 10);
    camera.position.set(0, .49, 3);
    camera.lookAt(0, .49, 0);
    scene.add(new THREE.HemisphereLight(0xfff4eb, 0xe7bec0, 1.4));
    scene.add(new THREE.AmbientLight(0xfff8ef, .5));
    const key = new THREE.DirectionalLight(0xfff1df, 2.8);
    key.position.set(-1.6, 2.6, 3.2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffeaf0, 1.2);
    fill.position.set(2, 1, 2.4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xfff2dc, 1.8);
    rim.position.set(1, 1.8, -1.5);
    scene.add(rim);

    const gltf = await new GLTFLoader().parseAsync(modelBytes(), '');
    if (disposed) { disposeObject(gltf.scene); return; }
    character = gltf.scene;
    character.traverse(node => {
      if (!node.isMesh) return;
      node.frustumCulled = false;
      if (node.name === 'Xiaoning_Visor') {
        const previous = node.material;
        node.material = new THREE.MeshPhysicalMaterial({ color: 0x261c24, transparent: true, opacity: .012, roughness: .1, metalness: 0, clearcoat: .7, clearcoatRoughness: .09, depthWrite: false, side: THREE.DoubleSide });
        previous.dispose();
        node.renderOrder = 6;
      } else if (node.name === 'Xiaoning_FaceScreen') {
        node.material.depthWrite = false;
        node.renderOrder = 5;
      } else {
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        for (const material of materials) {
          if (material.normalMap) material.normalScale.set(.45, .45);
          if (material.map) material.map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        }
      }
    });
    rootBone = character.getObjectByName('b_f3e9c8');
    scene.add(character);
    mixer = new THREE.AnimationMixer(character);
    for (const clip of gltf.animations) actions.set(clip.name, mixer.clipAction(clip));
    playClip('k_08');
    mixer.update(.001);
    if (atlas?.src && atlas?.perm?.length >= atlas.count * 4) {
      try {
        atlasImage = await loadAtlas(atlas.src);
        if (disposed) return;
        const faceCanvas = document.createElement('canvas');
        faceCanvas.width = 512;
        faceCanvas.height = 512;
        faceContext = faceCanvas.getContext('2d');
        if (faceContext) {
          faceTexture = new THREE.CanvasTexture(faceCanvas);
          faceTexture.flipY = false;
          faceTexture.colorSpace = THREE.SRGBColorSpace;
          faceTexture.generateMipmaps = false;
          faceTexture.minFilter = THREE.LinearFilter;
          faceTexture.magFilter = THREE.LinearFilter;
          const face = character.getObjectByName('Xiaoning_FaceScreen');
          if (face?.material) {
            const previousMap = face.material.map;
            face.material.map = faceTexture;
            face.material.needsUpdate = true;
            previousMap?.dispose();
            previousMap?.source?.data?.close?.();
          }
          updateFace();
        }
      } catch (error) {
        console.warn('Keeping the character’s default expression.', error);
      }
    }
    if (disposed) return;
    listeningObserver = new MutationObserver(() => {
      const nextListening = stage.classList.contains('is-listening');
      if (nextListening === listening) return;
      listening = nextListening;
      if (!motionPreference.matches) playClip(listening ? 'k_09' : 'k_08');
      requestDraw();
    });
    if (stage) listeningObserver.observe(stage, { attributes: true, attributeFilter: ['class'] });
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('pagehide', onPageHide);
    motionPreference.addEventListener('change', onMotionChange);
    resize();
    character.updateMatrixWorld(true);
    renderer.render(scene, camera);
    host.setAttribute('aria-busy', 'false');
    host.dataset.ready = 'true';
    if (loading) loading.hidden = true;
    window.dispatchEvent(new CustomEvent('oki:characterready'));
    requestDraw();
  } catch (error) {
    if (disposed) return;
    console.error('The character could not be displayed.', error);
    activeUnmount?.();
    activeUnmount = null;
    host.setAttribute('aria-busy', 'false');
    setLoading('小宁还没准备好，陪她再试一次吧', true);
  }
}

startCharacter();
