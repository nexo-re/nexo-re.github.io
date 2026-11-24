/* ==========================================================================
   extras.js - adds two things to every product page:
   1) a cute e-adoption certificate (photo + buyer name + character name)
   2) a live "watch it being crocheted" player with a progress bar
   Product numbers/names come from site-config.js -> lore. No need to edit this file.
   ========================================================================== */
(function () {
  'use strict';
  var pdEl = document.getElementById('pd'), pdi = document.getElementById('pdi');
  if (!pdEl || !pdi) return;
  var SITE = window.SITE || {}, LORE = SITE.lore || {}, BN = (SITE.business && SITE.business.name) || 'Our Shop';
  var KEY = 'wc_adopter_name';
  var FALLBACK_NAMES = ['Pip', 'Dumpling', 'Button', 'Nugget', 'Pebble', 'Maple', 'Honey', 'Clover'];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function hash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function getName() { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
  function setName(v) { try { localStorage.setItem(KEY, v); } catch (e) { } }
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

  function loreFor(name) {
    var L = LORE[String(name).toLowerCase()], h = hash(name);
    if (L) return L;
    return { character: FALLBACK_NAMES[h % FALLBACK_NAMES.length], stitches: 3500 + (h % 2000), metres: 100 + (h % 50), hours: 8 + (h % 70) / 10 };
  }

  var HEART = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.4C.9 8.2 2.8 4.8 6.1 4.8c2 0 3.4 1.1 4.2 2.5.4.6.9.6 1.4 0 .8-1.4 2.2-2.5 4.2-2.5 3.3 0 5.2 3.4 3.7 6.8C19.5 16.4 12 21 12 21z"/></svg>';

  /* ---------------- animation state (one player at a time) ---------------- */
  var raf = 0;
  function stopPlayer() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  function buildPlayer(box, src, L) {
    var COLS = 30, ROWS = 40, CW = 12, CH = 12, W = COLS * CW, H = ROWS * CH, TOTAL = COLS * ROWS, DUR = 20000;
    var cv = box.querySelector('.xw-c'), hk = box.querySelector('.xw-h');
    var g = cv.getContext('2d'), gh = hk.getContext('2d');
    var bar = box.querySelector('.xw-bar i'), pct = box.querySelector('.xw-pct'), live = box.querySelector('.xw-live'),
      eSt = box.querySelector('[data-st]'), eMe = box.querySelector('[data-me]'), eHo = box.querySelector('[data-ho]'),
      btn = box.querySelector('.xw-btn');
    var img = new Image(), off = document.createElement('canvas'), ready = false;
    off.width = W; off.height = H;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    var st = { n: 0, t: 0, last: 0, playing: true, done: false };

    function cell(i) { var rr = Math.floor(i / COLS), k = i % COLS; return { c: rr % 2 ? COLS - 1 - k : k, r: ROWS - 1 - rr }; }

    function blank() {
      g.clearRect(0, 0, W, H);
      g.fillStyle = 'rgba(255,255,255,.07)';
      for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) { g.fillRect(c * CW + CW / 2 - 1, r * CH + CH / 2 - 1, 2, 2); }
    }
    function stitch(c, r) {
      var x = c * CW, y = r * CH;
      g.clearRect(x, y, CW, CH);
      g.drawImage(off, x, y, CW, CH, x, y, CW, CH);
      g.save(); g.globalCompositeOperation = 'source-atop'; g.lineCap = 'round';
      g.strokeStyle = 'rgba(0,0,0,.30)'; g.lineWidth = 2.2;
      g.beginPath(); g.moveTo(x + 1.5, y + 1.5); g.lineTo(x + CW / 2, y + CH - 1.5); g.lineTo(x + CW - 1.5, y + 1.5); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.24)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x + 1.5, y + .6); g.lineTo(x + CW / 2, y + CH - 2.6); g.lineTo(x + CW - 1.5, y + .6); g.stroke();
      g.restore();
    }
    function hook(c, r, t) {
      gh.clearRect(0, 0, W, H);
      var x = c * CW + CW / 2, y = r * CH + CH / 2, wob = Math.sin(t / 90) * 3;
      // yarn ball (top-right) + thread to the hook
      var bx = W - 30, by = 28;
      gh.strokeStyle = '#f2a0b4'; gh.lineWidth = 2.2; gh.lineCap = 'round';
      gh.beginPath(); gh.moveTo(bx - 10, by + 8); gh.quadraticCurveTo((bx + x) / 2, Math.max(by, y) + 36, x + 6, y - 4); gh.stroke();
      gh.fillStyle = '#f2a0b4'; gh.beginPath(); gh.arc(bx, by, 15, 0, 6.283); gh.fill();
      gh.strokeStyle = 'rgba(120,40,70,.55)'; gh.lineWidth = 1.4;
      for (var i = -2; i <= 2; i++) { gh.beginPath(); gh.moveTo(bx - 14, by + i * 5); gh.quadraticCurveTo(bx, by + i * 5 + 7, bx + 14, by + i * 5); gh.stroke(); }
      // hook
      gh.save(); gh.translate(x, y + wob * .3); gh.rotate(-0.72);
      gh.fillStyle = '#e9e3da'; gh.strokeStyle = 'rgba(0,0,0,.45)'; gh.lineWidth = 1;
      gh.beginPath(); gh.moveTo(0, 0); gh.lineTo(4, -2.4); gh.lineTo(64, -3); gh.quadraticCurveTo(70, 0, 64, 3); gh.lineTo(4, 2.4); gh.closePath(); gh.fill(); gh.stroke();
      gh.fillStyle = '#c0687f'; gh.fillRect(38, -3.2, 26, 6.4);
      gh.restore();
    }
    function stats(p) {
      eSt.textContent = fmt(p * L.stitches) + ' / ' + fmt(L.stitches);
      eMe.textContent = (p * L.metres).toFixed(1) + ' / ' + L.metres + ' m';
      eHo.textContent = (p * L.hours).toFixed(1) + ' / ' + L.hours.toFixed(1) + ' h';
      bar.style.width = (p * 100).toFixed(1) + '%';
      pct.textContent = Math.round(p * 100) + '%';
    }
    function finish() {
      st.done = true; st.playing = false;
      g.globalAlpha = .45; g.drawImage(off, 0, 0); g.globalAlpha = 1;   // soften the stitch texture into the finished plushie
      gh.clearRect(0, 0, W, H);
      stats(1);
      live.classList.add('fin'); live.querySelector('span').textContent = 'Finished - ready to hug';
      btn.textContent = 'Watch again'; btn.setAttribute('aria-label', 'Watch it being crocheted again');
    }
    function reset() {
      st.n = 0; st.t = 0; st.last = 0; st.playing = true; st.done = false;
      blank(); stats(0);
      live.classList.remove('fin'); live.querySelector('span').textContent = 'Live - being crocheted';
      btn.textContent = 'Pause'; btn.setAttribute('aria-label', 'Pause');
    }
    function frame(now) {
      if (!cv.isConnected || !pdEl.classList.contains('on')) { stopPlayer(); return; }
      raf = requestAnimationFrame(frame);
      if (!ready || !st.playing) { st.last = now; return; }
      var dt = Math.min(64, now - (st.last || now)); st.last = now; st.t += dt;
      var p = Math.min(1, st.t / DUR), target = Math.floor(p * TOTAL), c;
      while (st.n < target) { c = cell(st.n++); stitch(c.c, c.r); }
      stats(p);
      if (p >= 1) { finish(); return; }
      c = cell(Math.max(0, st.n - 1)); hook(c.c, c.r, st.t);
    }

    btn.onclick = function () {
      if (st.done) { reset(); return; }
      st.playing = !st.playing;
      btn.textContent = st.playing ? 'Pause' : 'Resume';
      live.classList.toggle('pau', !st.playing);
      live.querySelector('span').textContent = st.playing ? 'Live - being crocheted' : 'Paused';
    };

    img.onload = function () {
      // cover-fit the product photo into the canvas
      var s = Math.min((W - 44) / img.naturalWidth, (H - 56) / img.naturalHeight), w = img.naturalWidth * s, h = img.naturalHeight * s;
      off.getContext('2d').drawImage(img, (W - w) / 2, H - h - 30, w, h);
      ready = true;
      if (reduce) { for (var i = 0; i < TOTAL; i++) { var c = cell(i); stitch(c.c, c.r); } finish(); }
    };
    img.onerror = function () { live.querySelector('span').textContent = 'Photo unavailable'; };
    img.src = src;
    reset();
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  /* ---------------- build the two blocks ---------------- */
  function enhance() {
    var x = pdi.querySelector('.pdx');
    if (!x || pdi.querySelector('.xt')) return;
    var h1 = x.querySelector('h1'); if (!h1) return;
    var name = h1.textContent.trim(), L = loreFor(name);
    var main = document.getElementById('pdMain'), photo = main ? main.getAttribute('src') : '';
    var src = 'assets/cutouts/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.webp';
    var who = getName(), no = 'WC-' + String(1000 + (hash(name + BN) % 9000));
    var date = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });

    var wrap = document.createElement('div'); wrap.className = 'xt';
    wrap.innerHTML =
      '<section class="xw" aria-label="Watch ' + esc(name) + ' being crocheted">' +
        '<div class="xw-top"><h3>Watch ' + esc(L.character) + ' come to life</h3><div class="xw-live"><i></i><span>Live - being crocheted</span></div></div>' +
        '<div class="xw-stage"><canvas class="xw-c" width="360" height="480"></canvas><canvas class="xw-h" width="360" height="480"></canvas></div>' +
        '<div class="xw-dock">' +
          '<div class="xw-row"><span class="xw-pct">0%</span><div class="xw-bar" role="progressbar" aria-label="Crochet progress"><i></i></div><button type="button" class="xw-btn">Pause</button></div>' +
          '<div class="xw-stats"><div><small>Stitches done</small><b data-st>0</b></div><div><small>Yarn used</small><b data-me>0</b></div><div><small>Hours spent</small><b data-ho>0</b></div></div>' +
        '</div>' +
      '</section>' +
      '<section class="xc" aria-label="Adoption certificate">' +
        '<p class="xc-hint">' + HEART + ' Every plushie comes with a free <b>e-adoption certificate</b>.</p>' +
        '<label class="xc-in">Your name on the certificate<input type="text" maxlength="28" placeholder="Type your name" value="' + esc(who) + '" autocomplete="given-name"></label>' +
        '<div class="xc-card">' +
          '<div class="xc-frame">' +
            '<div class="xc-eb">' + esc(BN) + '</div>' +
            '<h4>Certificate of Adoption</h4>' +
            '<div class="xc-ph"><img src="' + esc(src) + '" alt="' + esc(name) + '"></div>' +
            '<p class="xc-s">This certifies that</p>' +
            '<div class="xc-who"><span>' + esc(who || 'Your Name') + '</span></div>' +
            '<p class="xc-s">has officially adopted</p>' +
            '<div class="xc-ch">' + esc(L.character) + '</div>' +
            '<p class="xc-m">a handmade ' + esc(name) + ', crocheted with ' + L.metres + ' m of yarn and ' + fmt(L.stitches) + ' stitches, and promised lots of hugs.</p>' +
            '<div class="xc-ft"><div><small>Adoption no.</small><b>' + no + '</b></div><div class="xc-seal">' + HEART + '</div><div><small>Adopted on</small><b>' + esc(date) + '</b></div></div>' +
            '<div class="xc-sig"><span>Loopelle</span><small>Head Stitcher</small></div>' +
          '</div>' +
        '</div>' +
      '</section>';

    var cimg = wrap.querySelector('.xc-ph img');
    if (cimg) cimg.addEventListener('error', function () { if (cimg.dataset.f || !photo) return; cimg.dataset.f = 1; cimg.src = photo; });

    var anchor = x.querySelector('.pdd');
    if (anchor) x.insertBefore(wrap, anchor); else x.appendChild(wrap);

    var inp = wrap.querySelector('.xc-in input'), tgt = wrap.querySelector('.xc-who span');
    inp.addEventListener('input', function () { var v = inp.value.trim(); tgt.textContent = v || 'Your Name'; tgt.classList.toggle('ph', !v); setName(inp.value); });
    tgt.classList.toggle('ph', !who);

    stopPlayer();
    buildPlayer(wrap.querySelector('.xw'), src, L);
  }

  new MutationObserver(enhance).observe(pdi, { childList: true });
  new MutationObserver(function () { if (!pdEl.classList.contains('on')) stopPlayer(); }).observe(pdEl, { attributes: true, attributeFilter: ['class'] });
})();
