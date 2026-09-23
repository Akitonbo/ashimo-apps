/* 色見本ページ：色を選ぶ・微調整する・色コードをコピーする */
(() => {
  'use strict';

  const PALETTES = window.SITE_PALETTES;
  const FAV_KEY = 'iroapps.favorites';   // カラーラボとお気に入りを共有
  const $ = id => document.getElementById(id);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const state = { hsl: { h: 251, s: 100, l: 68 }, name: '色見本', pick: 'preset' };
  let currentPal = Object.keys(PALETTES)[0];
  let favorites = loadFavs();

  // ===== 色の変換 =====
  function hexToRgb(hex) {
    let m = String(hex).trim().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(m)) m = m.split('').map(c => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(m)) return null;
    return [0, 2, 4].map(i => parseInt(m.slice(i, i + 2), 16));
  }
  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h, s: s * 100, l: l * 100 };
  }
  function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  }
  const hslToHex = (h, s, l) => rgbToHex(...hslToRgb(((h % 360) + 360) % 360, clamp(s, 0, 100), clamp(l, 0, 100)));
  function hexToHsv(hex) {
    const [r, g, b] = hexToRgb(hex).map(v => v / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0;
    if (d) {
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h, s: max ? (d / max) * 100 : 0, v: max * 100 };
  }
  function hsvToHex(h, sv, v) {
    const s = sv / 100, val = v / 100;
    const c = val * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = val - c;
    const i = Math.floor((((h % 360) + 360) % 360) / 60);
    const [r, g, b] = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][i];
    return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
  }
  function luminance(hex) {
    const c = hexToRgb(hex).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  const isLight = hex => luminance(hex) > 0.45;
  function contrast(a, b) {
    const [L1, L2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (L1 + 0.05) / (L2 + 0.05);
  }

  const currentHex = () => hslToHex(state.hsl.h, state.hsl.s, state.hsl.l);

  function setHsl(h, s, l, name = 'カスタム') {
    state.hsl = { h: clamp(h, 0, 360), s: clamp(s, 0, 100), l: clamp(l, 0, 100) };
    state.name = name;
    render();
  }
  function setHex(hex, name) {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;
    state.hsl = rgbToHsl(...rgb);
    state.name = name ?? findName(rgbToHex(...rgb));
    render();
    return true;
  }
  function findName(hex) {
    for (const list of Object.values(PALETTES)) {
      const hit = list.find(([, v]) => v.toUpperCase() === hex);
      if (hit) return hit[0];
    }
    return 'カスタム';
  }

  // ===== 画面の更新 =====
  const sliders = ['h', 's', 'l', 'r', 'g', 'b'];

  function render() {
    const hex = currentHex();
    const rgb = hexToRgb(hex);
    const [h, s, l] = [state.hsl.h, state.hsl.s, state.hsl.l].map(Math.round);
    const codes = { hex, rgb: `rgb(${rgb.join(', ')})`, hsl: `hsl(${h}, ${s}%, ${l}%)` };
    state.codes = codes;

    const fg = !isLight(hex) ? '#FFFFFF'
      : contrast(hex, '#5A5652') >= 4.5 ? '#5A5652' : '#3F3C39';
    const sw = $('swatch');
    sw.style.background = hex;
    sw.style.color = fg;
    $('swatchHex').textContent = hex;
    $('swatchName').textContent = state.name;
    $('mbChip').style.background = hex;
    $('mbHex').textContent = hex;

    const vals = { h, s, l, r: rgb[0], g: rgb[1], b: rgb[2] };
    sliders.forEach(k => {
      if (document.activeElement !== $(k)) $(k).value = vals[k];
      if (document.activeElement !== $(k + 'N')) $(k + 'N').value = vals[k];
    });
    $('h').style.background = `linear-gradient(90deg, ${[0, 60, 120, 180, 240, 300, 360].map(x => hslToHex(x, s, l)).join(',')})`;
    $('s').style.background = `linear-gradient(90deg, ${hslToHex(h, 0, l)}, ${hslToHex(h, 100, l)})`;
    $('l').style.background = `linear-gradient(90deg, #000, ${hslToHex(h, s, 50)}, #fff)`;
    $('r').style.background = `linear-gradient(90deg, ${rgbToHex(0, rgb[1], rgb[2])}, ${rgbToHex(255, rgb[1], rgb[2])})`;
    $('g').style.background = `linear-gradient(90deg, ${rgbToHex(rgb[0], 0, rgb[2])}, ${rgbToHex(rgb[0], 255, rgb[2])})`;
    $('b').style.background = `linear-gradient(90deg, ${rgbToHex(rgb[0], rgb[1], 0)}, ${rgbToHex(rgb[0], rgb[1], 255)})`;

    const hsv = hexToHsv(hex);
    $('spectrum').style.setProperty('--sp-hue', Math.round(hsv.h));
    $('spCursor').style.left = hsv.s + '%';
    $('spCursor').style.top = (100 - hsv.v) + '%';
    $('spCursor').style.background = hex;
    if (document.activeElement !== $('spHue')) $('spHue').value = Math.round(hsv.h);

    [['hexIn', 'hex'], ['rgbIn', 'rgb'], ['hslIn', 'hsl']].forEach(([id, k]) => {
      if (document.activeElement !== $(id)) $(id).value = codes[k];
    });

    $('tints').innerHTML = [95, 85, 75, 65, 55, 45, 35, 25, 15]
      .map(L => `<button type="button" style="background:${hslToHex(h, s, L)}" data-hex="${hslToHex(h, s, L)}" title="明度${L}%"></button>`).join('');

    renderContrast($('cWhite'), hex, '#FFFFFF', '白文字');
    renderContrast($('cBlack'), hex, '#3F3C39', '濃いグレーの文字');

    // 選び方に応じて表示を切り替える
    const preset = state.pick === 'preset';
    document.querySelectorAll('[data-pick]').forEach(b => b.setAttribute('aria-pressed', b.dataset.pick === state.pick));
    $('palettePanel').hidden = !preset;
    $('favPanel').hidden = !preset;
    $('sliderPanel').hidden = preset;

    document.querySelectorAll('#palette .chip, #favs .chip').forEach(c => c.classList.toggle('is-current', c.dataset.hex === hex));
    history.replaceState(null, '', '#' + hex.slice(1));
  }

  function renderContrast(el, bg, text, label) {
    const ratio = contrast(bg, text);
    const grade = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? '大きい文字のみ' : '読みにくい';
    el.style.background = bg;
    el.style.color = text;
    el.innerHTML = `${label} Aa あ<small>コントラスト比 ${ratio.toFixed(2)} <span class="badge">${grade}</span></small>`;
  }

  function renderPalTabs() {
    $('palTabs').innerHTML = Object.keys(PALETTES).map(k =>
      `<button type="button" class="btn btn-sm ${k === currentPal ? 'btn-primary' : ''}" data-pal="${k}">${k}</button>`
    ).join('');
    $('palette').innerHTML = PALETTES[currentPal].map(([name, hex]) =>
      `<div class="chip-wrap"><button type="button" class="chip" style="background:${hex}" data-hex="${hex.toUpperCase()}" data-name="${name}" aria-label="${name} ${hex}"></button><span class="chip-label">${name}</span></div>`
    ).join('');
  }

  // ===== お気に入り =====
  function loadFavs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; }
  }
  function saveFavs() {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favorites)); } catch { /* 保存不可の環境では無視 */ }
  }
  function renderFavs() {
    $('favs').innerHTML = favorites.map(f =>
      `<div class="chip-wrap"><div style="position:relative"><button type="button" class="chip" style="background:${f.hex};width:100%" data-hex="${f.hex}" data-name="${f.name}" aria-label="${f.name} ${f.hex}"></button><button type="button" class="chip-remove" data-remove="${f.hex}" aria-label="削除">×</button></div><span class="chip-label">${f.hex}</span></div>`
    ).join('');
    $('favEmpty').hidden = favorites.length > 0;
    $('favClearAll').hidden = favorites.length === 0;
  }

  // ===== 小物 =====
  let toastTimer;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
  }
  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    toast(`コピーしました：${text}`);
  }

  // ===== 操作 =====
  ['h', 's', 'l'].forEach(k => {
    const handler = e => {
      const v = Number(e.target.value);
      if (e.target.value === '' || Number.isNaN(v)) return;
      const { h, s, l } = state.hsl;
      setHsl(k === 'h' ? v : h, k === 's' ? v : s, k === 'l' ? v : l);
    };
    $(k).addEventListener('input', handler);
    $(k + 'N').addEventListener('input', handler);
  });
  ['r', 'g', 'b'].forEach((k, i) => {
    const handler = e => {
      const v = Number(e.target.value);
      if (e.target.value === '' || Number.isNaN(v)) return;
      const rgb = hexToRgb(currentHex());
      rgb[i] = clamp(Math.round(v), 0, 255);
      setHex(rgbToHex(...rgb), 'カスタム');
    };
    $(k).addEventListener('input', handler);
    $(k + 'N').addEventListener('input', handler);
  });
  document.querySelectorAll('[data-mode]').forEach(btn => btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', b === btn));
    $('hslSliders').hidden = mode !== 'hsl';
    $('rgbSliders').hidden = mode !== 'rgb';
  }));

  $('hexIn').addEventListener('input', e => setHex(e.target.value));
  $('rgbIn').addEventListener('input', e => {
    const m = e.target.value.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/);
    if (m) setHex(rgbToHex(...m.slice(1, 4).map(v => clamp(Number(v), 0, 255))), 'カスタム');
  });
  $('hslIn').addEventListener('input', e => {
    const m = e.target.value.match(/(\d{1,3}(?:\.\d+)?)\D+(\d{1,3}(?:\.\d+)?)\D+(\d{1,3}(?:\.\d+)?)/);
    if (m) setHsl(...m.slice(1, 4).map(Number));
  });
  ['hexIn', 'rgbIn', 'hslIn'].forEach(id => $(id).addEventListener('blur', render));

  // スペクトラム
  const spBox = $('spectrum');
  let spDragging = false;
  const pickFromEvent = e => {
    const r = spBox.getBoundingClientRect();
    const sv = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100);
    const v = clamp(100 - ((e.clientY - r.top) / r.height) * 100, 0, 100);
    setHex(hsvToHex(Number($('spHue').value), sv, v), 'カスタム');
  };
  spBox.addEventListener('pointerdown', e => { spDragging = true; spBox.setPointerCapture(e.pointerId); pickFromEvent(e); });
  spBox.addEventListener('pointermove', e => { if (spDragging) pickFromEvent(e); });
  ['pointerup', 'pointercancel'].forEach(ev => spBox.addEventListener(ev, () => { spDragging = false; }));
  $('spHue').addEventListener('input', e => {
    const cur = hexToHsv(currentHex());
    setHex(hsvToHex(Number(e.target.value), cur.s, cur.v), 'カスタム');
  });

  document.addEventListener('click', e => {
    const t = e.target;
    const copyBtn = t.closest('[data-copy]');
    if (copyBtn) return copy(state.codes[copyBtn.dataset.copy]);

    const pk = t.closest('[data-pick]');
    if (pk) { state.pick = pk.dataset.pick; return render(); }

    const remove = t.closest('[data-remove]');
    if (remove) {
      favorites = favorites.filter(f => f.hex !== remove.dataset.remove);
      saveFavs(); renderFavs(); render();
      return;
    }
    const pal = t.closest('[data-pal]');
    if (pal) { currentPal = pal.dataset.pal; renderPalTabs(); render(); return; }

    const colorEl = t.closest('[data-hex]');
    if (colorEl) setHex(colorEl.dataset.hex, colorEl.dataset.name);
  });

  $('favAdd').addEventListener('click', () => {
    const hex = state.codes.hex;
    if (favorites.some(f => f.hex === hex)) return toast('すでにお気に入りにあります');
    favorites.unshift({ hex, name: state.name });
    favorites = favorites.slice(0, 40);
    saveFavs(); renderFavs(); render();
    toast(`${hex} をお気に入りに追加しました`);
  });
  $('favClearAll').addEventListener('click', () => {
    if (!favorites.length) return;
    if (!confirm(`お気に入りの${favorites.length}色をすべて削除します。よろしいですか？`)) return;
    favorites = [];
    saveFavs(); renderFavs(); render();
    toast('お気に入りをすべて削除しました');
  });
  $('randomBtn').addEventListener('click', () =>
    setHsl(Math.random() * 360, 45 + Math.random() * 45, 35 + Math.random() * 35, 'カスタム'));

  // ===== 初期化 =====
  renderPalTabs();
  renderFavs();
  if (!setHex(location.hash)) render();
})();
