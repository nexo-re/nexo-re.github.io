/**
 * Lamborghini Revuelto — Cinematic Scroll Engine (hardened build)
 *
 * What this file does:
 * 1. Fixed full-screen canvas with manual cover-crop (uses each frame's REAL size).
 * 2. Mobile portrait focal-point + zoom interpolation from timeline.js.
 * 3. Scroll is READ EVERY FRAME (no dependence on scroll events) and lerp-smoothed.
 * 4. The film is ONE video file (assets/revuelto-scrub.mp4); scroll sets its currentTime.
 * 5. The video is encoded with a keyframe every 3 frames so seeking in any direction is instant.
 * 6. Text overlays computed only from smoothed video time (works forward/backward).
 * 7. v2 smoothness upgrades: Lenis smooth wheel, time-based damping (refresh-rate independent),
 *    video scrubbing instead of image frames (smoother, one file).
 * 8. The render loop can never die: errors are caught and the next frame is always scheduled.
 *
 * Add ?debug to the URL to see a tiny status line (progress, video time, errors).
 */

(function () {
  'use strict';

  const config = window.TIMELINE_CONFIG;
  if (!config) {
    console.error('TIMELINE_CONFIG not found. Is timeline.js loaded before app.js?');
    return;
  }

  const DEBUG = /[?&]debug\b/.test(window.location.search);

  // DOM
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const textOverlay = document.getElementById('text-overlay');
  const scrollSpacer = document.getElementById('scroll-spacer');
  let video = document.getElementById('bg-video');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // State
  let targetProgress = 0;
  let currentProgress = 0;
  let videoReady = false;         // true once the first video frame can be drawn
  let videoDuration = config.totalVideoDuration;
  let lastError = '';
  let dirty = true;               // something changed that requires a redraw
  let lastRenderedProgress = -1;
  let lastTime = 0;
  let scrollDir = 1;
  let maxScroll = 0;
  let lenis = null;
  let filmLoading = false;        // true while the whole film is being downloaded (server without range support)
  let blobStarted = false;
  let upgraded = false;           // true once the in-memory copy of the film has taken over
  let eng = null;                 // ScrubEngine: playback/seek hybrid
  const sd = { v: 0 };            // spring state for the playhead

  // Auto-scroll: constant speed in CSS px/second, integrated from real elapsed time.
  const AUTO_SCROLL_PX_PER_SEC = 300;
  const AUTO_SCROLL_DELAY_MS = 1000;   // auto-scroll starts this long after the page opens
  const AUTO_FILM_RATE = 2;   // auto-scroll = the film plays natively at this speed (1 = real time, 2 = twice as fast) and the page follows it
  let autoActive = false;
  let autoDrive = false;      // true while the film itself is driving the scroll position
  let autoPending = false;    // waiting for the film to land on the start frame before it plays
  let autoLastSet = 0;        // scroll position we last wrote (a different reading means the visitor dragged the scrollbar)
  let autoY = 0;            // authoritative float scroll position while auto-scrolling
  let userTookOver = false; // set once the visitor scrolls/touches/presses a key

  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  let isPortrait = viewportHeight > viewportWidth;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  scrollSpacer.style.height = (config.scrollMultiplier * 100) + 'vh';

  /* ==========================================================================
     1. The film: one video, scrubbed by scroll
     ========================================================================== */

  function onVideoReady() {
    if (video.duration && isFinite(video.duration)) videoDuration = video.duration;
    if (video.readyState >= 2) { videoReady = true; dirty = true; }
  }
  function bindVideo(v) {
    v.addEventListener('loadedmetadata', function () { if (v === video) onVideoReady(); });
    v.addEventListener('loadeddata', function () { if (v === video) onVideoReady(); });
    v.addEventListener('canplay', function () { if (v === video) onVideoReady(); });
    v.addEventListener('seeked', function () { if (v === video) dirty = true; });
    v.addEventListener('error', function () {
      if (v !== video) return;
      lastError = 'video failed to load: ' + (config.videoSrc || '');
      console.error(lastError);
    });
  }
  bindVideo(video);
  // iOS Safari only decodes seeks after the first user gesture: unlock it silently on first touch.
  window.addEventListener('touchstart', () => {
    if (eng && eng.driving()) return;
    const p = video.play();
    if (p && p.then) p.then(() => { if (!(eng && eng.driving())) video.pause(); }).catch(() => {});
  }, { once: true, passive: true });

  // The film streams first (instant first frame), then the whole file is downloaded in the background and the
  // in-memory copy silently takes over, so no seek ever waits on the network. Servers without range support
  // (e.g. `python -m http.server`) can't seek a stream at all: there the download is mandatory and shows %.
  let statusEl = null;
  function setStatus(msg) {
    if (!msg) { if (statusEl) { statusEl.remove(); statusEl = null; } return; }
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.style.cssText = 'position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);' +
        'z-index:20;font:300 12px/1 Montserrat,system-ui,sans-serif;letter-spacing:.28em;text-transform:uppercase;' +
        'color:rgba(255,255,255,.75);text-shadow:0 1px 12px #000;pointer-events:none;white-space:nowrap';
      document.body.appendChild(statusEl);
    }
    statusEl.textContent = msg;
  }

  function isSeekable() {
    const s = video.seekable;
    return !!(s && s.length && s.end(s.length - 1) >= videoDuration - 1);
  }

  let needForce = false;
  function startUpgrade() {
    if (blobStarted) return;
    blobStarted = true;
    filmLoading = true;
    ScrubEngine.loadFull(config.videoSrc, function (f) {
      if (needForce) setStatus('Loading film ' + Math.floor(f * 100) + '%');
    }).then(function (url) {
      eng.swapTo(url, needForce);
    }).catch(function (err) {
      filmLoading = false;
      setStatus('');
      lastError = 'film download failed: ' + (err && err.message || err);
      console.error(lastError);
      if (needForce) { video.src = config.videoSrc; video.load(); }
    });
  }

  function checkSeekable() {
    if (video.readyState < 1) return;
    if (!isSeekable()) needForce = true;
    startUpgrade();
  }
  video.addEventListener('loadedmetadata', function () { setTimeout(checkSeekable, 400); });
  setTimeout(function () { if (!blobStarted) checkSeekable(); }, 2500);

  /* ==========================================================================
     2. Mobile framing (focal point + zoom) from timeline.js keyframes
     ========================================================================== */

  function getFramingParams(time) {
    if (!isPortrait) return { cx: 0.5, cy: 0.5, zoom: 1.0 };

    const kfs = config.mobileKeyframes;
    if (!kfs || !kfs.length) return { cx: 0.5, cy: 0.5, zoom: 1.0 };

    if (time <= kfs[0].t) return { cx: kfs[0].cx, cy: kfs[0].cy, zoom: kfs[0].zoom };
    const last = kfs[kfs.length - 1];
    if (time >= last.t) return { cx: last.cx, cy: last.cy, zoom: last.zoom };

    let i = 0;
    while (i < kfs.length - 1 && kfs[i + 1].t <= time) i++;
    const k0 = kfs[i];
    const k1 = kfs[i + 1];
    const dT = k1.t - k0.t;
    if (dT <= 0.1) return { cx: k1.cx, cy: k1.cy, zoom: k1.zoom };

    const u = (time - k0.t) / dT;
    return {
      cx: k0.cx + (k1.cx - k0.cx) * u,
      cy: k0.cy + (k1.cy - k0.cy) * u,
      zoom: k0.zoom + (k1.zoom - k0.zoom) * u
    };
  }

  /* ==========================================================================
     3. Manual cover-crop canvas renderer (uses the image's real dimensions)
     ========================================================================== */

  function drawCoverImage(image, cx, cy, zoom) {
    if (!image) return;

    const sW = image.videoWidth || image.naturalWidth || image.width;
    const sH = image.videoHeight || image.naturalHeight || image.height;
    if (!sW || !sH) return;

    const cW = canvas.width;
    const cH = canvas.height;
    const rSrc = sW / sH;
    const rDst = cW / cH;

    let cropW, cropH;
    if (rDst > rSrc) {
      cropW = sW / zoom;
      cropH = (sW / rDst) / zoom;
    } else {
      cropH = sH / zoom;
      cropW = (sH * rDst) / zoom;
    }
    cropW = Math.min(sW, Math.max(10, cropW));
    cropH = Math.min(sH, Math.max(10, cropH));

    let srcX = cx * sW - cropW / 2;
    let srcY = cy * sH - cropH / 2;
    srcX = Math.max(0, Math.min(sW - cropW, srcX));
    srcY = Math.max(0, Math.min(sH - cropH, srcY));

    ctx.drawImage(image, srcX, srcY, cropW, cropH, 0, 0, cW, cH);
  }

  /* ==========================================================================
     4. Text overlays (pure function of smoothed video time)
     ========================================================================== */

  const cueElements = [];

  function initTextOverlays() {
    textOverlay.innerHTML = '';
    config.cues.forEach(cue => {
      const el = document.createElement('div');
      const pos = cue.position || 'bottom-center';
      el.className = 'cue-item pos-' + pos + ' shadow-' + (cue.shadowStrength || 'medium');
      el.id = 'cue-' + cue.id;

      let html = '';
      if (cue.label) {
        html += '<div class="cue-label-wrap"><span class="cue-label-line"></span>' +
                '<span class="cue-label-text">' + cue.label + '</span></div>';
      }
      if (cue.headline) html += '<h2 class="cue-headline">' + cue.headline + '</h2>';
      if (cue.subtitle) html += '<p class="cue-subtitle">' + cue.subtitle + '</p>';

      el.innerHTML = html;
      textOverlay.appendChild(el);
      cueElements.push({ cue, el, isCentered: pos.indexOf('center') !== -1 });
    });
  }

  function updateTextOverlays(videoTime) {
    const fadeIn = config.fadeInDuration;
    const fadeOut = config.fadeOutDuration;

    cueElements.forEach(({ cue, el, isCentered }) => {
      let opacity = 0, translateY = 0, blur = 0;

      if (cue.stayVisibleUntilEnd) {
        if (videoTime >= cue.start) {
          if (videoTime < cue.start + fadeIn) {
            const u = (videoTime - cue.start) / fadeIn;
            opacity = u; translateY = 24 * (1 - u); blur = 4 * (1 - u);
          } else {
            opacity = 1;
          }
        }
      } else if (videoTime >= cue.start && videoTime <= cue.end) {
        if (videoTime < cue.start + fadeIn) {
          const u = (videoTime - cue.start) / fadeIn;
          opacity = u; translateY = 24 * (1 - u); blur = 4 * (1 - u);
        } else if (videoTime <= cue.end - fadeOut) {
          opacity = 1;
        } else {
          const u = (videoTime - (cue.end - fadeOut)) / fadeOut;
          opacity = 1 - u; translateY = -14 * u; blur = 3 * u;
        }
      }

      if (opacity <= 0.001) {
        if (el.style.display !== 'none') el.style.display = 'none';
      } else {
        if (el.style.display !== 'block') el.style.display = 'block';
        el.style.opacity = opacity.toFixed(3);
        el.style.transform = 'translate3d(' + (isCentered ? '-50%' : '0') + ',' + translateY.toFixed(1) + 'px,0)';
        el.style.filter = 'none';
      }
    });
  }

  /* ==========================================================================
     5. Viewport + scroll reading
     ========================================================================== */

  function onResize() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    isPortrait = viewportHeight > viewportWidth;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    // never allocate more pixels than the film itself has (extra pixels would only be upscaled blur + GPU cost)
    let cw = Math.round(viewportWidth * dpr), ch = Math.round(viewportHeight * dpr);
    const cap = Math.min(1, 1920 / cw, 1080 / ch);
    canvas.width = Math.round(cw * cap);
    canvas.height = Math.round(ch * cap);
    measureScroll();
    dirty = true;
    safeRender();
  }

  function measureScroll() {
    const doc = document.documentElement;
    const body = document.body;
    const total = Math.max(doc.scrollHeight, body.scrollHeight);
    maxScroll = Math.max(0, total - window.innerHeight);
  }

  // Cheap per-frame read (max scroll is cached, so no forced layout every frame)
  function readScrollProgress() {
    const doc = document.documentElement;
    const body = document.body;
    const y = window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
    if (maxScroll <= 0) return 0;
    return Math.max(0, Math.min(1, y / maxScroll));
  }

  /* ==========================================================================
     6. Render + animation loop
     ========================================================================== */

  let debugEl = null;
  function setupDebug() {
    if (!DEBUG) return;
    debugEl = document.createElement('div');
    debugEl.style.cssText = 'position:fixed;left:6px;top:6px;z-index:99;font:11px/1.3 monospace;' +
      'color:#0f0;background:rgba(0,0,0,.6);padding:4px 6px;pointer-events:none;white-space:pre';
    document.body.appendChild(debugEl);
  }

  function renderFrame() {
    if (!videoReady) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const dur = videoDuration;
    const t = currentProgress * dur;                    // text + framing follow the smoothed playhead
    const { cx, cy, zoom } = getFramingParams(t);

    drawCoverImage(video, cx, cy, zoom);
    updateTextOverlays(t);

    if (debugEl) {
      debugEl.textContent =
        'p=' + currentProgress.toFixed(3) + ' target=' + targetProgress.toFixed(3) +
        '\nt=' + t.toFixed(2) + 's / ' + dur.toFixed(2) + 's  video=' + video.currentTime.toFixed(2) +
        '\nready=' + video.readyState + ' seeking=' + video.seeking +
        '\nmode=' + eng.stats.mode + ' rate=' + (eng.stats.rate || 0).toFixed(2) + ' err=' + (eng.stats.err || 0).toFixed(3) + ' swapped=' + eng.stats.swapped +
        (lastError ? '\nERR: ' + lastError : '');
    }
  }

  function safeRender() {
    try {
      renderFrame();
    } catch (err) {
      ctx.globalAlpha = 1;
      lastError = String(err && err.message || err);
      console.error('Render error:', err);
    }
  }

  function animationLoop(now) {
    // Always schedule the next frame FIRST so nothing can kill the loop.
    requestAnimationFrame(animationLoop);

    if (lenis) lenis.raf(now);   // Lenis turns wheel ticks into fluid, eased scrolling

    // Time-based damping: identical feel on 60 / 90 / 120 / 144 Hz displays,
    // and it never "hiccups" if one frame takes longer than usual.
    const dtRaw = lastTime ? Math.min(0.25, (now - lastTime) / 1000) : 0;
    const dt = lastTime ? Math.min(0.1, dtRaw) : 1 / 60;
    lastTime = now;

    let driven = false;
    if (autoActive) {
      const yNow = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (autoPending) {
        // the film is landing on the frame where auto-scroll starts; then it plays by itself
        if (!video.seeking && video.readyState >= 2) {
          autoPending = false;
          autoDrive = eng.drive(AUTO_FILM_RATE, () => { autoDrive = false; autoY = window.pageYOffset || 0; lastTime = 0; });
          if (!autoDrive) { autoY = window.pageYOffset || 0; lastTime = 0; }
        }
        targetProgress = currentProgress;
        driven = true;
      } else if (autoDrive && eng.driving()) {
        // NATIVE PLAYBACK IS THE MASTER: no seeks, no smoothing, no lag between picture, text and scrollbar
        const T = video.currentTime;
        const pr = Math.max(0, Math.min(1, T / videoDuration));
        targetProgress = pr; currentProgress = pr; sd.v = 0; driven = true;
        const y = pr * maxScroll;
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y);
        autoLastSet = window.pageYOffset || 0;
        if (video.ended || T >= videoDuration - 0.06) setAutoScroll(false);
      } else {
        // fallback (autoplay refused): classic scroll-driven auto-scroll at constant speed
        autoY += AUTO_SCROLL_PX_PER_SEC * dtRaw;
        if (autoY >= maxScroll) { autoY = maxScroll; setAutoScroll(false); }
        if (lenis) lenis.scrollTo(autoY, { immediate: true, force: true });
        else window.scrollTo(0, autoY);
        autoLastSet = window.pageYOffset || 0;
        targetProgress = maxScroll > 0 ? Math.max(0, Math.min(1, autoY / maxScroll)) : 0;
      }
    } else {
      targetProgress = readScrollProgress();
    }

    // Critically-damped spring: velocity is continuous (no jerk when a wheel tick arrives), no overshoot, and it
    // behaves identically on 60 / 90 / 120 / 144 Hz displays. smoothTime ~ 1.27 / old catch-up rate.
    const prev = currentProgress;
    if (!driven) {
      const smoothTime = 1.27 / (lenis ? config.smoothingWithLenis : config.smoothing);
      currentProgress = ScrubEngine.smoothDamp(currentProgress, targetProgress, sd, smoothTime, dt);
      if (Math.abs(targetProgress - currentProgress) < 0.000004 && Math.abs(sd.v) < 0.0004) { currentProgress = targetProgress; sd.v = 0; }
    }

    const delta = currentProgress - prev;
    if (delta > 1e-7) scrollDir = 1;
    else if (delta < -1e-7) scrollDir = -1;

    // The engine decides every frame whether to PLAY the film (steady forward scrolling, incl. auto-scroll)
    // or SEEK it (slow moves, reverse, jumps), and keeps the picture locked to the playhead.
    eng.update(currentProgress * videoDuration, dt);

    // Don't redraw if nothing moved (saves battery and keeps the main thread free)
    if (dirty || eng.needsFrame() || Math.abs(currentProgress - lastRenderedProgress) > 1e-7) {
      dirty = false;
      lastRenderedProgress = currentProgress;
      safeRender();
    }
  }

  /* ==========================================================================
     6b. Automatic scrolling (starts by itself 5 s after the page opens)
     ========================================================================== */

  function setAutoScroll(on) {
    if (on === autoActive) return;
    if (on) {
      measureScroll();
      if (maxScroll <= 0) return;
      let y = window.pageYOffset || document.documentElement.scrollTop || 0;
      // At the very end? Restart from the top.
      if (y >= maxScroll - 1) {
        if (lenis) lenis.scrollTo(0, { immediate: true, force: true }); else window.scrollTo(0, 0);
        y = 0;
      }
      autoY = y; autoLastSet = window.pageYOffset || 0;
      lastTime = 0;               // avoid a dt spike on the first auto frame
      // put the film on the frame that matches the page, then let it play
      const t0 = Math.max(0, Math.min(videoDuration - 0.1, (y / maxScroll) * videoDuration));
      autoDrive = false; autoPending = true;
      if (Math.abs(video.currentTime - t0) > 0.04) { try { video.currentTime = t0; } catch (_) {} }
    } else {
      if (eng) eng.stopDrive();
      autoDrive = false; autoPending = false;
      if (autoActive) { dirty = true; }
    }
    autoActive = on;
  }

  function setupAutoScroll() {
    // Any manual input takes over immediately, cancels auto-scroll, and keeps it
    // from starting later if the visitor scrolled before the 5 s delay was over.
    // LOCKED: the visitor cannot scroll by wheel, touch, keyboard or scrollbar. Only the automatic playback moves the page.
    const block = (e) => { if (e.cancelable) e.preventDefault(); };
    window.addEventListener('wheel', block, { passive: false });
    window.addEventListener('touchmove', block, { passive: false });
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].indexOf(e.key) !== -1) e.preventDefault();
    });

    // Auto-scroll starts AUTO_SCROLL_DELAY_MS after the page is usable. On phones in portrait the
    // rotate prompt is showing, so the countdown only begins once the device is horizontal.
    const gate = window.ROTATE_GATE;
    let autoTimer = null;
    const scheduleAuto = () => {
      clearTimeout(autoTimer);
      autoTimer = setTimeout(() => {
        if (filmLoading && performance.now() < 30000) { scheduleAuto(); return; }   // wait (max ~30 s) for the in-memory film so auto-scroll is perfectly smooth
        if (!userTookOver && !(gate && gate.blocked())) setAutoScroll(true);
      }, AUTO_SCROLL_DELAY_MS);
    };
    if (!(gate && gate.blocked())) scheduleAuto();
    if (gate) {
      gate.onChange(() => {
        if (gate.blocked()) {
          clearTimeout(autoTimer);
          if (autoActive) setAutoScroll(false);
        } else {
          onResize();
          if (!userTookOver) scheduleAuto();
        }
      });
    }
  }

  /* ==========================================================================
     7. Bootstrap
     ========================================================================== */

  function init() {
    setupDebug();

    // Smooth wheel scrolling (Lenis is optional: if the CDN is blocked we still run fine)
    if (false && typeof window.Lenis === 'function') {
      try {
        lenis = new window.Lenis({
          lerp: config.lenisLerp,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.4
        });
      } catch (err) {
        console.warn('Lenis failed to start, using native scroll:', err);
        lenis = null;
      }
    }

    setupAutoScroll();
    onResize();

    try {
      initTextOverlays();
    } catch (err) {
      console.error('Text overlay init failed:', err);
      lastError = 'overlay init: ' + err.message;
    }

    window.addEventListener('load', () => { measureScroll(); dirty = true; });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });

    targetProgress = readScrollProgress();
    currentProgress = targetProgress;

    eng = new ScrubEngine(video, {
      fps: 60,
      maxRate: matchMedia('(pointer:coarse)').matches ? 2.5 : 4,   // phones: don't ask the hardware decoder for more than ~2.5x
      onSwap: function (nv) {          // the in-memory copy takes over: rebind and carry on
        video = nv; bindVideo(nv);
        upgraded = true; filmLoading = false; setStatus('');
        onVideoReady(); dirty = true;
      }
    });

    // Start the loop right away (draws black until the first frame is ready).
    requestAnimationFrame(animationLoop);

    // Load the film and show its first frame as soon as it is available
    video.src = ScrubEngine.src(config.videoSrc);
    video.load();
    onVideoReady();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
