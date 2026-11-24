/* ==========================================================================
   template.js - reads site-config.js and prepares everything before the
   crochet engine (app.js) starts. You should not need to edit this file.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.SITE || {}, B = S.business || {}, L = S.logo || {}, H = S.hero || {}, SH = S.shop || {}, HP = S.helper || {}, TH = S.theme || {};
  var NAME = B.name || 'My Shop';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fail(msg) {
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:24px;background:#0F0F0F;color:#F5F5F5;font:500 16px/1.6 system-ui,sans-serif;text-align:center';
    d.innerHTML = '<div style="max-width:460px"><h2 style="margin:0 0 10px;font-size:22px">Almost there</h2><p style="color:#bbb">' + msg + '</p></div>';
    document.body.appendChild(d);
  }

  /* ---------- colours ---------- */
  function hex2rgb(h) { h = String(h).replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  var accent = TH.accent || '#F4C2C2';
  var theme = { logoFill: TH.logoFill || '#b01e1e', PK: '#f2a0b4', PKD: '#c0687f', PKL: '#ffd6e0', CR: '#f1e2cf', CRD: '#c9b296' };
  var rg = hex2rgb(accent), root = document.documentElement.style;
  root.setProperty('--rose', accent); root.setProperty('--deep', accent); root.setProperty('--gold', accent); root.setProperty('--ink', accent);
  root.setProperty('--rose-rgb', rg.join(',')); root.setProperty('--pks', 'rgba(' + rg.join(',') + ',.1)'); root.setProperty('--rb', 'rgba(' + rg.join(',') + ',.3)');

  /* ---------- runtime settings for the engine ---------- */
  window.SAYORI_CONFIG = {
    whatsapp: B.whatsapp || '', instagram: B.instagram || '',
    freeShippingAbove: SH.freeShippingAbove == null ? 1500 : SH.freeShippingAbove, lowStockAt: SH.lowStockAt || 5,
    currency: SH.currency || '\u20b9', locale: SH.locale || 'en-IN', businessName: NAME, helperName: HP.name || 'Helper', cardLine: SH.cardLine == null ? 'Handmade with love' : SH.cardLine
  };
  window.SITE_RT = { theme: theme, zone: H.charmZone || { left: .245, right: .775, sideBottom: .44 }, stitch: H.stitchSize || 15 };

  /* ---------- page text + branding ---------- */
  if (!document.title || /^loading/i.test(document.title)) document.title = NAME + ' | ' + (SH.subtext || 'Handmade crochet').replace(/\.$/, '');   // index.html has a static title; this is only a fallback
  var h1 = $('h1.sr-only'); if (h1) h1.textContent = NAME + ' - handmade crochet';
  function brandHTML() {
    return (L.mark ? '<span class="bm"><img src="' + esc(L.mark) + '" alt=""></span>' : '') +
      '<span class="bt"><img class="wm" src="' + esc(L.wordmark) + '" alt="' + esc(NAME) + '">' + (B.tagline ? '<small>' + esc(B.tagline) + '</small>' : '') + '</span>';
  }
  $$('.br').forEach(function (a) { a.innerHTML = brandHTML(); a.setAttribute('aria-label', NAME + ' home'); });
  /* favicons are static <link> tags in index.html (see assets/icons) */

  var sh = $('#shop .sh');
  if (sh) {
    sh.querySelector('.eb').textContent = SH.eyebrow || (NAME + ' Collection');
    sh.querySelector('h2').textContent = SH.heading || 'Our picks';
    var free = window.SAYORI_CONFIG.freeShippingAbove;
    sh.querySelector('p').textContent = (SH.subtext || '') + (free ? ' Free shipping above ' + window.SAYORI_CONFIG.currency + Number(free).toLocaleString(window.SAYORI_CONFIG.locale) + '.' : '');
  }
  var sIn = $('#sIn'); if (sIn && SH.searchHint) sIn.placeholder = SH.searchHint;
  var foot = $('.ft');
  if (foot) foot.innerHTML = '<nav aria-label="More">' + (B.instagram ? '<a href="' + esc(B.instagram) + '" target="_blank" rel="noopener">Instagram</a>' : '') + '<a href="#contact" data-open="ctDr">Contact</a><a href="privacy.html">Privacy</a></nav><div>&copy; ' + new Date().getFullYear() + ' ' + esc(NAME) + (SH.credit ? ' &middot; ' + SH.credit : '') + '</div>';
  $$('[data-ig]').forEach(function (a) { if (B.instagram) a.href = B.instagram; else a.hidden = true; });
  $$('[data-wa]').forEach(function (a) { if (B.whatsapp) a.href = 'https://wa.me/' + B.whatsapp; else a.hidden = true; });
  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });
  $$('[data-name]').forEach(function (e) { e.textContent = NAME; });
  var wa = $('#wa'); if (wa) wa.hidden = !B.whatsapp;
  var hn = HP.name || 'Helper';
  $$('.dn [data-go="anya"]').forEach(function (a) { a.textContent = 'Ask ' + hn; });
  $$('.mn-l[data-go="anya"] b').forEach(function (b) { b.textContent = 'Ask ' + hn; });
  var bi = $('#bot img'); if (bi) bi.alt = hn + ', the ' + NAME + ' helper';
  var ch = $('#ch-h span'); if (ch) ch.textContent = hn + ' \u00b7 ' + NAME + ' helper';
  var ci = $('#ch-in'); if (ci) ci.placeholder = 'Ask ' + hn + '...';
  var chd = $('#chat'); if (chd) chd.setAttribute('aria-label', 'Chat with ' + hn);

  /* ---------- image helpers ---------- */
  function loadImg(src) {
    return new Promise(function (res, rej) {
      var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { rej(new Error('Could not load ' + src)); }; im.src = src;
    });
  }
  function cv(w, h) { var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }

  /* hero picture -> normalised size so any photo crochets at a sensible speed */
  function prepHero(im) {
    var s = Math.min(800 / im.naturalHeight, 640 / im.naturalWidth), c = cv(im.naturalWidth * s, im.naturalHeight * s), x = c.getContext('2d');
    x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, c.width, c.height);
    return c.toDataURL('image/png');
  }

  /* a crochet cut-out -> a hanging charm (black cord loop + clasp + the crochet) */
  function prepCharm(im) {
    var t = cv(im.naturalWidth, im.naturalHeight), tx = t.getContext('2d'); tx.drawImage(im, 0, 0);
    var d = tx.getImageData(0, 0, t.width, t.height).data, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, i, x, y;
    for (y = 0; y < t.height; y++) for (x = 0; x < t.width; x++) if (d[(y * t.width + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) { x0 = 0; y0 = 0; x1 = t.width - 1; y1 = t.height - 1; }
    var bw = x1 - x0 + 1, bh = y1 - y0 + 1, s = Math.min(104 / bw, 122 / bh, 1.6), dw = bw * s, dh = bh * s;
    var W = Math.ceil(Math.max(dw, 70)) + 10, TOPH = 236, Hh = Math.ceil(TOPH + dh) + 4, R = 2, c = cv(W * R, Hh * R), g = c.getContext('2d'), cx = W / 2;
    g.scale(R, R); g.lineCap = 'round'; g.lineJoin = 'round';
    function loop(col, w, dx) { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(cx - 5 + dx, 198); g.bezierCurveTo(cx - 18 + dx, 150, cx - 23 + dx, 22, cx + dx, 8); g.bezierCurveTo(cx + 23 + dx, 22, cx + 18 + dx, 150, cx + 5 + dx, 198); g.stroke(); }
    loop('#141414', 3.6, 0); loop('rgba(255,255,255,.28)', 1, -.6);
    var gr = g.createLinearGradient(cx - 7, 0, cx + 7, 0); gr.addColorStop(0, '#8d9098'); gr.addColorStop(.35, '#f4f5f8'); gr.addColorStop(1, '#7c7f87');
    g.fillStyle = gr; g.beginPath(); if (g.roundRect) g.roundRect(cx - 7, 190, 14, 32, 3); else g.rect(cx - 7, 190, 14, 32); g.fill();
    g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(cx - 7, 196, 14, 1.4); g.fillRect(cx - 7, 205, 14, 1.4);
    g.strokeStyle = '#c3c6cd'; g.lineWidth = 2.6; g.beginPath(); g.arc(cx, 231, 7, 0, Math.PI * 2); g.stroke();
    g.imageSmoothingQuality = 'high'; g.drawImage(t, x0, y0, bw, bh, cx - dw / 2, TOPH - 2, dw, dh);
    return { w: W, h: Hh, px: cx, bodyTop: TOPH - 2, bodyL: 0, bodyR: W - 1, src: c.toDataURL('image/png') };
  }

  /* logo for the first screen: the wordmark picture, tinted */
  function prepLogo() {
    return loadImg(L.wordmark).then(function (im) {
      var w = im.naturalWidth || 1000, h = im.naturalHeight || 300, k = Math.min(1, 1600 / w), c = cv(w * k, h * k), x = c.getContext('2d');
      x.drawImage(im, 0, 0, c.width, c.height);
      if (L.tintHero !== false) { x.globalCompositeOperation = 'source-in'; x.fillStyle = theme.logoFill; x.fillRect(0, 0, c.width, c.height); }
      return { w: w, h: h, img: c };
    });
  }

  /* ---------- go ---------- */
  var heroSrc = H.image || 'assets/hero/hero.webp', hang = (H.hanging || []).filter(Boolean);

  function loadScript(src) { return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { rej(new Error('Could not load ' + src)); }; document.body.appendChild(s); }); }

  /* optional 3D hero (site-config hero.model). Any failure (offline, no WebGL...) quietly falls back to the picture. */
  function load3D() {
    if (!H.model) return Promise.resolve(null);
    var lim = new Promise(function (res) { setTimeout(function () { res(null); }, 20000); });
    var job = import('./hero3d.js').then(function (m) { return m.createHero3D(H.model, { maxW: 640, maxH: 800 }); })
      .catch(function (e) { if (window.console) console.warn('3D hero unavailable, using the picture instead:', e); return null; });
    return Promise.race([job, lim]);
  }

  Promise.all([loadImg(heroSrc), Promise.all(hang.map(loadImg)), prepLogo(), load3D()]).then(function (r) {
    var cache = {}; hang.forEach(function (u, i) { cache[u] = r[1][i]; });
    if (r[3]) { window.SITE_RT.heroSrc = r[3].src; window.SITE_RT.zone = r[3].zone; window.SITE_RT.hero3d = r[3].api; }
    else window.SITE_RT.heroSrc = prepHero(r[0]);
    window.SITE_RT.charms = hang.map(function (u) { return prepCharm(cache[u]); });
    window.SITE_RT.logo = r[2];
    return loadScript('assets/js/app.js');
  }).catch(function (e) {
    var local = location.protocol === 'file:';
    fail(local ? 'Your browser blocks pictures when a page is opened by double-clicking it.<br>Please start it with <b>start-demo.bat</b> (Windows) or <b>start-demo.command</b> (Mac), or use VS Code &ldquo;Live Server&rdquo;. Details are in README.md.'
               : 'Something in site-config.js points to a picture that is missing:<br><b>' + esc(e.message) + '</b>');
    if (window.console) console.error(e);
  });
})();
