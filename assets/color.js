(() => {
  'use strict';

  // ===== パレットデータ（値は差し替え・追加自由） =====
  const PALETTES = window.SITE_PALETTES;

  // 先頭4つはアプリ（WeighTone）のプリセットテーマと同じ色
  const GRADIENT_PRESETS = [
    ['サンセット', ['#FFB37B', '#E2598F', '#3D2166']],
    ['オーロラ', ['#6DFBDC', '#1C8BB0', '#0A1F42']],
    ['ミント', ['#EAFFF5', '#C3F3DD', '#7FDCAE']],
    ['モノクローム', ['#37383D', '#202126', '#0D0E10']],
    ['マネトーン', ['#00E5FF', '#4FA3F0', '#8A4DFF']],
    ['WeighTone', ['#FFD166', '#FF8A5C', '#E05A8F']],
    ['桜もち', ['#FEF4F4', '#F4B3C2', '#68BE8D']],
    ['ピーチ', ['#FFE0B2', '#FFAB91', '#F06292']],
    ['いちごミルク', ['#FFF5F7', '#FAD2E1', '#F15BB5']],
    ['ラムネ', ['#E0F7FF', '#7FD6F0', '#3A7BD5']],
    ['南の海', ['#BDEFF2', '#2EC4B6', '#0F4C5C']],
    ['レモンソーダ', ['#FFF9C4', '#C5F2A0', '#4DD0E1']],
    ['若葉', ['#F5FBE8', '#B0CA71', '#316745']],
    ['抹茶ラテ', ['#FBFAF5', '#C5C56A', '#5B6B3A']],
    ['ぶどう', ['#E2D1F5', '#9B5DE5', '#3B1F6E']],
    ['ラベンダー畑', ['#F1D1EF', '#A59ACA', '#5654A2']],
    ['夜明け', ['#223A70', '#F4B3C2', '#F8B500']],
    ['夕焼け', ['#F8B500', '#EB6101', '#7B1E3A']],
    ['夜空', ['#0A1F42', '#1F2F57', '#5654A2', '#E2D1F5']],
    ['紅葉', ['#F39800', '#D0576B', '#6D2E46']],
    ['カフェモカ', ['#EDE3D2', '#C19A6B', '#4E342E']],
    ['くすみブルー', ['#E3E8EE', '#7D93A6', '#4F5D75']],
    ['スモーキーローズ', ['#F5E6E0', '#C49A9A', '#9E7E93']],
    ['トロピカル', ['#FFD93D', '#FF7F50', '#F15BB5', '#6366F1']],
    ['シルバー', ['#FFFFFF', '#D9D9D9', '#8A8A8A']],
    ['サンライズ', ['#FFE29F', '#FFA99F', '#FF719A']],
    ['オーシャン', ['#A8EDEA', '#57C1EB', '#246FA8']],
    ['ミントチョコ', ['#D5F5E3', '#58D68D', '#34495E']],
    ['チェリーブロッサム', ['#FFF0F5', '#FFC0CB', '#E75480']],
    ['グレープソーダ', ['#E0C3FC', '#A18CD1', '#6A11CB']],
    ['フォレスト', ['#D7F3D2', '#7CB342', '#2E5D34']],
    ['コーラルリーフ', ['#FFE0C7', '#FF9A76', '#E05C5C']],
    ['ブルーベリーミルク', ['#F3E9FF', '#B39CD0', '#5E60CE']],
    ['モーニングコーヒー', ['#F3E0C7', '#C08B5C', '#5A3826']],
    ['アイスミント', ['#F0FFFB', '#A8E6CF', '#3AAFA9']],
    ['サニーデイ', ['#FFF6B7', '#FFD36E', '#F39C12']],
    ['ナイトスカイ', ['#4B6CB7', '#28356B', '#141E30']],
    ['キャンディ', ['#FBC2EB', '#A6C1EE', '#7F7FD5']],
    ['はちみつレモン', ['#FFFBD5', '#FDE68A', '#E8A33D']],
    ['スモーキーパープル', ['#EDE7F6', '#9E8FB2', '#5E5470']],
    ['真夏の空', ['#D7F0FF', '#4FB8F0', '#0B5FA5']],
  ];

  const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
  const DEFAULT_COLOR = '#7B5CFF'; // アプリの DEFAULT_CUSTOM_COLOR

  // アプリの utils/theme.js と同じ値
  const BASES = {
    dark: { bg: ['#15161A', '#1C1E24', '#22242B'], card: '#1F2128', text: '#F5F5F7', sub: 'rgba(245,245,247,0.65)', anchor: '#000000', ratio: 0.62 },
    gray: { bg: ['#505259', '#505259'], card: '#4A4C53', text: '#F5F5F7', sub: 'rgba(245,245,247,0.7)', anchor: '#505259', ratio: 0.55 },
    light: { bg: ['#FFFFFF', '#F7F7F9', '#EEF0F4'], card: '#FFFFFF', text: '#3C3F45', sub: 'rgba(60,63,69,0.65)', anchor: '#FFFFFF', ratio: 0.6 },
  };

  // ===== 状態 =====
  const state = {
    base: DEFAULT_COLOR,     // ベースカラー（単色・おまかせで使う色）
    gmode: 'auto',           // 'solid' | 'auto' | 'pro'
    stops: null,             // 詳細設定のストップ [{id, color, pos}]
    angle: 90,               // 詳細設定の方向（0=上、時計回り）
    selectedId: null,
    baseMode: 'dark',
    app: 'weightone',        // 'manetone' | 'weightone'
    mBase: 'light',          // マネトーンの背景色（白／グレー／黒）
    mMode: 'solid',          // マネトーン: 'solid' | 'grad'
    mStops: null,            // マネトーンの3色 [{id, color, pos}]
    mSel: 'base',            // マネトーンで編集中の対象: 'base' | 0 | 1 | 2
    pick: 'preset',          // 色の決め方: 'preset'（見本から） | 'custom'（自分で調整）
    edit: { h: 0, s: 0, l: 0 }, // いま編集中の色（HSL）
    name: 'ベースカラー',
  };
  const FAV_KEY = 'iroapps.favorites';
  let favorites = loadFavs();
  let currentPal = '和色';
  let uidSeq = 0;
  const uid = () => `s${Date.now().toString(36)}${uidSeq++}`;

  // ===== 色変換（アプリの utils/color.js と同じ計算） =====
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function hexToRgb(hex) {
    let m = String(hex).trim().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(m)) m = m.split('').map(c => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(m)) return null;
    return [0, 2, 4].map(i => parseInt(m.slice(i, i + 2), 16));
  }
  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
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
  const hexToHsl = hex => rgbToHsl(...hexToRgb(hex));
  // スペクトラム用：色相＋彩度(横)＋明るさ(縦) の HSV
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
    const i = Math.floor(((h % 360) + 360) % 360 / 60);
    const [r, g, b] = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][i];
    return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
  }
  function mix(a, b, t) {
    const A = hexToRgb(a), B = hexToRgb(b);
    return rgbToHex(...A.map((v, i) => v + (B[i] - v) * t));
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

  // ===== アプリと同じテーマ生成ロジック =====
  // theme.js: deriveDefaultGradientStops
  function deriveDefaultStops(color) {
    const { h, s, l } = hexToHsl(color);
    const dark = hslToHex(h, Math.min(s, 65), Math.round(Math.max(l - 24, 6)));
    const light = hslToHex((h + 22) % 360, Math.min(s + 8, 75), Math.round(Math.min(l + 20, 92)));
    return [
      { id: uid(), color: dark, pos: 0 },
      { id: uid(), color: color.toUpperCase(), pos: 50 },
      { id: uid(), color: light, pos: 100 },
    ];
  }
  const sortedStops = () => [...state.stops].sort((a, b) => a.pos - b.pos);
  const isMane = () => state.app === 'manetone';
  // いま表示しているモード（マネトーンは solid / grad）
  const mode = () => isMane() ? state.mMode : state.gmode;
  // 編集中のストップ配列（マネトーンは3色固定）
  const editStops = () => isMane() ? state.mStops : state.stops;
  const sortedEditStops = () => [...(editStops() || [])].sort((a, b) => a.pos - b.pos);

  // マネトーン utils/colors.js: deriveGradientStops（基本色から3色を自動で作る）
  function deriveManeStops(color) {
    // 上を明るく・下を深く。アプリより強めのコントラストにしている
    return [
      { id: uid(), color: mix(color, '#FFFFFF', 0.42), pos: 0 },
      { id: uid(), color: color.toUpperCase(), pos: 50 },
      { id: uid(), color: mix(color, '#000000', 0.3), pos: 100 },
    ];
  }
  function ensureManeStops() {
    if (!state.mStops) state.mStops = deriveManeStops(state.base);
  }
  // 基本色（文字・アイコンの色）の初期値は、グラデーションの真ん中の色
  function baseFromMiddle() {
    if (!state.mStops?.length) return;
    const st = sortedEditStops();
    state.base = st.reduce((c, x) => Math.abs(x.pos - 50) < Math.abs(c.pos - 50) ? x : c).color;
  }

  // theme.js: buildCustomPalette の background / locations / accent
  function currentTheme() {
    let colors, positions, angle, anchor = state.base;
    if (isMane()) {
      // マネトーン：基本色はそのまま文字・アイコンの色。グラデーションは3色・上→下のみ
      if (state.mMode === 'grad') {
        ensureManeStops();
        const st = sortedEditStops();
        colors = st.map(s => s.color);
        positions = st.map(s => s.pos);
      } else {
        colors = [state.base, state.base];
        positions = [0, 100];
      }
      return { colors, positions, angle: 180, accent: state.base };
    }
    if (state.gmode === 'pro') {
      const st = sortedStops();
      colors = st.map(s => s.color);
      positions = st.map(s => s.pos);
      angle = state.angle;
      anchor = st.reduce((c, s) => Math.abs(s.pos - 50) < Math.abs(c.pos - 50) ? s : c).color;
    } else if (state.gmode === 'solid') {
      colors = [state.base, state.base];
      angle = 180;
    } else {
      colors = deriveDefaultStops(state.base).map(s => s.color);
      angle = 180; // 詳細設定なしのときは上→下
    }
    positions = positions || colors.map((_, i) => Math.round((i / (colors.length - 1)) * 100));
    const { h, s, l } = hexToHsl(anchor);
    const light = isLight(colors[0]);
    const accent = hslToHex(h, s < 8 ? s : Math.max(s, 55), light ? Math.min(l, 55) : Math.max(l, 45));
    return { colors, positions, angle, accent };
  }
  const cssGradient = (colors, positions, angle) =>
    `linear-gradient(${angle}deg, ${colors.map((c, i) => `${c} ${positions[i]}%`).join(', ')})`;

  function colorAt(pos) {
    const st = sortedStops();
    if (pos <= st[0].pos) return st[0].color;
    const last = st[st.length - 1];
    if (pos >= last.pos) return last.color;
    for (let i = 0; i < st.length - 1; i++) {
      const a = st[i], b = st[i + 1];
      if (pos >= a.pos && pos <= b.pos) return mix(a.color, b.color, b.pos === a.pos ? 0 : (pos - a.pos) / (b.pos - a.pos));
    }
    return st[0].color;
  }

  // ===== 編集対象（ベースカラー or 選択中のストップ） =====
  const selectedStop = () => {
    if (isMane()) return state.mMode === 'grad' && typeof state.mSel === 'number' ? state.mStops?.[state.mSel] ?? null : null;
    return state.gmode === 'pro' ? state.stops?.find(s => s.id === state.selectedId) ?? null : null;
  };
  const editingHex = () => selectedStop()?.color ?? state.base;

  function loadEditFromTarget() {
    state.edit = hexToHsl(editingHex());
  }
  function writeEdit(name = 'カスタム') {
    const hex = hslToHex(state.edit.h, state.edit.s, state.edit.l);
    const stop = selectedStop();
    if (stop) stop.color = hex; else state.base = hex;
    state.name = name;
    render();
  }
  function setEditHsl(h, s, l, name) {
    state.edit = { h: clamp(h, 0, 360), s: clamp(s, 0, 100), l: clamp(l, 0, 100) };
    writeEdit(name);
  }
  function setEditHex(hex, name) {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;
    state.edit = rgbToHsl(...rgb);
    writeEdit(name ?? findName(rgbToHex(...rgb)));
    return true;
  }
  function findName(hex) {
    for (const list of Object.values(PALETTES)) {
      const hit = list.find(([, v]) => v.toUpperCase() === hex);
      if (hit) return hit[0];
    }
    return 'カスタム';
  }

  // ===== DOM =====
  const $ = id => document.getElementById(id);
  const sliders = ['h', 's', 'l', 'r', 'g', 'b'];

  function render() {
    const hex = editingHex();
    const rgb = hexToRgb(hex);
    const { h: hf, s: sf, l: lf } = state.edit;
    const [h, s, l] = [hf, sf, lf].map(Math.round);
    // 明るい色なら濃いグレー、暗い色なら白。読みにくいときは黒まで濃くする
    const fg = !isLight(hex) ? '#FFFFFF'
      : contrast(hex, '#5A5652') >= 4.5 ? '#5A5652' : '#3F3C39';
    state.codes = { hex, rgb: `rgb(${rgb.join(', ')})`, hsl: `hsl(${h}, ${s}%, ${l}%)` };

    // 大きいスウォッチ
    const sw = $('swatch');
    const stop = selectedStop();
    sw.style.background = hex;
    sw.style.color = fg;
    $('swatchHex').textContent = hex;
    $('swatchName').textContent = stop
      ? `色${sortedEditStops().indexOf(stop) + 1}（${stop.pos}%）を編集中`
      : state.name === 'カスタム' ? 'ベースカラー' : state.name;
    $('mbChip').style.background = hex;
    $('mbHex').textContent = hex;

    // スライダー
    const vals = { h, s, l, r: rgb[0], g: rgb[1], b: rgb[2] };
    sliders.forEach(k => {
      if (document.activeElement !== $(k)) $(k).value = vals[k];
      if (document.activeElement !== $(k + 'N')) $(k + 'N').value = vals[k];
    });
    // スペクトラム（色の面）の表示位置と色相
    const hsv = hexToHsv(hex);
    const sp = $('spectrum');
    if (sp) {
      sp.style.setProperty('--sp-hue', Math.round(hsv.h));
      $('spCursor').style.left = hsv.s + '%';
      $('spCursor').style.top = (100 - hsv.v) + '%';
      $('spCursor').style.background = hex;
      if (document.activeElement !== $('spHue')) $('spHue').value = Math.round(hsv.h);
    }

    $('h').style.background = `linear-gradient(90deg, ${[0, 60, 120, 180, 240, 300, 360].map(x => hslToHex(x, s, l)).join(',')})`;
    $('s').style.background = `linear-gradient(90deg, ${hslToHex(h, 0, l)}, ${hslToHex(h, 100, l)})`;
    $('l').style.background = `linear-gradient(90deg, #000, ${hslToHex(h, s, 50)}, #fff)`;
    $('r').style.background = `linear-gradient(90deg, ${rgbToHex(0, rgb[1], rgb[2])}, ${rgbToHex(255, rgb[1], rgb[2])})`;
    $('g').style.background = `linear-gradient(90deg, ${rgbToHex(rgb[0], 0, rgb[2])}, ${rgbToHex(rgb[0], 255, rgb[2])})`;
    $('b').style.background = `linear-gradient(90deg, ${rgbToHex(rgb[0], rgb[1], 0)}, ${rgbToHex(rgb[0], rgb[1], 255)})`;

    [['hexIn', 'hex'], ['rgbIn', 'rgb'], ['hslIn', 'hsl']].forEach(([id, k]) => {
      if (document.activeElement !== $(id)) $(id).value = state.codes[k];
    });

    $('tints').innerHTML = [95, 85, 75, 65, 55, 45, 35, 25, 15]
      .map(L => colorBtn(hslToHex(h, s, L), `明度${L}%`)).join('');

    // 文字の読みやすさの欄は廃止

    const theme = currentTheme();
    renderGradient(theme);
    renderPreview(theme);
    renderPickFlow();
    renderApplyLink();
    fitPreview();

    document.querySelectorAll('#palette .chip, #favs .chip').forEach(c => c.classList.toggle('is-current', c.dataset.hex === hex));
    document.documentElement.style.setProperty('--accent', theme.accent);
    writeHash();
  }

  const colorBtn = (hex, title = hex) =>
    `<button type="button" style="background:${hex}" data-hex="${hex}" title="${title}" aria-label="${title}"></button>`;


  // ===== グラデーション =====

  // 「色の種類」「決め方」に合わせて、必要なパネルだけを表示する
  function renderPickFlow() {
    const isGrad = mode() !== 'solid';
    const preset = state.pick === 'preset';
    document.querySelectorAll('[data-type]').forEach(b =>
      b.setAttribute('aria-pressed', (b.dataset.type === 'grad') === isGrad));
    document.querySelectorAll('[data-pick]').forEach(b =>
      b.setAttribute('aria-pressed', b.dataset.pick === state.pick));
    $('gradKindRow').hidden = !isGrad || isMane();
    $('pickLabel').textContent = isGrad && !isMane() ? '③ 色の決め方' : '② 色の決め方';

    // 「基本色」を編集中は、単色と同じ色選びの画面を出す
    const editingBase = isMane() && isGrad && state.mSel === 'base';
    const singleUI = !isGrad || editingBase;
    $('palettePanel').hidden = !preset || !singleUI;
    $('favPanel').hidden = !preset || !singleUI;
    $('sliderPanel').hidden = preset;
    $('codePanel').hidden = preset;
    $('tintPanel').hidden = preset || !singleUI;

    // グラデーション用のパネル
    $('gradientPanel').hidden = !isGrad;
    // まとめてコピーはグラデーション（複数色）のときだけ
    $('copyStops').hidden = !isGrad;
    $('presetBlock').hidden = !isGrad || !preset || editingBase;
    $('gradPanelTitle').textContent = preset ? 'グラデーションを選ぶ' : 'グラデーションを調整する';

    // 表示されている最初のブロックには区切り線を出さない（選択バーと一体に見せる）
    let firstVisible = true;
    document.querySelectorAll('#pickBox .sub-block').forEach(b => {
      const shown = !b.hidden;
      b.classList.toggle('is-first', shown && firstVisible);
      if (shown) firstVisible = false;
    });

    // 見本から選ぶときは、色の一覧だけを見せる（編集用のバーは隠す）
    const editable = isGrad && (isMane() ? state.mMode === 'grad' : (!preset && state.gmode === 'pro'));
    $('proEditor').hidden = !editable;
    $('angleBlock').hidden = isMane() || !isGrad || state.gmode !== 'pro';
  }

  function renderGradient(theme) {
    const m = mode();
    $('proToggle')?.setAttribute('aria-pressed', state.gmode === 'pro');
    document.querySelectorAll('[data-mmode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mmode === state.mMode));

    const editing = isMane() ? state.mMode === 'grad' : state.gmode === 'pro';

    // 反映方法の出し分け
    document.querySelectorAll('[data-howto]').forEach(el => {
      el.hidden = !el.dataset.howto.split(' ').includes(state.gmode === 'pro' ? 'pro' : state.gmode);
    });
    document.querySelectorAll('[data-mhowto]').forEach(el => { el.hidden = el.dataset.mhowto !== state.mMode; });
    $('howtoToggle').textContent = state.gmode === 'solid'
      ? '「グラデーションにする」をOFFにする'
      : '「グラデーションにする」をONにする';

    if (editing) {
      const st = sortedEditStops();
      $('stopBarFill').style.background = cssGradient(st.map(s => s.color), st.map(s => s.pos), 90);
      const bar = $('stopBar');
      bar.querySelectorAll('.stop-marker').forEach(mk => mk.remove());
      const sel = selectedStop();
      editStops().forEach(s2 => {
        const mk = document.createElement('div');
        mk.className = 'stop-marker' + (sel && s2.id === sel.id ? ' is-selected' : '');
        mk.style.left = s2.pos + '%';
        mk.style.background = s2.color;
        bar.appendChild(mk);
      });
      if (document.activeElement !== $('stopPos')) $('stopPos').value = sel ? sel.pos : '';
      $('stopPos').disabled = !sel;
      if (isMane()) {
        const onBase = state.mSel === 'base';
        $('baseChip').setAttribute('aria-pressed', onBase);
        $('baseChip').lastElementChild.textContent = onBase
          ? '基本色を編集中（もう一度押すとグラデーションに戻る）'
          : '基本色（文字・アイコンなどの色）を編集';
        $('baseChipDot').style.background = state.base;
      } else {
        $('removeStopBtn').disabled = !sel || state.stops.length <= 2;
      }
    }

    // 見本から選ぶときは、上の大きな色見本にもグラデーションを表示する
    const editingBaseNow = isMane() && m !== 'solid' && state.mSel === 'base';
    if (m !== 'solid' && state.pick === 'preset' && !editingBaseNow) {
      const sw = $('swatch');
      sw.style.background = cssGradient(theme.colors, theme.positions, theme.angle);
      sw.style.color = isLight(theme.colors[0]) ? '#111111' : '#FFFFFF';
      $('swatchName').textContent = 'グラデーション（見本）';
    }

    if (!isMane() && state.gmode === 'pro') {
      $('angleRow').innerHTML = ANGLES.map(a2 =>
        `<button type="button" data-angle="${a2}" aria-pressed="${a2 === state.angle}" title="${a2}°" aria-label="方向 ${a2}度"><span style="transform:rotate(${a2}deg)">↑</span></button>`
      ).join('');
    }

    // 使っている色のリスト
    let rows;
    if (editing) {
      rows = sortedEditStops().map(s2 => ({ id: s2.id, color: s2.color, pos: s2.pos }));
      if (isMane()) rows.push({ id: 'base', color: state.base, pos: null, label: '基本色' });
    } else {
      rows = theme.colors.slice(0, m === 'solid' ? 1 : undefined)
        .map((c, i) => ({ color: c, pos: m === 'solid' ? null : theme.positions[i] }));
    }
    $('stopList').innerHTML = rows.map((r, i) => `
      <div class="stop-row">
        <span class="num">${r.label ? '' : i + 1}</span>
        <span class="sw" style="background:${r.color}"></span>
        <code>${r.color}</code>
        <span class="pos">${r.label || (r.pos == null ? '' : r.pos + '%')}</span>
        <button type="button" class="btn btn-sm" data-copytext="${r.color}">コピー</button>
      </div>`).join('');
    state.stopRows = rows;
  }

  function renderGradPresets() {
    $('gradPresets').innerHTML = GRADIENT_PRESETS.map(([name, colors], i) =>
      `<button type="button" data-gpreset="${i}"><i style="background:linear-gradient(180deg, ${colors.join(', ')})"></i>${name}</button>`
    ).join('');
  }

  // ===== アプリ画面プレビュー =====
  // 簡易アイコン（Material Community Icons の雰囲気に寄せたSVG）
  const ICONS = {
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    timeline: '<path d="M3 17l5-6 4 3 5-7 4 4"/>',
    bars: '<path d="M5 20V11M12 20V5M19 20v-7"/>',
    magnify: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    scale: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8.5 9.5a5 5 0 0 1 7 0L12 12z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M6 15l4-5 4 3 6-7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
  };
  let gradSeq = 0;
  function icon(name, size, stroke, width = 2) {
    if (Array.isArray(stroke)) {
      const id = `ig${gradSeq++}`;
      const stops = stroke.map((c, i) => `<stop offset="${i / Math.max(1, stroke.length - 1)}" stop-color="${c}"/>`).join('');
      return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="url(#${id})" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">${stops}</linearGradient></defs>${ICONS[name]}</svg>`;
    }
    return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
  }

  // プレビュー用の日付（今日の月）
  function monthCells() {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);
    while (cells.length % 7) cells.push(null);
    return { y, m: m + 1, today: now.getDate(), cells };
  }
  const WEEK = ['日', '月', '火', '水', '木', '金', '土'];
  const statusBar = color => `<div class="island"></div><div class="status" style="color:${color}"><span>9:41</span><span>●●● ▮</span></div>`;

  // プレビューの横に出す、実際のグラデーションの帯
  function renderGradientStrip(theme) {
    const strip = $('gradStrip');
    if (!strip) return;
    const isGrad = mode() !== 'solid';
    strip.hidden = !isGrad;
    if (!isGrad) return;
    const angle = isMane() ? 180 : (state.gmode === 'pro' ? theme.angle : 180);
    strip.style.background = cssGradient(theme.colors, theme.positions, angle);
    $('gradStripNote').textContent = isMane() ? '上→下' : `${angle}°`;
  }

  function renderPreview(theme) {
    renderGradientStrip(theme);
    document.querySelectorAll('[data-base]').forEach(b => b.setAttribute('aria-pressed', b.dataset.base === state.baseMode));
    document.querySelectorAll('[data-mbase]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mbase === state.mBase));
    if (state.app === 'manetone') renderManetone(theme); else renderWeighTone(theme);
  }

  // マネトーン：CalendarScreen.js / utils/colors.js と同じ配色ルール
  const MT_THEMES = {
    light: { background: '#F5F6FA', surface: '#FFFFFF', text: '#555555', textMuted: '#666666', textFaint: '#999999', border: '#DDDDDD', inputBackground: '#FAFAFA' },
    gray: { background: '#D9DBE0', surface: '#F4F5F7', text: '#3F4147', textMuted: '#5C5F66', textFaint: '#8A8D94', border: '#C3C6CD', inputBackground: '#E9EAEE' },
    dark: { background: '#121212', surface: '#1E1E1E', text: '#F0F0F0', textMuted: '#B5B5B5', textFaint: '#888888', border: '#3A3A3A', inputBackground: '#2A2A2A' },
  };
  const PROFIT = '#3878C9', LOSS = '#D9455F', SHIFT = '#B8860B';
  const MT_SAMPLE = { 2: [12000, null, '早'], 3: [null, -1800], 5: [-8000, -3200], 6: [23500, null], 8: [null, -950, '遅'], 9: [-4500, null, '早'], 12: [31000, -2400], 13: [-12000, null], 14: [null, 250000, '早'], 15: [6800, -1200] };
  const yen = v => (v > 0 ? '+' : '') + v.toLocaleString('ja-JP');

  function renderManetone(theme) {
    const t = { ...MT_THEMES[state.mBase], accent: state.base };
    // グラデーションONのとき、基本色を背景に使うボタン（＋ボタン・選択中のタブ）だけが
    // 上→下のグラデーションになる（アプリの AccentTouchable と同じ）
    const accentFill = state.mMode === 'grad'
      ? cssGradient(theme.colors, theme.positions, 180)
      : t.accent;
    const { y, m, today, cells } = monthCells();
    let total = 0;
    Object.values(MT_SAMPLE).forEach(([a, b]) => { total += (a || 0) + (b || 0); });
    const dev = $('device');
    dev.style.background = t.background;
    dev.style.color = t.text;
    dev.innerHTML = `${statusBar(state.mBase === 'dark' ? '#fff' : '#111')}
      <div class="mt-body">
        <div class="mt-title">カレンダー</div>
        <div class="mt-summary" style="background:${t.surface}">
          <div class="mt-sum-top">
            <span class="mt-sum-label" style="color:${t.textMuted}">${y}年 ${m}月のトータル収支</span>
            <span class="mt-detail" style="border-color:${t.accent};color:${t.accent}">詳細</span>
          </div>
          <div class="mt-seg" style="background:${t.inputBackground}">
            <span style="background:${accentFill};color:#fff;font-weight:700">トータル</span>
            <span style="color:${t.textMuted}">実績のみ</span>
            <span style="color:${t.textMuted}">収支のみ</span>
          </div>
          <div class="mt-value" style="color:${total >= 0 ? PROFIT : LOSS}">${yen(total)} 円</div>
        </div>
        <div class="mt-cal" style="background:${t.surface}">
          <div class="mt-cal-head"><i style="color:${t.accent}">‹</i><span style="color:${t.text}">${y}年 ${m}月</span><i style="color:${t.accent}">›</i></div>
          <div class="mt-grid">
            ${WEEK.map(w => `<div class="mt-wd" style="color:${t.textMuted}">${w}</div>`).join('')}
            ${cells.map(d => {
              if (!d) return '<div class="mt-day"></div>';
              const [slot, fin, shift] = d <= today ? (MT_SAMPLE[d] || []) : [];
              const isToday = d === today;
              return `<div class="mt-day" style="${isToday ? `background:${t.accent}26;border-radius:8px` : ''}">
                <div class="mt-top"><span class="mt-shift" style="color:${SHIFT}">${shift || ''}</span><span class="mt-num" style="color:${isToday ? t.accent : t.text};${isToday ? 'font-weight:700' : ''}">${d}</span><span></span></div>
                ${slot != null ? `<span class="mt-amt" style="color:${slot >= 0 ? PROFIT : LOSS}">${yen(slot)}</span>` : ''}
                ${fin != null ? `<span class="mt-fin" style="color:${fin >= 0 ? PROFIT : LOSS}">${yen(fin)}</span>` : ''}
              </div>`;
            }).join('')}
          </div>
        </div>
        <div class="mt-fab" style="background:${accentFill}">${icon('plus', 24, '#fff', 2.6)}</div>
      </div>
      <div class="tabbar" style="background:${t.surface};border-color:${t.border}">
        ${[['calendar', 'カレンダー'], ['timeline', '年間収支'], ['bars', '実績検索'], ['magnify', '収支検索'], ['cog', '設定']].map(([ic, label], i) => {
          const c = i === 0 ? t.accent : '#999999';
          return `<div class="tab" style="color:${c}">${icon(ic, 20, c)}<span>${label}</span></div>`;
        }).join('')}
      </div>`;
    $('previewTitle').textContent = 'マネトーン：カレンダー画面';
    $('previewNote').textContent = state.mMode === 'grad'
      ? '＋ボタンと選択中のタブがグラデーションになります。文字・アイコン・今日の日付は基本色のままです。金額の青・赤はアプリ共通の固定色です。'
      : '「設定 → 背景色」の白／グレー／黒を切り替えて確認できます。金額の青・赤はアプリ共通の固定色です。';
  }

  // WeighTone：RecordScreen.js / RecordCalendar.js / getAppPalette と同じ配色ルール
  const WT_SAMPLE = { 1: 62.4, 2: 62.3, 3: 62.1, 5: 61.9, 6: 62.0, 7: 61.8, 8: 61.6, 10: 61.5, 11: 61.4, 12: 61.2, 13: 61.3, 14: 60.9, 15: 60.6 };
  const WT_EXTRA = { 6: ['note'], 10: ['camera'], 14: ['note', 'camera'] };

  function renderWeighTone(theme) {
    const base = BASES[state.baseMode];
    const angle = state.gmode === 'pro' ? theme.angle : 180;
    const bgColors = theme.colors.map(c => mix(c, base.anchor, base.ratio));
    const accentGrad = cssGradient(theme.colors, theme.positions, angle);
    const onAccent = isLight(theme.accent) ? '#111111' : '#FFFFFF';
    const accent = theme.accent;
    const { y, m, today, cells } = monthCells();
    const latestDay = Math.max(...Object.keys(WT_SAMPLE).map(Number).filter(d => d <= today));
    const dev = $('device');
    dev.style.background = cssGradient(bgColors, theme.positions, angle);
    dev.style.color = base.text;
    dev.innerHTML = `${statusBar(state.baseMode === 'light' ? '#111' : '#fff')}
      <div class="wt-body">
        <div class="wt-title"><span>記録</span></div>
        <div class="wt-summary" style="background:${base.card}">
          <div><div style="color:${base.sub};font-size:10px">最新の体重</div><b>${(WT_SAMPLE[latestDay] || 60.6).toFixed(1)}</b> <span style="color:${base.sub}">kg</span></div>
          <div style="text-align:right"><div style="color:${base.sub};font-size:10px">今月</div><b style="font-size:15px;color:${accent}">−1.8kg</b></div>
        </div>
        <div class="wt-cal" style="background:${base.card}">
          <div class="wt-cal-head"><i style="color:${base.text}">‹</i><span style="color:${base.text}">${y}年${m}月</span><i style="color:transparent">›</i></div>
          <div class="wt-grid">
            ${WEEK.map(w => `<div class="wt-wd" style="color:${base.sub}">${w}</div>`).join('')}
            ${cells.map(d => {
              if (!d) return '<div class="wt-cell"></div>';
              const future = d > today;
              const w = future ? null : WT_SAMPLE[d];
              const extra = w ? (WT_EXTRA[d] || []) : [];
              const boxStyle = w
                ? `background:${accent}1f;border-color:${accent}66`
                : (d === today ? `border-color:${accent}` : '');
              return `<div class="wt-cell"><div class="wt-box" style="${boxStyle}">
                <span class="wt-num" style="color:${future ? 'rgba(128,128,128,0.4)' : base.sub}">${d}</span>
                <span class="wt-val" style="color:${base.text}">${w ? w.toFixed(1) : (future ? '' : `<span style="opacity:.6;color:${base.sub}">＋</span>`)}</span>
                <span class="wt-icons">${extra.map(() => `<i style="display:block;width:6px;height:6px;border-radius:2px;background:${accent}"></i>`).join('')}</span>
              </div></div>`;
            }).join('')}
          </div>
        </div>
        <div class="wt-add" style="background:${accentGrad}">${icon('plus', 24, onAccent, 2.6)}</div>
      </div>
      <div class="tabbar" style="background:${base.card};border-color:${state.baseMode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}">
        ${[['scale', '記録'], ['chart', 'グラフ'], ['cog', '設定']].map(([ic, label], i) =>
          i === 0
            ? `<div class="tab" style="color:${accent}">${icon(ic, 22, theme.colors)}<span>${label}</span></div>`
            : `<div class="tab" style="color:${base.sub}">${icon(ic, 22, base.sub)}<span>${label}</span></div>`
        ).join('')}
      </div>`;
    $('previewTitle').textContent = 'WeighTone：記録（カレンダー）画面';
    $('previewNote').textContent = '「背景にテーマの色を適用」がONのときの見え方です。黒／グレー／白は「設定 → 背景」と同じです（上部のサマリーは簡略表示）。';
  }

  // ===== パレット =====
  function renderPalTabs() {
    $('palTabs').innerHTML = Object.keys(PALETTES).map(k =>
      `<button type="button" class="btn btn-sm ${k === currentPal ? 'btn-primary' : ''}" data-pal="${k}">${k === currentPal ? `<span class="rainbow-label">${k}</span>` : k}</button>`
    ).join('');
    $('palette').innerHTML = PALETTES[currentPal].map(([name, hex]) =>
      `<div class="chip-wrap"><button type="button" class="chip" style="background:${hex}" data-hex="${hex.toUpperCase()}" data-name="${name}" aria-label="${name} ${hex}"></button><span class="chip-label">${name}</span></div>`
    ).join('');
  }

  // ===== お気に入り（localStorage） =====
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

  // ===== アプリに反映するリンク =====
  // 【アプリ側の実装仕様】
  //   マネトーン  : manetone://theme?mode=solid|grad&base=RRGGBB&stops=RRGGBB-位置,...
  //   WeighTone  : weighttrackerapp://theme?mode=solid|auto|pro&color=RRGGBB
  //                &stops=RRGGBB-位置,...&angle=0〜315（proのみ）
  //   位置は 0〜100 の整数。stops は位置の小さい順。
  //   例) weighttrackerapp://theme?mode=pro&angle=90&stops=DA5272-0,F4B3C2-50,FADFDB-100
  const APP_SCHEME = { manetone: 'manetone', weightone: 'weighttrackerapp' };
  // App Store の公開後に、ここへストアのURLを貼り付けてください
  const STORE_URL = { manetone: 'https://apps.apple.com/jp/app/id6796136285', weightone: '' };
  // アプリ側がディープリンク（上記スキーム）に対応したバージョンを配信したら true にする。
  // false の間は「アプリに反映する」ボタンとQRコードを無効化し、色コードのコピー運用を案内する。
  const APP_LINK_READY = false;

  function themeLink() {
    const p = new URLSearchParams();
    const st = () => sortedEditStops().map(x => `${x.color.slice(1)}-${x.pos}`).join(',');
    if (isMane()) {
      p.set('mode', state.mMode === 'grad' ? 'grad' : 'solid');
      p.set('base', state.base.slice(1));
      if (state.mMode === 'grad') { ensureManeStops(); p.set('stops', st()); }
    } else {
      p.set('mode', state.gmode);
      p.set('color', state.base.slice(1));
      if (state.gmode === 'pro' && state.stops) {
        p.set('stops', st());
        p.set('angle', state.angle);
      }
    }
    return `${APP_SCHEME[state.app]}://theme?${p.toString()}`;
  }

  function renderApplyLink() {
    const url = themeLink();
    const name = state.app === 'manetone' ? 'マネトーン' : 'WeighTone';
    const applyBtn = $('applyBtn');
    const qrWrap = document.querySelector('.apply-qr');

    applyBtn.textContent = APP_LINK_READY ? `${name}に反映する` : `${name}に反映する（準備中）`;
    applyBtn.classList.toggle('is-disabled', !APP_LINK_READY);
    applyBtn.setAttribute('aria-disabled', String(!APP_LINK_READY));
    if (APP_LINK_READY) applyBtn.href = url;
    else applyBtn.removeAttribute('href');

    if (qrWrap) qrWrap.hidden = !APP_LINK_READY;

    const lead = $('applyLead');
    if (lead) {
      lead.textContent = APP_LINK_READY
        ? 'スマホでこのページを見ているときは、ボタンからアプリを開いてそのまま反映できます。パソコンのときは、QRコードをスマホで読み取ってください。'
        : 'ボタンから直接反映する機能は、アプリの対応版を準備中です。いまは下の「使っている色」から色コードをコピーして、アプリに貼り付けてください。';
    }

    $('applyUrl').textContent = url;
    $('applyNote').textContent = APP_LINK_READY
      ? `${name}が開かないときは、アプリが未インストールか、この機能に未対応のバージョンです。対応前は「色コードをコピー」してアプリに貼り付けてください。`
      : `${name}が対応版になると、このボタンからワンタップで色を反映できるようになります。`;

    // アプリを持っていない人向けのダウンロード導線
    const store = STORE_URL[state.app];
    const storeBtn = $('storeBtn');
    storeBtn.textContent = store ? `${name}をダウンロード` : `${name}をダウンロード（準備中）`;
    storeBtn.href = store || '#';
    storeBtn.classList.toggle('is-disabled', !store);

    // QRコード（パソコンで見ているとき用）
    const box = $('qrBox');
    if (box && !APP_LINK_READY) box.innerHTML = '';
    else if (box && typeof qrcode === 'function') {
      try {
        const qr = qrcode(0, 'M');
        qr.addData(url);
        qr.make();
        box.innerHTML = qr.createImgTag(4, 0);
      } catch { box.textContent = ''; }
    }
  }

  // ===== URL共有 =====
  function writeHash() {
    const p = new URLSearchParams();
    p.set('app', state.app);
    if (isMane()) {
      p.set('mm', state.mMode);
      p.set('c', state.base.slice(1));
      if (state.mMode === 'grad' && state.mStops) p.set('ms', state.mStops.map(s => `${s.color.slice(1)}-${s.pos}`).join('.'));
      return history.replaceState(null, '', '#' + p.toString());
    }
    p.set('m', state.gmode);
    if (state.gmode === 'pro') {
      p.set('s', sortedStops().map(s => `${s.color.slice(1)}-${s.pos}`).join('.'));
      p.set('a', state.angle);
    } else {
      p.set('c', state.base.slice(1));
    }
    history.replaceState(null, '', '#' + p.toString());
  }
  function readHash() {
    const raw = location.hash.slice(1);
    if (!raw) return false;
    if (hexToRgb(raw)) { state.base = rgbToHex(...hexToRgb(raw)); return true; } // 旧形式 #RRGGBB
    const p = new URLSearchParams(raw);
    if (p.get('app')) state.app = p.get('app') === 'manetone' ? 'manetone' : 'weightone';
    if (hexToRgb(p.get('c') || '')) state.base = rgbToHex(...hexToRgb(p.get('c')));
    if (p.get('mm') === 'grad') {
      state.mMode = 'grad';
      const ms = (p.get('ms') || '').split('.').map(part => {
        const [c, pos] = part.split('-');
        return hexToRgb(c) ? { id: uid(), color: rgbToHex(...hexToRgb(c)), pos: clamp(Math.round(Number(pos) || 0), 0, 100) } : null;
      }).filter(Boolean);
      if (ms.length === 3) { state.mStops = ms; state.mSel = 1; }
    }
    const m = p.get('m');
    if (m === 'pro' && p.get('s')) {
      const stops = p.get('s').split('.').map(part => {
        const [c, pos] = part.split('-');
        return hexToRgb(c) ? { id: uid(), color: rgbToHex(...hexToRgb(c)), pos: clamp(Math.round(Number(pos) || 0), 0, 100) } : null;
      }).filter(Boolean);
      if (stops.length >= 2) {
        state.stops = stops;
        state.gmode = 'pro';
        state.selectedId = sortedStops()[0].id;
        const a = Number(p.get('a'));
        if (ANGLES.includes(a)) state.angle = a;
      }
    } else if (m === 'solid' || m === 'auto') {
      state.gmode = m;
    }
    return true;
  }

  // ===== アプリ画面プレビューの縮小（PC・スマホ共通） =====
  // iOS Safari では zoom が効かないため transform で拡大縮小し、
  // 置き場所（.device-row）に縮小後のサイズを指定して余白が出ないようにする
  const MINI_WIDTH = 116;   // スマホで右下に出す小さい画面の幅
  const NAT_WIDTH = 300;    // 端末モックの元の幅

  function syncPickHeight() {
    const pick = document.querySelector('.pick-flow');
    if (pick) document.documentElement.style.setProperty('--pick-h', (pick.getBoundingClientRect().height - 1) + 'px');
  }

  function fitPreview() {
    syncPickHeight();
    const dev = $('device');
    const row = dev?.parentElement;
    const side = document.querySelector('.side-sticky');
    if (!dev || !row) return;

    dev.style.transform = 'none';
    row.style.width = row.style.height = '';
    const natH = dev.offsetHeight;
    if (!natH) return;

    let scale;
    if (!isNarrow()) {
      const others = (side?.scrollHeight ?? natH) - natH;   // 色見本・見出し・余白のぶん
      scale = Math.max(0.45, Math.min(1, (window.innerHeight - 84 - others) / natH));
    } else if (document.body.classList.contains('preview-open')) {
      // パネルの高さ上限（72vh）から、見出し・注記・余白のぶんを引いた残りに収める
      const panel = dev.closest('#previewPanel');
      const others = panel ? Math.max(0, panel.scrollHeight - natH) : 0;
      const avail = Math.max(160, window.innerHeight * 0.82 - others - 12);
      scale = Math.min((window.innerWidth - 64) / NAT_WIDTH, avail / natH, 0.95);
    } else {
      scale = MINI_WIDTH / NAT_WIDTH;
    }

    dev.style.transform = `scale(${scale.toFixed(3)})`;
    row.style.width = Math.round(NAT_WIDTH * scale) + 'px';
    row.style.height = Math.round(natH * scale) + 'px';
    document.body.classList.add('preview-ready');   // 縮小が決まってから表示する
  }

  let fitTimer;
  window.addEventListener('resize', () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitPreview, 120); });

  // ===== スマホ：アプリ画面プレビューの開閉 =====
  const isNarrow = () => window.matchMedia('(max-width: 860px)').matches;
  // スマホでは右下に小さく常時表示し、タップで拡大／縮小する
  function togglePreview(force) {
    if (!isNarrow()) return $('previewPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    const open = force !== undefined ? force : !document.body.classList.contains('preview-open');
    document.body.classList.toggle('preview-open', open);
    $('previewToggle').textContent = open ? '画面を小さく' : '画面を大きく';
    fitPreview();
  }
  // 小さいプレビュー自体をタップしても拡大できる
  document.addEventListener('click', e => {
    if (!isNarrow() || document.body.classList.contains('preview-open')) return;
    if (e.target.closest('#previewPanel')) togglePreview(true);
  });
  window.addEventListener('resize', () => { if (!isNarrow()) document.body.classList.remove('preview-open'); });

  // ===== ユーティリティ =====
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

  function setApp(app) {
    state.app = app === 'manetone' ? 'manetone' : 'weightone';
    document.body.dataset.app = state.app;
    document.querySelectorAll('.app-switch [data-app]').forEach(b => b.setAttribute('aria-pressed', b.dataset.app === state.app));
    try { localStorage.setItem('iroapps.app', state.app); } catch { /* 保存不可の環境では無視 */ }
    if (isMane() && state.mMode === 'grad') ensureManeStops();
    loadEditFromTarget();
    render();
  }

  function setMMode(m) {
    state.mMode = m === 'grad' ? 'grad' : 'solid';
    if (state.mMode === 'grad') {
      ensureManeStops();
      if (state.mSel === 'base') state.mSel = 0;
    } else {
      state.mSel = 'base';
    }
    loadEditFromTarget();
    render();
  }

  function selectMane(target) {
    state.mSel = target;
    loadEditFromTarget();
    render();
  }

  function setGmode(mode) {
    state.gmode = mode;
    if (mode === 'pro') {
      // アプリ同様、今見えているグラデーションから詳細設定を始める
      if (!state.stops) state.stops = deriveDefaultStops(state.base);
      if (!state.stops.some(s => s.id === state.selectedId)) state.selectedId = sortedStops()[0].id;
    }
    loadEditFromTarget();
    state.name = 'カスタム';
    render();
  }
  function selectStop(id) {
    state.selectedId = id;
    loadEditFromTarget();
    render();
  }

  // ===== イベント =====
  ['h', 's', 'l'].forEach(k => {
    const handler = e => {
      const v = Number(e.target.value);
      if (e.target.value === '' || Number.isNaN(v)) return;
      const { h, s, l } = state.edit;
      setEditHsl(k === 'h' ? v : h, k === 's' ? v : s, k === 'l' ? v : l);
    };
    $(k).addEventListener('input', handler);
    $(k + 'N').addEventListener('input', handler);
  });
  ['r', 'g', 'b'].forEach((k, i) => {
    const handler = e => {
      const v = Number(e.target.value);
      if (e.target.value === '' || Number.isNaN(v)) return;
      const rgb = hexToRgb(editingHex());
      rgb[i] = clamp(Math.round(v), 0, 255);
      setEditHex(rgbToHex(...rgb), 'カスタム');
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

  $('hexIn').addEventListener('input', e => setEditHex(e.target.value));
  $('rgbIn').addEventListener('input', e => {
    const m = e.target.value.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/);
    if (m) setEditHex(rgbToHex(...m.slice(1, 4).map(v => clamp(Number(v), 0, 255))), 'カスタム');
  });
  $('hslIn').addEventListener('input', e => {
    const m = e.target.value.match(/(\d{1,3}(?:\.\d+)?)\D+(\d{1,3}(?:\.\d+)?)\D+(\d{1,3}(?:\.\d+)?)/);
    if (m) setEditHsl(...m.slice(1, 4).map(Number));
  });
  ['hexIn', 'rgbIn', 'hslIn', 'stopPos'].forEach(id => $(id).addEventListener('blur', render));

  // スペクトラム：面をドラッグで彩度・明るさ、下のバーで色相
  const spBox = $('spectrum');
  if (spBox) {
    let spDragging = false;
    const pickFromEvent = e => {
      const r = spBox.getBoundingClientRect();
      const sv = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100);
      const v = clamp(100 - ((e.clientY - r.top) / r.height) * 100, 0, 100);
      setEditHex(hsvToHex(Number($('spHue').value), sv, v), 'カスタム');
    };
    spBox.addEventListener('pointerdown', e => {
      spDragging = true;
      spBox.setPointerCapture(e.pointerId);
      pickFromEvent(e);
    });
    spBox.addEventListener('pointermove', e => { if (spDragging) pickFromEvent(e); });
    const endSp = () => { spDragging = false; };
    spBox.addEventListener('pointerup', endSp);
    spBox.addEventListener('pointercancel', endSp);

    $('spHue').addEventListener('input', e => {
      const cur = hexToHsv(editingHex());
      setEditHex(hsvToHex(Number(e.target.value), cur.s, cur.v), 'カスタム');
    });
  }

  // ストップバー：クリックで追加、ツマミをドラッグで移動
  const bar = $('stopBar');
  let dragId = null;
  const posFromEvent = e => {
    const r = bar.getBoundingClientRect();
    return Math.round(clamp(((e.clientX - r.left) / r.width) * 100, 0, 100));
  };
  bar.addEventListener('pointerdown', e => {
    const r = bar.getBoundingClientRect();
    const x = e.clientX - r.left;
    let nearest = null, dist = Infinity;
    (editStops() || []).forEach(s => {
      const d = Math.abs((s.pos / 100) * r.width - x);
      if (d < dist) { dist = d; nearest = s; }
    });
    if (isMane()) {
      if (!nearest) return;
      dragId = nearest.id;
      bar.setPointerCapture(e.pointerId);
      selectMane(state.mStops.indexOf(nearest));
      return;
    }
    if (nearest && dist <= 22) {
      dragId = nearest.id;
    } else {
      const pos = posFromEvent(e);
      const stop = { id: uid(), color: colorAt(pos), pos };
      state.stops.push(stop);
      dragId = stop.id;
    }
    bar.setPointerCapture(e.pointerId);
    selectStop(dragId);
  });
  bar.addEventListener('pointermove', e => {
    if (!dragId) return;
    const stop = (editStops() || []).find(s => s.id === dragId);
    const pos = posFromEvent(e);
    if (stop && stop.pos !== pos) { stop.pos = pos; render(); }
  });
  const endDrag = () => { dragId = null; };
  bar.addEventListener('pointerup', endDrag);
  bar.addEventListener('pointercancel', endDrag);

  $('stopPos').addEventListener('input', e => {
    const stop = selectedStop();
    const v = Number(e.target.value);
    if (!stop || e.target.value === '' || Number.isNaN(v)) return;
    stop.pos = clamp(Math.round(v), 0, 100);
    render();
  });
  $('flipBtn').addEventListener('click', () => {
    if (isMane()) return;
    state.stops.forEach(s => { s.pos = 100 - s.pos; });
    render();
  });
  $('removeStopBtn').addEventListener('click', () => {
    if (state.stops.length <= 2) return;
    state.stops = state.stops.filter(s => s.id !== state.selectedId);
    selectStop(sortedStops()[state.stops.length - 1].id);
  });
  $('copyStops').addEventListener('click', () => {
    const text = state.stopRows.map((r, i) => r.label
      ? `${r.label}: ${r.color}`
      : `${i + 1}. ${r.color}${r.pos == null ? '' : ` (${r.pos}%)`}`).join('\n')
      + (!isMane() && state.gmode === 'pro' ? `\n方向: ${state.angle}°` : '')
      + (isMane() && state.mMode === 'grad' ? '\n向き: 上→下' : '');
    copy(text);
  });

  document.addEventListener('click', e => {
    const t = e.target;
    const copyBtn = t.closest('[data-copy]');
    if (copyBtn) return copy(state.codes[copyBtn.dataset.copy]);
    if (t.closest('#previewToggle')) return togglePreview();
    if (t.closest('#previewClose')) return togglePreview(false);
    const copyText = t.closest('[data-copytext]');
    if (copyText) return copy(copyText.dataset.copytext);

    const app = t.closest('.app-switch [data-app]');
    if (app) {
      return setApp(app.dataset.app);
    }
    const ty = t.closest('[data-type]');
    if (ty) {
      if (ty.dataset.type === 'solid') return isMane() ? setMMode('solid') : setGmode('solid');
      return isMane() ? setMMode('grad') : setGmode(state.gmode === 'pro' ? 'pro' : 'auto');
    }
    const pk = t.closest('[data-pick]');
    if (pk) { state.pick = pk.dataset.pick; return render(); }

    const mm = t.closest('[data-mmode]');
    if (mm) return setMMode(mm.dataset.mmode);
    if (t.closest('#baseChip')) return selectMane(state.mSel === 'base' ? 1 : 'base');
    if (t.closest('#autoStopsBtn')) {
      state.mStops = deriveManeStops(state.base);
      state.mSel = 'base';
      loadEditFromTarget();
      return render();
    }
    if (t.closest('#proToggle')) return setGmode(state.gmode === 'pro' ? 'auto' : 'pro');
    const mb = t.closest('[data-mbase]');
    if (mb) { state.mBase = mb.dataset.mbase; return render(); }
    const bm = t.closest('[data-base]');
    if (bm) { state.baseMode = bm.dataset.base; return render(); }
    const ang = t.closest('[data-angle]');
    if (ang) { state.angle = Number(ang.dataset.angle); return render(); }
    const sel = t.closest('[data-select]');
    if (sel) {
      if (!isMane()) return selectStop(sel.dataset.select);
      const id = sel.dataset.select;
      return selectMane(id === 'base' ? 'base' : state.mStops.findIndex(x => x.id === id));
    }

    const gp = t.closest('[data-gpreset]');
    if (gp && isMane()) {
      const c = GRADIENT_PRESETS[Number(gp.dataset.gpreset)][1];
      const three = c.length >= 3 ? [c[0], c[Math.floor(c.length / 2)], c[c.length - 1]] : [c[0], mix(c[0], c[c.length - 1], 0.5), c[c.length - 1]];
      state.mStops = three.map((col, i) => ({ id: uid(), color: col.toUpperCase(), pos: i * 50 }));
      state.mSel = 1;
      state.mMode = 'grad';
      baseFromMiddle();
      loadEditFromTarget();
      return render();
    }
    if (gp) {
      const colors = GRADIENT_PRESETS[Number(gp.dataset.gpreset)][1];
      state.stops = colors.map((c, i) => ({ id: uid(), color: c, pos: Math.round((i / (colors.length - 1)) * 100) }));
      state.angle = 180;
      state.selectedId = null;
      return setGmode('pro');
    }

    const remove = t.closest('[data-remove]');
    if (remove) {
      favorites = favorites.filter(f => f.hex !== remove.dataset.remove);
      saveFavs(); renderFavs(); render();
      return;
    }

    const pal = t.closest('[data-pal]');
    if (pal) { currentPal = pal.dataset.pal; renderPalTabs(); render(); return; }

    const colorEl = t.closest('[data-hex]');
    if (colorEl) setEditHex(colorEl.dataset.hex, colorEl.dataset.name);
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
    setEditHsl(Math.random() * 360, 45 + Math.random() * 45, 35 + Math.random() * 35, 'カスタム'));

  // ===== 初期化 =====
  renderPalTabs();
  renderFavs();
  renderGradPresets();
  try { if (localStorage.getItem('iroapps.app') === 'manetone') state.app = 'manetone'; } catch { /* 無視 */ }
  readHash();
  document.body.dataset.app = state.app;
  document.querySelectorAll('.app-switch [data-app]').forEach(b => b.setAttribute('aria-pressed', b.dataset.app === state.app));
  if (state.gmode === 'pro' && !state.stops) setGmode('auto');
  loadEditFromTarget();
  render();
})();
