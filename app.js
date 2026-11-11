'use strict';

// Original local SVG artwork; unique paint IDs keep repeated controls independent.
const lineIcons = {
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  back: '<path d="M19 12H5m5-5-5 5 5 5"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  wave: '<path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4"/>',
  check: '<path d="m5 12 5 5L20 6"/>',
  send: '<path d="m3 4 18 8-18 8 3-8-3-8Zm3 8h15"/>',
  history: '<path d="M3 10a9 9 0 1 1 1 7M3 4v6h6M12 7v5l3 2"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 6 0 0 1 16 0v2"/>',
  heart: '<path d="M12 20 4 12a5 5 0 0 1 8-6 5 5 0 0 1 8 6Z"/>',
  device: '<rect x="5" y="3" width="14" height="18" rx="5"/><rect x="8" y="6" width="8" height="8" rx="2"/><path d="M10 18h4"/>',
  switch: '<path d="M3 7h17l-4-4m4 4-4 4M21 17H4l4 4m-4-4 4-4"/>',
  camera: '<path d="M8 6l2-3h4l2 3h4v14H4V6Z"/><circle cx="12" cy="13" r="4"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  wallet: '<path d="M20 7V4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16V7H5M21 11h-6v5h6"/><path d="M17.5 13.5h.1"/>',
  pin: '<path d="M12 22S4 14 4 9a8 8 0 0 1 16 0c0 5-8 13-8 13Z"/><circle cx="12" cy="9" r="3"/>',
  plant: '<path d="M12 21V10M12 15a8 8 0 0 1-9-9 8 8 0 0 1 9 9Zm0-5a8 8 0 0 1 9-9 8 8 0 0 1-9 9ZM7 21h10"/>',
  moon: '<path d="M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12Z"/>',
  book: '<path d="M12 5c-3-2-7-2-10-1v16c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v16M5 8h4m6 0h4M5 12h4m6 0h4"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 9h.1M16 9h.1M7 14a5 5 0 0 0 10 0"/>'
};
const illustrationShapes = {
  settings: '<path d="m28 7 8 0 2 6 5 3 6-1 4 7-4 5v6l4 5-4 7-6-1-5 3-2 6h-8l-2-6-5-3-6 1-4-7 4-5v-6l-4-5 4-7 6 1 5-3Z" fill="url(#metal)" stroke="#b5b6b8" stroke-width="1.4" stroke-linejoin="round"/><circle cx="32" cy="30" r="15" fill="url(#dark)"/><circle cx="32" cy="29" r="8" fill="url(#shell)" stroke="#e4e4e5" stroke-width="1.5"/><path d="M20 22a15 15 0 0 1 23-3" fill="none" stroke="#ffffff9c" stroke-width="1.6" stroke-linecap="round"/>',
  speaker: '<rect x="10" y="24" width="15" height="18" rx="5" fill="url(#metal)"/><path d="M22 25 34 14a4 4 0 0 1 6 3v31a4 4 0 0 1-6 3L22 41Z" fill="url(#dark)"/><path d="M26 26 34 19" stroke="#ffffff55" stroke-width="2" stroke-linecap="round"/><path d="M46 25a12 12 0 0 1 0 15M51 19a21 21 0 0 1 0 27" stroke="url(#metal)" stroke-width="3.5" stroke-linecap="round" fill="none"/>',
  'speaker-off': '<rect x="9" y="24" width="15" height="18" rx="5" fill="url(#metal)"/><path d="M21 25 33 14a4 4 0 0 1 6 3v31a4 4 0 0 1-6 3L21 41Z" fill="url(#dark)"/><path d="m46 27 10 10m0-10L46 37" stroke="#858589" stroke-width="3.5" stroke-linecap="round"/>',
  more: '<rect x="9" y="9" width="20" height="20" rx="7" fill="url(#dark)"/><rect x="35" y="9" width="20" height="20" rx="7" fill="url(#metal)"/><rect x="9" y="35" width="20" height="20" rx="7" fill="url(#metal)"/><rect x="35" y="35" width="20" height="20" rx="7" fill="url(#dark)"/><path d="M15 12h7m19 26h7" stroke="#ffffff65" stroke-width="1.7" stroke-linecap="round"/>',
  note: '<rect x="12" y="9" width="37" height="47" rx="8" fill="#aaa5b2"/><rect x="14" y="7" width="37" height="46" rx="8" fill="url(#lilac)" stroke="#ffffffba"/><path d="M21 8v44" stroke="#aaa4b9" stroke-width="2"/><path d="M27 21h16m-16 7h12m-12 7h9" stroke="#ffffffcd" stroke-width="2.5" stroke-linecap="round"/><path d="M22 49h22" stroke="#f7f5fb" stroke-width="2" stroke-linecap="round"/><g transform="rotate(21 47 37)"><rect x="44" y="20" width="7" height="28" rx="2" fill="url(#dark)"/><path d="m44 48 3.5 7 3.5-7" fill="#d7cfc1"/><path d="m46 52 1.5 3 1.5-3" fill="#4e4b52"/><path d="M46 24v19" stroke="#ffffff52" stroke-width="1"/></g>',
  world: '<ellipse cx="32" cy="33" rx="30" ry="11" transform="rotate(-26 32 33)" fill="none" stroke="#c4cac6" stroke-width="5"/><circle cx="32" cy="29" r="21" fill="url(#globe)"/><path d="M23 10c5 5-3 7 0 12s10 1 12 8-8 12-2 18M43 13c-1 6-7 4-6 10s11 4 14 6" fill="none" stroke="#d4ded48c" stroke-width="5.5" stroke-linecap="round"/><path d="M6 39c-3 8 11 8 29 1s28-18 23-23" fill="none" stroke="url(#shell)" stroke-width="5" stroke-linecap="round"/><path d="M15 17a21 21 0 0 1 18-9" stroke="#ffffffb0" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  chat: '<path d="M10 15c0-5 4-8 9-8h26c6 0 10 4 10 10v20c0 6-4 10-10 10H29L17 56l1-9c-5 0-8-4-8-9Z" fill="url(#shell)" stroke="#d9d9dd"/><rect x="16" y="15" width="32" height="24" rx="9" fill="url(#dark)"/><g fill="#f4f4f7"><circle cx="24" cy="27" r="2"/><circle cx="32" cy="27" r="2"/><circle cx="40" cy="27" r="2"/></g>',
  game: '<path d="M18 17h28c7 0 13 23 10 30-2 6-7 5-15-4H23c-8 9-13 10-15 4-3-7 3-30 10-30Z" fill="url(#shell)" stroke="#d3d3d8"/><path d="M15 22h31" stroke="#ffffffde" stroke-width="2" stroke-linecap="round"/><path d="M21 26v12m-6-6h12" stroke="url(#dark)" stroke-width="4.5" stroke-linecap="round"/><circle cx="43" cy="29" r="3.5" fill="url(#lilac)"/><circle cx="48" cy="36" r="3.5" fill="url(#dark)"/>',
  ticket: '<path d="M11 13h42v12a7 7 0 0 0 0 14v12H11V39a7 7 0 0 0 0-14Z" fill="url(#lilac)" stroke="#d6d1de" stroke-width="1"/><path d="M39 16v5m0 6v5m0 6v5m0 5v1" stroke="#ffffffb3" stroke-width="2" stroke-linecap="round"/><path d="m25 23 3 6 6 1-4 5 1 6-6-3-6 3 1-6-4-5 6-1Z" fill="url(#shell)"/>',
  phone: '<path d="M18 8c2-1 4 0 5 2l6 10c1 2 0 4-2 5l-5 3c3 7 8 12 15 15l3-5c1-2 3-3 5-2l10 6c2 1 3 3 2 5-2 7-6 11-12 10C25 54 10 39 7 19 6 13 11 9 18 8Z" fill="url(#dark)"/><path d="m16 12 7 11M43 41l9 5" stroke="#ffffff4d" stroke-width="2.5" stroke-linecap="round"/>',
  spark: '<path d="M32 6c3 15 11 23 26 26-15 3-23 11-26 26C29 43 21 35 6 32 21 29 29 21 32 6Z" fill="url(#metal)"/><path d="M32 10v21L12 32c11-4 16-10 20-22Z" fill="#ffffff9e"/>',
  meal: '<ellipse cx="32" cy="37" rx="27" ry="22" fill="#d7d6d2"/><ellipse cx="32" cy="34" rx="27" ry="22" fill="url(#shell)"/><ellipse cx="32" cy="34" rx="21" ry="16" fill="#e6e5e0" stroke="#ffffffd9" stroke-width="1.5"/><path d="M17 32c-5-7 1-15 9-11 7-8 17-3 15 5 12 2 12 14 3 16-1 9-14 8-16 2-11 5-18-6-11-12Z" fill="#fffdfa"/><circle cx="32" cy="33" r="9" fill="url(#yolk)"/><path d="M28 28c2-2 4-2 6-1" stroke="#fff0b6" stroke-width="2" stroke-linecap="round"/><path d="m15 27 3 1m25 11 3 1" stroke="#b5c3ac" stroke-width="2" stroke-linecap="round"/>',
  pencil: '<rect x="10" y="8" width="37" height="48" rx="8" fill="url(#shell)" stroke="#e0dfe3"/><path d="M18 21h20m-20 7h20m-20 7h11" stroke="#c6c3cb" stroke-width="2.5" stroke-linecap="round"/><g transform="rotate(26 44 31)"><rect x="40" y="7" width="9" height="39" rx="3" fill="url(#lilac)"/><path d="M40 15h9" stroke="#f7f5fb" stroke-width="3"/><path d="m40 46 4.5 9 4.5-9Z" fill="#d8cfc1"/><path d="m42.5 51 2 4 2-4Z" fill="#5b5661"/><path d="M43 20v23" stroke="#ffffff7d" stroke-width="1.5"/></g>'
};
let illustrationNumber = 0;
function illustration(name) {
  const id = 'oki-art-' + ++illustrationNumber + '-';
  const gradient = (key, light, mid, dark) => '<linearGradient id="' + id + key + '" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="' + light + '"/><stop offset=".48" stop-color="' + mid + '"/><stop offset="1" stop-color="' + dark + '"/></linearGradient>';
  const defs = gradient('shell','#ffffff','#eeedf0','#c9c9cd') + gradient('dark','#707074','#38383d','#1c1c21') + gradient('metal','#eff0f1','#b9babe','#818286') + gradient('lilac','#e4dfee','#c1b8d2','#9b91ae') + gradient('yolk','#ffe7a2','#edc575','#dca44b') + '<radialGradient id="' + id + 'globe" cx=".3" cy=".22" r=".85"><stop stop-color="#eef2e8"/><stop offset=".5" stop-color="#b8c7b4"/><stop offset="1" stop-color="#7e9488"/></radialGradient>';
  const shape = illustrationShapes[name] || '<rect x="8" y="8" width="48" height="48" rx="17" fill="url(#shell)" stroke="#ffffffc9"/><svg x="18" y="18" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#66646b" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (lineIcons[name] || lineIcons.smile) + '</svg>';
  return '<svg class="illustration-icon" viewBox="0 0 64 64" aria-hidden="true"><defs>' + defs + '</defs>' + shape.replace(/url\(#([a-z]+)\)/g, (_, key) => 'url(#' + id + key + ')') + '</svg>';
}
const lucideNames = { more:'ellipsis', speaker:'volume-2', 'speaker-off':'volume-x', back:'chevron-left', arrow:'chevron-right', close:'x', send:'arrow-up', settings:'settings-2', profile:'user-round', spark:'sparkles', switch:'users-round', chat:'message-circle', note:'notebook-pen', wave:'audio-lines', game:'gamepad-2', pin:'map-pin', book:'book-open', plant:'sprout', grid:'grid-3x3', device:'smartphone', help:'circle-help' };
function icon(name) {
  const figmaAssets = { speaker:'volume-2', phone:'phone', mic:'mic', close:'clear' };
  const path = figmaAssets[name] ? 'assets/' + figmaAssets[name] : 'assets/lucide/' + (lucideNames[name] || name);
  return '<img class="ui-icon" src="' + path + '.svg" width="24" height="24" alt="" aria-hidden="true">';
}
function art(name) { return illustration(name === 'cup' ? 'meal' : name); }
function decorate(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  root.querySelectorAll('[data-art]').forEach(el => { el.innerHTML = art(el.dataset.art); });
}
const phone = document.querySelector('.phone');
let toastTimer;
function toast(message) {
  phone.querySelector('.toast')?.remove();
  clearTimeout(toastTimer);
  const node = document.createElement('div');
  node.className = 'toast'; node.setAttribute('role', 'status'); node.textContent = message;
  phone.append(node); toastTimer = setTimeout(() => node.remove(), 2900);
}
function readStored(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function saveStored(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
let muted = readStored('oki-muted-v1', false) === true;
function updateSoundButtons() {
  document.querySelectorAll('[data-action="sound"], .sound-setting').forEach(button => {
    const symbol = button.querySelector('[data-icon]');
    if (symbol) { symbol.dataset.icon = muted ? 'speaker-off' : 'speaker'; symbol.innerHTML = icon(symbol.dataset.icon); }
    button.setAttribute('aria-pressed', String(muted));
    button.setAttribute('aria-label', muted ? '声音已关闭，点击开启' : '声音已开启，点击静音');
    button.classList.toggle('is-muted', muted);
    const label = button.querySelector('.control-label');
    if (label) label.textContent = muted ? '静音' : '声音';
    const copy = button.querySelector('.sound-setting-copy');
    if (copy) copy.textContent = muted ? '声音已关闭' : '声音已开启';
  });
  phone.dataset.muted = String(muted);
}
function toggleSound() {
  muted = !muted;
  saveStored('oki-muted-v1', muted);
  updateSoundButtons();
  window.dispatchEvent(new CustomEvent('oki:soundchange', { detail: { muted } }));
  toast(muted ? '已静音，安静地陪着你' : '声音已开启');
}
let mountedStageElement = null;
let disposeStage = null;
let mountVersion = 0;
function unmountStage() {
  mountVersion += 1;
  const cleanup = disposeStage;
  disposeStage = null;
  mountedStageElement?.remove();
  mountedStageElement = null;
  document.querySelector('.character-stage')?.classList.remove('is-mounted');
  if (cleanup) cleanup();
}
window.OKIStage = Object.freeze({
  mount(element, cleanup = null) {
    const host = document.querySelector('#characterMount');
    if (!host) throw new Error('This page has no character stage.');
    if (!(element instanceof Element)) throw new TypeError('Pass a canvas or renderer element to OKIStage.mount().');
    if (cleanup !== null && typeof cleanup !== 'function') throw new TypeError('Stage cleanup must be a function.');
    if (element.contains(host)) throw new TypeError('The renderer cannot contain its own stage.');
    unmountStage();
    host.append(element);
    mountedStageElement = element;
    disposeStage = cleanup;
    document.querySelector('.character-stage')?.classList.add('is-mounted');
    const version = mountVersion;
    return () => { if (version === mountVersion) unmountStage(); };
  },
  unmount: unmountStage,
  get element() { return mountedStageElement; },
  get muted() { return muted; }
});
let history = readStored('oki-history-v2', []);
if (!Array.isArray(history)) history = [];
history = history.filter(item => item && typeof item.user === 'string' && typeof item.reply === 'string');
let notes = readStored('oki-notes-v2', []);
if (!Array.isArray(notes)) notes = [];
notes = notes.filter(item => typeof item === 'string');
let currentOverlay = null;
let dialogNumber = 0;
let overlayCleanup = null;
function closeSheet() {
  if (!currentOverlay) return;
  const { element, returnFocus } = currentOverlay;
  const cleanup = overlayCleanup; overlayCleanup = null; cleanup?.();
  currentOverlay = null; element.remove();
  [...phone.children].forEach(child => { child.inert = false; });
  if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
}
function sheet(title, subtitle) {
  const returnFocus = currentOverlay?.returnFocus || document.activeElement;
  closeSheet();
  const overlay = document.createElement('div'); overlay.className = 'overlay';
  const section = document.createElement('section'); section.className = 'sheet';
  const id = 'dialog-title-' + ++dialogNumber;
  section.setAttribute('role', 'dialog'); section.setAttribute('aria-modal', 'true'); section.setAttribute('aria-labelledby', id);
  section.innerHTML = '<button class="close" aria-label="关闭"><span data-icon="close"></span></button><h2 id="' + id + '"></h2><p class="sheet-subtitle"></p>';
  section.querySelector('h2').textContent = title; section.querySelector('p').textContent = subtitle;
  [...phone.children].forEach(child => { child.inert = true; });
  overlay.append(section); phone.append(overlay); currentOverlay = { element: overlay, returnFocus };
  section.querySelector('.close').addEventListener('click', closeSheet);
  overlay.addEventListener('click', event => { if (event.target === overlay) closeSheet(); });
  decorate(section);
  section.querySelector('.close').focus({ preventScroll: true });
  return section;
}
function row(label, iconName, onClick, detail) {
  const button = document.createElement('button'); button.className = 'row';
  button.innerHTML = '<span data-icon="' + iconName + '"></span><span class="row-copy"></span><span data-icon="arrow"></span>';
  button.querySelector('.row-copy').textContent = label;
  if (detail) { const small = document.createElement('small'); small.textContent = detail; button.querySelector('.row-copy').append(small); }
  button.addEventListener('click', onClick); decorate(button); return button;
}
function manage() {
  const el = sheet('关于小宁', '你的日常陪伴伙伴');
  el.classList.add('about-sheet');
  const group = document.createElement('div'); group.className = 'grouped-list';
  group.append(row('小宁档案', 'profile', () => settings('档案'), '认识你的伙伴'), row('小宁的功能', 'spark', functionsPanel, '声音、记忆与更多能力'), row('切换角色', 'switch', () => settings('切换角色'), '小宁 · 当前伙伴'), row('设置', 'settings', () => { location.href = 'settings.html'; }));
  el.append(group);
}
function functionsPanel() {
  const el = sheet('小宁的功能', '生活里的小事，我们一起完成。');
  const group = document.createElement('div'); group.className = 'grouped-list';
  group.append(row('声音', 'wave', () => settings('声音')), row('记忆', 'heart', () => settings('记忆')), row('OKI 实体', 'device', () => settings('OKI 实体')), row('小小世界', 'spark', () => { location.href = 'world.html'; }));
  el.append(group);
}
function settings(title) {
  if (title === '设置') { location.href = 'settings.html'; return; }
  const descriptions = {
    档案: ['很高兴，成为你的生活搭子。', '小宁', '喜欢听你的日常，也愿意陪你试试新鲜事。'],
    声音: ['舒服的声音，让陪伴更近一点。', '午后微风', '温柔、清亮，语速不急不慢。'],
    记忆: ['被认真记住的小事，也会闪闪发亮。', '从今天开始认识你', '正式接入后，重要的偏好会在这里收好。'],
    'OKI 实体': ['把陪伴，从屏幕带到身边。', '等待你的 OKI', '设备连接入口 · 当前为离线演示。'],
    切换角色: ['每一位伙伴，都有自己的可爱。', '小宁 · 当前伙伴', '更多伙伴正在准备中。'],
    设置: ['让陪伴，刚刚好。', '本地演示', '消息与笔记仅保存在当前浏览器，不会上传。']
  };
  const info = descriptions[title]; const el = sheet(title, info[0]);
  const note = document.createElement('div'); note.className = 'empty-note'; note.textContent = info[1] + '\n' + info[2]; note.style.whiteSpace = 'pre-line'; el.append(note);
  if (title === '设置' || title === '声音') {
    const sound = row('', muted ? 'speaker-off' : 'speaker', toggleSound, '轻一点，或安静一点，都听你的');
    sound.classList.add('sound-setting');
    const soundCopy = document.createElement('span'); soundCopy.className = 'sound-setting-copy';
    sound.querySelector('.row-copy').prepend(soundCopy);
    el.append(sound);
    updateSoundButtons();
  }

}
function updateHistoryDot() { const dot = document.querySelector('.history-dot'); if (dot) dot.hidden = history.length === 0; }
function showHistory() {
  const el = sheet('我们聊过的小事', '聊天记录只留在这个浏览器里。');
  if (!history.length) { const empty = document.createElement('p'); empty.className = 'empty-note'; empty.textContent = '还没有聊过天呢。\n从今天的一件小事开始吧。'; empty.style.whiteSpace = 'pre-line'; el.append(empty, row('和小宁聊聊', 'chat', () => chat())); return; }
  history.slice(-20).reverse().forEach(item => el.append(row(item.user, 'chat', () => chat('', item), item.date || '今天')));
}
function responseFor(message, context = '') {
  const value = message + context;
  if (/水|提醒/.test(value)) return '那我们就约定，忙完手头这件事，先喝一杯温水。\n正式接入后，我还能按你设定的时间提醒你。';
  if (/吃|饭|晚餐|面/.test(value)) return '今天试试番茄鸡蛋面怎么样？热乎乎的一碗，简单也满足。也可以告诉我，你更想吃清淡的还是香辣的。';
  if (/累|烦|心情|难过/.test(value)) return '先不着急把事情都做好。歇一小会儿吧，我在这里，想说什么都可以。';
  if (/灵感|画|创作/.test(value)) return '试一个小开场：如果今天的心情是一种天气，会是什么？用三个词告诉我，我们一起往下想。';
  if (/故事|剧|扮演/.test(value)) return '故事从这里开始：一封没有署名的信，出现在了窗台上。你打开它，第一句话会是什么？';
  if (/棋|默契|表情|游戏/.test(value)) return '来个默契小热身吧：一个空闲的午后，你更想出门散步，还是窝在家里看电影？';
  return '听见啦。这一刻，值得被好好收下。想继续说说吗？我在听。';
}
function chat(context = '', record = null) {
  const el = sheet(context || '和小宁聊聊', '今天的小事，也值得被认真听见。');
  const log = document.createElement('div'); log.className = 'chat-log'; log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite'); log.setAttribute('aria-label', '聊天消息');
  function bubble(text, user = false) { const p = document.createElement('p'); p.className = 'bubble' + (user ? ' user' : ''); p.textContent = text; log.append(p); log.scrollTop = log.scrollHeight; }
  el.append(log);
  if (record) { bubble(record.user, true); bubble(record.reply); }
  else bubble(context ? responseFor(context) : '我在呢。今天有什么想和我分享的？');
  const form = document.createElement('form'); form.className = 'chat-form';
  form.innerHTML = '<input name="message" aria-label="消息" placeholder="想说什么，都可以…" maxlength="500" autocomplete="off" required><button class="send" type="submit" aria-label="发送消息"><span data-icon="send"></span></button>';
  form.addEventListener('submit', event => {
    event.preventDefault(); const input = form.elements.message; const message = input.value.trim(); if (!message) return;
    bubble(message, true); const reply = responseFor(message, context); bubble(reply); input.value = '';
    history.push({ user: message, reply, date: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) });
    history = history.slice(-50); saveStored('oki-history-v2', history); updateHistoryDot(); input.focus();
  });
  const note = document.createElement('p'); note.className = 'demo-note'; note.textContent = '本地对话演示 · 回复为预设内容';
  el.append(form, note); decorate(form); form.elements.message.focus({ preventScroll: true });
}
function notebook() {
  const el = sheet('小宁记事本', '把一闪而过的念头，轻轻放在这里。');
  const editor = document.createElement('textarea'); editor.setAttribute('aria-label', '笔记内容'); editor.placeholder = '今天，有什么想记住的？'; editor.maxLength = 2000;
  const save = document.createElement('button'); save.className = 'primary'; save.innerHTML = '<span data-icon="note"></span>收进记事本';
  save.addEventListener('click', () => { const value = editor.value.trim(); if (!value) { editor.focus(); return; } notes.unshift(value); notes = notes.slice(0, 30); const stored = saveStored('oki-notes-v2', notes); notebook(); toast(stored ? '这件小事，已经收好啦' : '已暂存本次演示，浏览器未允许持久保存'); });
  el.append(editor, save); decorate(save);
  notes.forEach(text => { const note = document.createElement('p'); note.className = 'saved-note'; note.textContent = text; el.append(note); });
  const hint = document.createElement('p'); hint.className = 'demo-note'; hint.textContent = '文字笔记可本地保存 · 照片、文档与提醒为后续接入内容'; el.append(hint);
}
function call() {
  const el = sheet('让声音陪你一会儿', '小宁的语音通话');
  el.insertAdjacentHTML('beforeend', '<div class="call-orbit"><span data-icon="phone"></span></div><p class="call-status">小宁在这儿，慢慢说。</p><button class="primary call-end"><span data-icon="phone"></span>结束通话</button><p class="demo-note">通话界面演示 · 未接入麦克风或实时服务</p>');
  el.querySelector('.call-end').addEventListener('click', closeSheet); decorate(el);
}
function experience(title) {
  const el = sheet(title, '不需要想好怎么说，我们一起开个头。');
  el.append(row('小宁，你先说', 'spark', () => chat(title)), row('我想自己说', 'chat', () => chat(title)));
}
const venues = [
  { title: '晚餐吃什么？\n听听肚子的主意', tag: '今日灵感 · 好好吃饭', description: '选择困难，就交给一点小惊喜。', heading: '小宁的拿手好戏', art: 'meal', color: '#f0f0ed', items: [
    ['eye', '火眼金睛', '拍一下，万物都认识', '生活'], ['wave', '方言玩家', '换种乡音，说点开心的', '灵感'], ['clock', '时间管家', '把忙碌的日子理一理', '生活'], ['wallet', '随手记账', '每一笔，都心中有数', '生活'], ['pin', '附近探店', '转角也许有惊喜', '生活'], ['book', '少儿启蒙', '陪小小好奇心长大', '成长'], ['camera', '拍照搭子', '留住今天的好心情', '灵感'], ['plant', '养花助手', '照顾窗边那一片绿', '生活']
  ] },
  { title: '你来画，我来猜\n默契能有几分？', tag: '一起同玩 · 快乐加倍', description: '画得随意，也能玩得尽兴。', heading: '双人快乐，现在开始', art: 'pencil', color: '#efedf2', items: [
    ['pencil', '你画我猜', '随手一画，脑洞大开', '灵感'], ['smile', '表情猜猜', '你的表情，我来读懂', '灵感'], ['grid', '五子棋', '来一场棋逢对手', '成长'], ['heart', '默契问答', '我们有多了解彼此', '生活'], ['book', '故事接龙', '下一句，由你决定', '灵感']
  ] },
  { title: '今晚的主角\n就是你和我', tag: '小小剧场 · 好戏开场', description: '一个开场，演出无限可能。', heading: '选个故事，一起入戏', art: 'world', color: '#eef0ed', items: [
    ['ticket', '即兴短剧', '给个情境，马上开演', '灵感'], ['profile', '角色扮演', '今天想成为谁', '灵感'], ['wave', '配音剧场', '用声音演一场好戏', '灵感'], ['chat', '讲方言专场', '乡音里的快乐加倍', '生活'], ['moon', '睡前故事', '把今晚，轻轻讲给你', '成长']
  ] }
];
let currentVenue = 0;
function renderCards(filter = '全部') {
  const cards = document.querySelector('#cards'); if (!cards) return;
  cards.replaceChildren();
  const items = venues[currentVenue].items.filter(item => filter === '全部' || item[3] === filter);
  items.forEach(([symbol, title, description], index) => {
    const button = document.createElement('button'); button.className = 'skill';
    button.style.setProperty('--tint', ['#efedf2', '#edf0ef', '#eef0e9', '#f0eeeb'][index % 4]);
    button.innerHTML = '<span class="skill-icon"><span data-icon="' + symbol + '"></span></span><span class="skill-arrow" data-icon="arrow"></span><strong>' + title + '</strong><small>' + description + '</small>';
    button.addEventListener('click', () => experience(title)); cards.append(button);
  });
  if (!items.length) { const empty = document.createElement('p'); empty.className = 'empty-filter'; empty.textContent = '这一类还在准备，去别处逛逛吧。'; cards.append(empty); }
  document.querySelector('#count').textContent = items.length + ' 个精选' + (currentVenue === 0 ? '本领' : '玩法');
  decorate(cards);
}
function category(filter) {
  document.querySelectorAll('[data-category]').forEach(button => { const selected = button.dataset.category === filter; button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', String(selected)); }); renderCards(filter);
}
function venue(index) {
  currentVenue = index; const data = venues[index];
  document.querySelectorAll('[data-venue]').forEach(button => { const active = Number(button.dataset.venue) === index; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  document.querySelector('#featureTitle').textContent = data.title;
  document.querySelector('#featureTitle').style.whiteSpace = 'pre-line';
  document.querySelector('#featureTag').textContent = data.tag;
  document.querySelector('#featureDesc').textContent = data.description;
  document.querySelector('#sectionTitle').textContent = data.heading;
  document.querySelector('#featureArt').innerHTML = art(data.art);
  document.querySelector('.feature').style.backgroundColor = data.color;
  document.querySelector('.world-scroll').scrollTop = 0; category('全部');
}
const actions = { menu: manage, more: manage, settings: () => settings('设置'), sound: toggleSound, notebook, history: showHistory, chat: () => chat(), call, voice: voiceMessage };
document.querySelectorAll('[data-action]').forEach(button => {
  const action = actions[button.dataset.action];
  if (action) button.addEventListener('click', action);
});
document.querySelectorAll('[data-experience]').forEach(button => button.addEventListener('click', () => experience(button.dataset.experience)));
document.querySelectorAll('[data-venue]').forEach(button => button.addEventListener('click', () => venue(Number(button.dataset.venue))));
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => category(button.dataset.category)));
document.querySelector('#featureTry')?.addEventListener('click', () => experience(['今天吃什么', '你画我猜', '即兴短剧'][currentVenue]));
document.addEventListener('keydown', event => {
  if (!currentOverlay) return;
  if (event.key === 'Escape') { closeSheet(); return; }
  if (event.key === 'Tab') {
    const focusable = [...currentOverlay.element.querySelectorAll('button,a[href],input,textarea,audio[controls],[tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
function appendHistory(message, reply) {
  history.push({ user: message, reply, date: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) });
  history = history.slice(-50); saveStored('oki-history-v2', history);
}
const composer = document.querySelector('#homeComposer');
if (composer) {
  const input = composer.elements.message;
  const send = document.querySelector('#homeSend');
  const clear = document.querySelector('#clearMessage');
  function updateComposer() { const filled = !!input.value.trim(); send.hidden = !filled; clear.hidden = filled; }
  input.addEventListener('input', updateComposer);
  input.addEventListener('keydown', event => { if (event.key === 'Escape') { input.value = ''; updateComposer(); } if (event.isComposing && event.key === 'Enter') event.preventDefault(); });
  clear.addEventListener('click', () => { input.value = ''; updateComposer(); input.focus(); });
  composer.addEventListener('submit', event => {
    event.preventDefault(); const message = input.value.trim(); if (!message) return;
    const reply = responseFor(message); appendHistory(message, reply);
    input.value = ''; updateComposer(); chat('', { user: message, reply });
  });
}
function voiceMessage() {
  const el = sheet('语音消息', '录好后可以先听一遍，再发送。');
  el.classList.add('voice-sheet');
  el.insertAdjacentHTML('beforeend', '<div class="record-orb"><span data-icon="mic"></span></div><p class="record-time" role="timer">00:00</p><p class="record-status" role="status">点下方按钮开始录音</p><audio class="voice-preview" controls hidden></audio><button class="primary record-toggle">开始录音</button><button class="primary send-recording" hidden>发送语音</button><p class="demo-note">录音仅在当前页面处理，不会上传。</p>');
  decorate(el);
  const toggle = el.querySelector('.record-toggle'), send = el.querySelector('.send-recording'), status = el.querySelector('.record-status'), audio = el.querySelector('audio');
  let recorder, stream, timer, url, started = 0, chunks = [], closed = false, duration = 0;
  function release() { clearInterval(timer); stream?.getTracks().forEach(track => track.stop()); document.querySelector('.character-stage')?.classList.remove('is-listening'); }
  overlayCleanup = () => { closed = true; if (recorder?.state === 'recording') recorder.stop(); release(); if (url) URL.revokeObjectURL(url); };
  toggle.addEventListener('click', async () => {
    if (recorder?.state === 'recording') { recorder.stop(); release(); return; }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { status.textContent = '这个浏览器暂不支持录音，请使用文字消息。'; return; }
    toggle.disabled = true; status.textContent = '请允许使用麦克风';
    try {
      stream = await navigator.mediaDevices.getUserMedia({audio:true});
      if (closed) { release(); return; }
      if (url) URL.revokeObjectURL(url); audio.hidden = true; send.hidden = true; chunks = [];
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => {
        release(); if (closed) return;
        duration = Math.max(1,Math.round((Date.now()-started)/1000));
        const blob = new Blob(chunks,{type:recorder.mimeType});
        if (!blob.size) { status.textContent = '没有录到声音，请再试一次'; toggle.textContent = '重新录音'; return; }
        url = URL.createObjectURL(blob); audio.src = url; audio.hidden = false; send.hidden = false; toggle.textContent = '重新录音'; status.textContent = '录音完成，可以试听'; el.classList.remove('is-recording');
      };
      recorder.onerror = () => { release(); if (!closed) { status.textContent = '录音中断，请重试'; toggle.disabled = false; el.classList.remove('is-recording'); } };
      started = Date.now(); recorder.start(); toggle.disabled = false; toggle.textContent = '结束录音'; status.textContent = '正在录音…'; el.classList.add('is-recording'); document.querySelector('.character-stage')?.classList.add('is-listening');
      timer = setInterval(() => { const sec=Math.floor((Date.now()-started)/1000); el.querySelector('.record-time').textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0'); if(sec>=60&&recorder.state==='recording')recorder.stop(); },250);
    } catch(error) { release(); if (!closed) { toggle.disabled=false; status.textContent = error.name==='NotAllowedError' ? '麦克风未获允许。可在浏览器设置中开启，或改用文字。' : '暂时无法使用麦克风，请检查设备后重试。'; } }
  });
  send.addEventListener('click', () => {
    if (!url) return;
    const sentURL=url; url=null;
    const dialog=sheet('和小宁聊聊','本地语音消息');
    const message=document.createElement('div'); message.className='bubble user';
    const label=document.createElement('p'); label.textContent='语音消息 · '+duration+' 秒';
    const player=document.createElement('audio'); player.controls=true; player.src=sentURL; message.append(label,player); dialog.append(message);
    const note=document.createElement('p'); note.className='demo-note'; note.textContent='已发送到本地演示会话 · 暂未接入语音识别与 AI 回复'; dialog.append(note);
    overlayCleanup=()=>URL.revokeObjectURL(sentURL);
  });
}
function setupSettingsPage() {
  const main=document.querySelector('#settingsGroups'); if(!main)return;
  const sound=main.querySelector('[data-action="sound"]');
  const reduce=main.querySelector('#reduceTransparency');
  reduce.checked=readStored('oki-reduce-transparency',false)===true;
  reduce.addEventListener('change',()=>{saveStored('oki-reduce-transparency',reduce.checked);phone.classList.toggle('reduce-transparency',reduce.checked);});
  main.querySelector('#clearHistory').addEventListener('click',()=>{
    const el=sheet('清空聊天记录？','聊天记录清空后无法恢复，记事本内容会保留。');
    el.append(row('保留记录','back',closeSheet),row('清空聊天记录','history',()=>{history=[];saveStored('oki-history-v2',history);closeSheet();toast('聊天记录已清空');}));
  });
  main.querySelector('#aboutApp').addEventListener('click',()=>{
    const el=sheet('关于 OKI','和小宁一起，发现日常的小惊喜。');
    const note=document.createElement('p');note.className='empty-note';note.textContent='笔试交互原型 · 模块一。文字使用本地预设回复；录音在设备内处理；电话为界面演示。';el.append(note);
  });
}
phone.classList.toggle('reduce-transparency',readStored('oki-reduce-transparency',false)===true);
decorate(); renderCards(); updateHistoryDot(); updateSoundButtons(); setupSettingsPage();
