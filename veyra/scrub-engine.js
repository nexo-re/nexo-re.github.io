/**
 * NEXORÉ scrub engine — shared by the Lamborghini and Véyra demos.
 *
 * Why it exists: setting video.currentTime on every frame forces the browser to flush its decoder and
 * restart for each frame (one seek at a time, ~20-60 ms each), so fast scrolling stutters. This engine:
 *
 *  1. PLAYS the video (browser's own smooth, pipelined decoder) whenever the scroll is moving forward at
 *     a steady pace, and nudges playbackRate every frame so the picture stays locked to the scroll.
 *     That includes the automatic scroll, which becomes plain smooth playback.
 *  2. SEEKS (frame-centred, one at a time) only for slow movement, reverse scrolling and jumps.
 *  3. Smooths the playhead with a critically-damped spring (no overshoot, continuous velocity, identical
 *     on 60 / 90 / 120 / 144 Hz), instead of a per-frame lerp.
 *  4. Streams the film first (instant first frame), downloads the whole file in the background, then
 *     swaps to the in-memory copy invisibly (a second <video> takes over only once it has painted the same
 *     frame), so every seek afterwards is local and instant — no network stalls while scrubbing.
 *
 * Plain script, no dependencies. Exposes window.ScrubEngine.
 */
(function (global) {
  'use strict';

  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };

  /** Critically damped spring (Unity-style SmoothDamp). st = {v:0} keeps the velocity between calls. */
  function smoothDamp(cur, target, st, smoothTime, dt) {
    smoothTime = Math.max(0.0001, smoothTime);
    var omega = 2 / smoothTime, x = omega * dt;
    var ex = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    var change = cur - target, orig = target;
    var temp = (st.v + omega * change) * dt;
    st.v = (st.v - omega * temp) * ex;
    var out = target + (change + temp) * ex;
    if ((orig - cur > 0) === (out > orig)) { out = orig; st.v = (out - orig) / dt; }
    return out;
  }

  /** If the Nexoré portfolio's loading screen (same-origin parent frame) already downloaded this file, reuse its in-memory copy. */
  function preloaded(url) {
    try {
      var P = global.parent;
      if (P && P !== global && typeof P.NXPRE === 'function') return P.NXPRE(new URL(url, global.location.href).href) || null;
    } catch (_) {}
    return null;
  }

  /** Download a whole file with progress; resolves with a blob: URL. */
  function loadFull(url, onProgress) {
    var pre = preloaded(url);
    if (pre) { if (onProgress) onProgress(1, 0, 0); return Promise.resolve(pre); }
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var total = +res.headers.get('Content-Length') || 0;
      var type = res.headers.get('Content-Type') || 'video/mp4';
      if (!res.body || !res.body.getReader) return res.blob();
      var reader = res.body.getReader(), chunks = [], got = 0;
      return (function pump() {
        return reader.read().then(function (r) {
          if (r.done) return new Blob(chunks, { type: type });
          chunks.push(r.value); got += r.value.length;
          if (onProgress) onProgress(total ? Math.min(0.999, got / total) : 0, got, total);
          return pump();
        });
      })();
    }).then(function (blob) { return URL.createObjectURL(blob); });
  }

  function ScrubEngine(video, opt) {
    opt = opt || {};
    var self = this;
    var FPS = opt.fps || 60;
    var START_V = opt.startVel || 0.35;   // video-seconds per second needed to switch to playback
    var STOP_V = opt.stopVel || 0.10;     // ...and to leave it again (hysteresis)
    var MAX_RATE = opt.maxRate || 4;
    var MIN_RATE = 0.0625;
    var GAIN = opt.gain || 7;             // how hard playbackRate pulls the picture back onto the playhead

    var mode = 'seek';
    var playOK = opt.play !== false;
    var prevT = null, vel = 0, lastSeek = -1;
    var enteredAt = 0, exitedAt = 0, settle = 0, idleSince = 0;
    var cap = MAX_RATE;           // fastest playback this device has proven it can follow (lowered if it falls behind)
    var tooFast = false, seekStartedAt = 0, lat = 0.05;   // lat: measured seek latency (s), used to aim seeks ahead
    var swap = null, driving = false;

    self.video = video;
    self.stats = { mode: 'seek', rate: 0, vel: 0, err: 0, swapped: false };

    function bind(v) {
      v.addEventListener('seeked', function () {
        if (v !== self.video) return;
        settle = 3;
        if (seekStartedAt) { lat += (clamp((performance.now() - seekStartedAt) / 1000, 0.005, 0.3) - lat) * 0.25; seekStartedAt = 0; }
      });
    }
    bind(video);

    function enterPlay(v, e, now) {
      try {
        v.playbackRate = clamp(vel + e * GAIN, MIN_RATE, MAX_RATE);
        var p = v.play();
        mode = 'play'; enteredAt = now;
        if (p && p.catch) p.catch(function () {
          if (self.video === v) { playOK = false; mode = 'seek'; lastSeek = -1; }
        });
      } catch (_) { playOK = false; mode = 'seek'; }
    }
    function exitPlay(v, now) {
      try { v.pause(); } catch (_) {}
      mode = 'seek'; lastSeek = -1; exitedAt = now; settle = 3;
    }

    /* ---------- background -> in-memory swap ---------- */
    function stepSwap(now) {
      if (!swap || swap.phase === 'syncing') return;
      var old = self.video, nv = swap.nv;
      if (swap.phase === 'loading') return;                       // waiting for the new element's first frame
      if (swap.force) { commit(); return; }                       // old element is unusable (no range support)
      var idle = mode === 'seek' && !old.seeking && Math.abs(vel) < 0.03;
      if (!idle) { idleSince = 0; return; }
      if (!idleSince) idleSince = now;
      if (now - idleSince < 200) return;                          // scroll has been still for a moment
      var want = clamp(prevT == null ? old.currentTime : prevT, 0, (nv.duration || old.duration || 1) - 0.04);
      swap.phase = 'syncing';
      var done = function () {
        nv.removeEventListener('seeked', done);
        if (!swap) return;
        if (mode === 'seek' && Math.abs(vel) < 0.05) commit(); else { swap.phase = 'ready'; idleSince = 0; }
      };
      nv.addEventListener('seeked', done);
      try { nv.currentTime = (Math.floor(want * FPS) + 0.5) / FPS; } catch (_) { swap.phase = 'ready'; }
    }
    function commit() {
      var s = swap; swap = null;
      var old = s.old, nv = s.nv;
      bind(nv);
      self.video = nv; lastSeek = -1; settle = 3;
      self.stats.swapped = true;
      if (opt.onSwap) opt.onSwap(nv, old);
      // keep the old element underneath for two painted frames, then drop it (no flash at any moment)
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        try { old.pause(); old.removeAttribute('src'); old.load(); } catch (_) {}
        if (old.parentNode) old.parentNode.removeChild(old);
      }); });
    }

    /**
     * Replace the streamed element by one backed by an in-memory blob URL.
     * force = true when the streamed element can't seek at all (server without range support).
     */
    self.swapTo = function (url, force) {
      var old = self.video;
      var nv = old.cloneNode(false);
      nv.removeAttribute('poster'); nv.removeAttribute('src');
      nv.muted = true; nv.defaultMuted = true; nv.preload = 'auto';
      nv.setAttribute('playsinline', ''); nv.setAttribute('muted', '');
      swap = { nv: nv, old: old, phase: 'loading', force: !!force };
      var ready = function () {
        if (!swap || swap.nv !== nv || swap.phase !== 'loading') return;
        swap.phase = 'ready';
      };
      nv.addEventListener('loadeddata', ready);
      nv.addEventListener('canplay', ready);
      nv.addEventListener('error', function () { if (swap && swap.nv === nv) swap = null; });
      old.parentNode.insertBefore(nv, old);                       // underneath the visible one
      nv.src = url;
      try { nv.load(); } catch (_) {}
      // iOS: unlock programmatic seeks on the new element
      try { var p = nv.play(); if (p && p.then) p.then(function () { nv.pause(); }).catch(function () {}); } catch (_) {}
    };

    /** Call every animation frame with the smoothed playhead (video seconds) and the frame time (seconds). */
    self.update = function (T, dt) {
      var v = self.video;
      var now = performance.now();
      dt = clamp(dt || 1 / 60, 1 / 240, 0.1);
      if (!(T >= 0)) T = 0;
      if (prevT === null) prevT = T;
      var inst = (T - prevT) / dt; prevT = T;
      vel += (inst - vel) * (1 - Math.exp(-dt * 25));

      if (swap) stepSwap(now);
      v = self.video;
      if (!v || v.readyState < 1) return;
      if (driving) {                                   // the film is the master (auto-scroll): never seek or re-time it
        vel = 0; prevT = T;
        if (v.paused && !v.ended) { try { var pp = v.play(); if (pp && pp.catch) pp.catch(function () {}); } catch (_) {} }
        return;
      }
      var dur = v.duration;
      if (!isFinite(dur) || dur <= 0) return;
      T = clamp(T, 0, dur - 0.04);

      var e = T - v.currentTime;
      var st = self.stats; st.mode = mode; st.vel = vel; st.err = e; st.rate = v.playbackRate;

      if (mode === 'play') {
        var stopped = vel < STOP_V && (now - enteredAt > 250 || vel < 0.03);
        var fast = vel > cap * 1.05 || e > 0.6;                 // faster than playback can follow: scrub by seeking instead
        if (e > 0.6 && vel < cap * 0.9) cap = Math.max(START_V, vel * 0.8);   // the decoder fell behind at a speed it should manage: remember that limit
        if (fast) tooFast = true;
        var leave = stopped || fast || vel < -0.03 || e < -0.3 || T >= dur - 0.08 || v.paused || v.ended || document.hidden;
        if (leave) { exitPlay(v, now); }
        else {
          var r = clamp(vel + e * GAIN, MIN_RATE, MAX_RATE);
          if (Math.abs(r - v.playbackRate) > 0.015) { try { v.playbackRate = r; } catch (_) {} }
          return;
        }
      } else if (tooFast && vel < cap * 0.6) {
        tooFast = false;
      }
      if (mode !== 'play' && playOK && !tooFast && vel > START_V && vel < cap * 0.85 && !v.seeking && v.readyState >= 3 && e > -0.2 && e < 0.45 &&
                 now - exitedAt > 200 && T < dur - 0.25 && !document.hidden) {
        enterPlay(v, e, now);
        if (mode === 'play') return;
      }

      // seek mode: one seek at a time, aimed at the middle of the wanted frame. While the scroll is moving, aim a
      // little ahead by the measured seek latency, so the frame that lands is the one that is wanted by then.
      var lead = Math.abs(vel) > 0.15 ? clamp(vel * lat * 0.9, -0.5, 0.5) : 0;
      var tq = clamp((Math.floor((T + lead) * FPS) + 0.5) / FPS, 0, dur - 0.04);
      if (!v.seeking && Math.abs(tq - lastSeek) > 0.5 / FPS) {
        try { seekStartedAt = now; v.currentTime = tq; lastSeek = tq; } catch (_) { seekStartedAt = 0; }
      }
    };

    /**
     * Auto-scroll: let the film PLAY natively at a constant rate (nothing to seek, nothing to chase) and let the
     * page read video.currentTime to move the scrollbar/captions. Returns false if it can't start.
     */
    self.drive = function (rate, onFail) {
      var v = self.video;
      if (!v || v.readyState < 2) return false;
      try {
        v.playbackRate = rate;
        var p = v.play();
        driving = true; mode = 'seek';
        if (p && p.catch) p.catch(function () { if (driving && self.video === v) { driving = false; mode = 'seek'; lastSeek = -1; if (onFail) onFail(); } });
      } catch (_) { driving = false; return false; }
      return true;
    };
    self.stopDrive = function () {
      if (!driving) return;
      driving = false;
      try { self.video.pause(); } catch (_) {}
      mode = 'seek'; lastSeek = -1; prevT = null; vel = 0; settle = 3;
    };
    self.driving = function () { return driving; };

    /** true while the picture may still change (playing, seeking, or just landed): the page should redraw. */
    self.needsFrame = function () {
      var v = self.video;
      if (driving || mode === 'play' || (v && v.seeking)) return true;
      if (settle > 0) { settle--; return true; }
      return false;
    };
    self.playing = function () { return driving || mode === 'play'; };
    self.velocity = function () { return vel; };
  }

  ScrubEngine.smoothDamp = smoothDamp;
  ScrubEngine.loadFull = loadFull;
  ScrubEngine.src = function (url) { return preloaded(url) || url; };
  ScrubEngine.clamp = clamp;
  global.ScrubEngine = ScrubEngine;
})(window);
