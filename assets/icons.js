(() => {
  'use strict';

  const $ = id => document.getElementById(id);

  // ===== 検索 =====
  const cards = [...document.querySelectorAll('.icon-card')];
  const groups = [...document.querySelectorAll('.icon-group')];
  const sections = [...document.querySelectorAll('main > section.section')];

  function applyFilter(q) {
    const key = q.trim().toLowerCase();
    let hit = 0;
    cards.forEach(c => {
      const show = !key || c.dataset.search.toLowerCase().includes(key);
      c.hidden = !show;
      if (show) hit++;
    });
    groups.forEach(g => { g.hidden = !g.querySelector('.icon-card:not([hidden])'); });
    sections.forEach(s => {
      if (s.id === 'request') return;
      s.hidden = !s.querySelector('.icon-group:not([hidden])');
    });
    $('iconCount').textContent = key ? `${hit}件` : `全${cards.length}種`;
  }
  $('iconSearch').addEventListener('input', e => applyFilter(e.target.value));

  // ===== 色の切り替え =====
  const PRESET_COLORS = [
    ['#2F9E7D', 'アプリの標準色'], ['#3878C9', 'ブルー'], ['#8A4DFF', 'パープル'],
    ['#E0785A', 'テラコッタ'], ['#F0A93B', 'イエロー'], ['#D9455F', 'レッド'],
    ['#595857', 'すみ'],
  ];
  function setColor(hex) {
    document.querySelectorAll('.ic-view').forEach(el => { el.style.color = hex; });
    document.querySelectorAll('#iconColors button').forEach(b =>
      b.setAttribute('aria-pressed', b.dataset.color.toLowerCase() === hex.toLowerCase()));
  }
  $('iconColors').innerHTML = PRESET_COLORS.map(([hex, name]) =>
    `<button type="button" class="it-swatch" data-color="${hex}" style="background:${hex}" title="${name}" aria-label="${name}"></button>`).join('');
  $('iconColors').addEventListener('click', e => {
    const b = e.target.closest('[data-color]');
    if (b) setColor(b.dataset.color);
  });
  // カラーラボで選んだ色（#...）をURLに付けて開くと、その色で表示
  const fromHash = location.hash.match(/^#([0-9a-fA-F]{6})$/);
  setColor(fromHash ? '#' + fromHash[1] : PRESET_COLORS[0][0]);
  applyFilter('');

})();
