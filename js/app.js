/* ==========================================================================
   Nexoré — autoplay hero film + 3D portfolio ring
   ==========================================================================

   ✏️  EDIT HERE ─ everything you’re likely to change lives in CONFIG.
   ========================================================================== */

const CONFIG = {
  // Warm up the demo that sits at the front of the ring once the visitor lingers on it, so tapping it opens almost instantly.
  // Skipped automatically on Save-Data, 2G and mobile-data connections. Set false to turn off.
  prefetchDemos: true,
  // --- Your four demo websites --------------------------------------------
  // url:     relative path to the site's folder (works on GitHub Pages, no server config needed)
  // image:   still shown on the card until its film is ready (and for reduced-motion / Save-Data) — files live in assets/img/previews/
  // vid:     a short film of the real site being scrolled, played inside the card (loops back and forth) — files live in assets/video/previews/
  // frame:   '16:9' (wide frame, for landscape sites) or '9:16' (tall frame, for phone-first sites). Must match the film's shape.
  // host:    optional text shown in the little address bar on the card
  // type:    the headline shown above the ring while this site is at the front
  // feats:   [name, benefit] pairs shown under the ring — real business problems the site solves (3 each; phones show 2)
  // warn:    optional heads-up text. If set, a notice with “Go back / Open site” appears before the site opens.
  // preview: 'saas' | 'store' | 'studio' → built-in placeholder mock-up, only used when `image` is empty
  sites: [
    { title: 'Lamborghini', kind: 'Revuelto · cinematic scroll', type: 'Pure animation', url: 'lamborghini/', host: 'nexore / lamborghini', preview: 'studio', image: 'assets/img/previews/poster-lamborghini.webp', vid: 'assets/video/previews/lamborghini.mp4', frame: '16:9',
      accent: '#f2c230',
      preload: () => ({ label: 'the cinematic film', hint: 82.2e6, blobs: [{ src: 'lamborghini/assets/revuelto-scrub.mp4', bytes: 82026381 }] }),
      facts: [
        'The Revuelto pairs a 6.5-litre V12 with three electric motors for 1,015 CV.',
        'It sprints from 0 to 100 km/h in about 2.5 seconds.',
        'Lamborghini’s raging-bull badge nods to founder Ferruccio’s star sign: Taurus.',
        'This whole page is one film. Your scroll controls its playhead, frame by frame.',
      ],
      feats: [
        ['Scroll-driven film', 'Visitors scroll through the story, so a premium product holds attention.'],
        ['Light on any phone', 'Smart preloading keeps it smooth on mid-range phones, so nobody bounces.'],
        ['Hands-free start', 'The story starts on its own; any touch hands control back instantly.'],
      ] },
    { title: 'Véyra', kind: 'Luxury fragrance store', type: 'Animation meets real-world', url: 'veyra/', host: 'nexore / veyra', preview: 'store', image: 'assets/img/previews/poster-veyra.webp', vid: 'assets/video/previews/veyra.mp4', frame: '16:9',
      accent: '#c9a45c',
      preload: () => { const m = Math.min(innerWidth, innerHeight) <= 760 || matchMedia('(pointer:coarse)').matches;   // same test the demo uses
        return { label: 'the cinematic film', hint: (m ? 32.3e6 : 63.9e6), extra: ['veyra/assets/poster.jpg'], blobs: [m ? { src: 'veyra/assets/hero-m.mp4', bytes: 32118826 } : { src: 'veyra/assets/hero.mp4', bytes: 63787410 }] }; },
      facts: [
        'Top notes fade within minutes. The heart and base notes are what you wear for hours.',
        'The same perfume smells different on different skin. Your chemistry is part of the formula.',
        'Eau de parfum usually holds 15–20% fragrance oil. Eau de toilette, closer to 5–15%.',
        'Spray on pulse points like wrists and neck. The warmth helps the scent bloom.',
      ],
      feats: [
        ['Scroll-scrubbed hero', 'The bottle’s story plays as you scroll, then lands straight in the shop.'],
        ['Scent-family filters', 'Notes on every card help shoppers pick a scent they can’t smell online.'],
        ['Free-shipping meter', 'The bag shows how close they are to free shipping, nudging bigger orders.'],
      ] },
    { title: 'Élvaré', kind: 'Jewellery e-commerce', type: 'Perfectly balanced', url: 'elvare/', host: 'nexore / elvare', preview: 'store', image: 'assets/img/previews/poster-elvare.webp', vid: 'assets/video/previews/elvare.mp4', frame: '9:16',
      accent: '#d9728f',
      preload: () => ({ label: 'the store', hint: 5.2e6 }),
      facts: [
        'A pearl is built by a living oyster, one thin layer of nacre at a time, over months or years.',
        'Tarnish is a reaction with sulphur and moisture in the air. That’s why anti-tarnish finishes matter.',
        'This store sends orders to WhatsApp, the app hundreds of millions of Indians already use daily.',
      ],
      feats: [
        ['Send bag to WhatsApp', 'Customers order in the chat they already use: bag pre-filled, zero clutter.'],
        ['Gift-combo enquiry', 'One tap turns “what should I gift?” into a chat that ends in a sale.'],
        ['Delivery details upfront', 'One short form collects name, pincode and address, so fewer follow-ups.'],
      ] },
    { title: 'Vanta District', kind: '3D streetwear store', type: '3D-based', url: 'vanta/', host: 'nexore / vanta', preview: 'store', image: 'assets/img/previews/poster-vanta.webp', vid: 'assets/video/previews/vanta.mp4', frame: '9:16',
      accent: '#c8ff00',
      preload: () => { const H = 'https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/';   // lighting maps the 3D scene fetches at runtime
        return { label: '3D engine', hint: 4.5e6, extra: [H + 'dikhololo_night_1k.hdr', H + 'potsdamer_platz_1k.hdr'] }; },
      facts: [
        'Every garment you’ll spin is real 3D geometry, drawn live by your device’s graphics chip.',
        'Streetwear lives on limited “drops” that sell out fast, so a store has to feel instant.',
        'The colour switcher repaints the 3D model itself, not a flat photo.',
      ], warn: 'Vanta District is built with 3D graphics, so it may load slowly or lag on older phones and laptops. For the smoothest experience, open it on a desktop or a recent device.',
      feats: [
        ['Spin it in 3D', 'Shoppers inspect garments from every side, so fewer wrong-pick returns.'],
        ['Size before bag', 'A size is required before adding, so fewer sizing mistakes and refunds.'],
        ['Live colour switcher', 'Each colourway shows on the real model, not a guess from flat photos.'],
      ] },
  ],


  // --- Loading-screen facts shown for every demo (each site also has its own `facts`) --------
  facts: [
    'Visitors form an opinion of a website in roughly 50 milliseconds.',
    'Over half of mobile visitors leave a page that takes longer than 3 seconds to load. That’s why everything downloads first.',
    'Everything is loading now, so nothing buffers, stutters or pops in once you’re inside.',
    'Tip: the Nexoré button at the top brings you straight back to the gallery.',
  ],

  // --- Contact -------------------------------------------------------------
  contactUrl: 'https://www.instagram.com/nexo.re_?rpxt=amF1NGVtazZtZDdp',   // Instagram option in the Contact sheet
  email: 'nexoree@gmail.com',                                                // Email option: opens a ready-written draft to this address
  emailSubject: 'Website enquiry for my business',
  emailBody: [
    'Hi Nexoré team,',
    '',
    'I would like to get a website made for my business. Here are a few details:',
    '',
    '• Business name:',
    '• What we do / sell:',
    '• Type of website (online store, brand site, portfolio, 3D / animated, other):',
    '• Pages or features I need:',
    '• When I would like it live:',
    '• Budget range (optional):',
    '• Websites I like (optional):',
    '',
    'Please let me know the next steps and a quote.',
    '',
    'Thank you,',
    '[Your name]',
    '[Phone / WhatsApp]',
  ].join('\n'),

  // --- Film ----------------------------------------------------------------
  // TWO films, picked automatically from the shape of the screen (and swapped live on resize / rotate):
  //   video   → portrait film  (9:16) for phones & tablets held upright
  //   desktop → landscape film (16:9) for desktops and any landscape screen (width ÷ height ≥ 1.2)
  // video = the portrait (mobile) film:
  video: {
    src:  'assets/video/hero-scrub.mp4',        // 810×1440, every frame a keyframe (~4.8 MB)
    lite: 'assets/video/hero-scrub-lite.mp4',   // 480×854 for Save-Data / 2G (~2 MB)
    bytes: 4835911, liteBytes: 1984640,         // used for the loading % if the server omits Content-Length
    fps: 24, duration: 10,
    pauseMs: 0,        // no hold: the film rolls the moment it can play through (target: 2 s after the page opened)
    rate: 1.6,         // playback speed: 1 = original 10 s film, 1.6 ≈ 6.3 s. Higher = faster to the button
  },

  // “View Portfolio” button position inside the portrait film, in % of the frame (x, y, width, height)
  hotspot: { x: 18, y: 53, w: 21.6, h: 3.7 },

  // The landscape (desktop) film
  desktop: {
    src:  'assets/video/hero-desktop.mp4',         // 1920×1080, 30 fps, keyframe every 5 frames (~3.2 MB)
    lite: 'assets/video/hero-desktop-lite.mp4',    // 640×360 for Save-Data / 2G (~0.6 MB)
    bytes: 3213894, liteBytes: 594617,
    fps: 30, duration: 6.7,                        // 201 frames
    pauseMs: 0,        // no hold: rolls as soon as it can play through (target: 2 s after the page opened)
    rate: 1,           // 1 = the film at its own pace (6.7 s)
    // The in-video “View Portfolio” button appears at ≈5.7 s and stops moving at ≈6.0 s.
    // The clickable hotspot goes live at this film time (seconds), not at the end of the clip,
    // so the real button is clickable the instant it lands. Set to null to wait for the end instead.
    hotspotAt: 6.0,
    // button box measured from the film's final frame, in % of the frame (x, y, width, height)
    hotspot: { x: 9.4, y: 65.8, w: 20.1, h: 9.0 },
  },

  // --- 3D ring -------------------------------------------------------------
  ring: {
    autoSpeed: -7,       // degrees per second while idle (negative = the ring turns the other way; use 7 for the original direction)
    resumeDelay: 1600,   // ms to wait after touch/drag/hover before easing back into motion
    degPerPx: 0.42,      // drag sensitivity
    dragThreshold: 6,    // px before a press counts as a drag (below this it is a tap)
  },
};

/* ==========================================================================
   Nothing below needs editing for day-to-day changes
   ========================================================================== */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const damp  = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt));
const mod   = (n, m) => ((n % m) + m) % m;
const smooth = t => t * t * (3 - 2 * t);
const root  = document.documentElement;

const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
const mqWide   = matchMedia('(min-aspect-ratio: 78/100)');
// Landscape-ish screens get the 16:9 desktop film. SAME query as css/styles.css and the <picture>/<link> tags in index.html.
const mqDesk   = matchMedia('(min-aspect-ratio: 6/5)');
const mqFine   = matchMedia('(hover: hover) and (pointer: fine)');   // mouse → “Click”, touch → “Tap”
let reduced = mqReduce.matches;
root.classList.toggle('rm', reduced);

/* --------------------------------------------------------------------------
   Elements
   -------------------------------------------------------------------------- */
const el = {
  hero: $('#hero'), stage: $('#stage'), frame: $('#frame'),
  video: $('#video'), poster: $('#poster'), endImg: $('#endImg'), ambient: $('#ambient'),
  hotspot: $('#hotspot'), cue: $('#cue'), cueTxt: $('#cueTxt'), cueBar: $('#cueBar'),
  skip: $('#skip'), caps: $$('.cap'), scrim: $('.scrim'),
  navPortfolio: $('#navPortfolio'), navContact: $('#navContact'), spaceContact: $('#spaceContact'), nav: $('#nav'), main: $('#main'),
  space: $('#space'), ring: $('#ring'), backBtn: $('#backBtn'), prev: $('#prevBtn'), next: $('#nextBtn'),
  nowTitle: $('#nowTitle'), nowKind: $('#nowKind'), live: $('#live'),
  head: $('#headInner'), headEyebrow: $('#headEyebrow'), headTitle: $('#headTitle'),
  info: $('#info'), feats: $('#feats'), dotsBox: $('#dots'), hint: $('#hint'), dots: [],
};
el.stars = $('#stars');
[el.navContact, el.spaceContact].forEach(a => { a.href = CONFIG.contactUrl; a.target = '_blank'; a.rel = 'noopener noreferrer'; });

/* The two films. `V` is whichever one is active; everything below reads from it. */
const FILMS = {
  mobile:  { name: 'mobile',  ...CONFIG.video,   hotspot: CONFIG.hotspot,         hotspotAt: null, ambient: [24, 43] },
  desktop: { name: 'desktop', ...CONFIG.desktop,                                   ambient: [48, 27] },
};
let V = mqDesk.matches ? FILMS.desktop : FILMS.mobile;

// Hotspot geometry + ambient canvas come from CONFIG so there is one source of truth.
function applyFilmLayout() {
  const h = V.hotspot, s = el.frame.style;
  s.setProperty('--hx', h.x + '%');  s.setProperty('--hy', h.y + '%');
  s.setProperty('--hw', h.w + '%');  s.setProperty('--hh', h.h + '%');
  s.setProperty('--hcx', (h.x + h.w / 2) + '%'); s.setProperty('--hcy', (h.y + h.h / 2) + '%');
  if (el.ambient.width !== V.ambient[0] || el.ambient.height !== V.ambient[1]) {
    el.ambient.width = V.ambient[0]; el.ambient.height = V.ambient[1];
  }
}
applyFilmLayout();

const state = { open: false, lastFocus: null };

/* ==========================================================================
   1. HERO — autoplay film: hold first frame → play → hotspot goes live at the end
   ========================================================================== */
const H = {
  cur: 0,                          // film progress 0..1
  ready: false, still: false,      // still = no decodable video (reduced motion / failure): crossfade two stills
  playing: false, finished: false, mode: 'play',   // mode 'play' = native playback, 'clock' = we step frames ourselves
  clock: 0, last: 0, raf: 0, startT: 0,
  lastN: -1, pending: null, frames: V.fps * V.duration,
  duration: V.duration, loaded: false, focusOnEnd: false,
  capK: [], scrimV: -1,
  boot: 0, blobUrl: null,          // boot = token so a stale load (after a film swap) can never clobber a newer one
};

function wake() {
  if (H.raf) return;
  H.last = performance.now();
  H.raf = requestAnimationFrame(tick);
}
function tick(now) {
  H.raf = 0;
  const dt = Math.min(0.05, (now - H.last) / 1000 || 0.016); H.last = now;
  if (H.playing) {
    if (H.mode === 'clock') {
      H.clock += dt * V.rate;
      H.cur = clamp(H.clock / H.duration);
      renderFilm(H.cur);
    } else {
      H.cur = clamp(el.video.currentTime / H.duration);
    }
    if (H.cur >= 1 || (H.mode === 'play' && el.video.ended)) finishFilm();
    drawAmbient();
  }
  updateUI();
  if (H.playing) { H.raf = requestAnimationFrame(tick); }
}

function renderFilm(n01) {
  if (H.ready) {
    seekFrame(clamp(Math.round(n01 * (H.frames - 1)), 0, H.frames - 1));
  } else {
    // no decoded video: crossfade first → last still
    el.endImg.style.opacity = smooth(clamp((n01 - .55) / .4)).toFixed(3);
  }
}
function seekFrame(n) {
  if (n === H.lastN) return;
  H.lastN = n;
  const t = (n + 0.5) / V.fps;                      // centre of the frame → never lands on a boundary
  if (el.video.seeking) { H.pending = t; return; }  // one seek in flight; always chase the latest target
  el.video.currentTime = t;
}
el.video.addEventListener('seeked', () => {
  if (H.pending !== null) { const t = H.pending; H.pending = null; el.video.currentTime = t; return; }
  el.video.classList.add('is-ready');
  drawAmbient();
});
el.video.addEventListener('ended', () => { if (H.mode === 'play') finishFilm(); });
function drawAmbient(force) {
  if (!mqWide.matches || !H.ready) return;
  // The ambient wash is a 48×27 canvas blurred by 26 px behind the film. Repainting it every frame forces the GPU to
  // re-blur a screen-sized layer 60×/s (the main cause of stutter on laptops), and nobody can see the difference,
  // so it refreshes ~7×/s instead (always on the first call and when forced).
  const now = performance.now();
  if (!force && H.ambT && now - H.ambT < 140) return;
  H.ambT = now;
  const c = el.ambient, ctx = c.getContext('2d', { alpha: false });
  try { ctx.drawImage(el.video, 0, 0, c.width, c.height); } catch (_) {}
}

function startFilm() {
  if (H.playing || H.finished) return;
  H.playing = true;
  if (H.ready) {
    el.video.playbackRate = V.rate;
    const p = el.video.play();
    H.mode = 'play';
    if (p && p.catch) p.catch(() => {            // autoplay blocked (e.g. iOS low-power mode) → drive the frames ourselves
      H.mode = 'clock'; H.clock = el.video.currentTime || 0; H.lastN = -1; wake();
    });
  } else {
    H.mode = 'clock'; H.clock = 0;
  }
  wake();
}
function finishFilm() {
  if (H.finished) return;
  // Played all the way to its last frame (the natural end) vs. cut short (Skip / early finish)
  const natural = H.cur >= 0.985 || el.video.ended;
  H.finished = true; H.playing = false; H.cur = 1;
  clearTimeout(H.startT);
  drawAmbient(true);
  if (H.ready) {
    try { el.video.pause(); } catch (_) {}
    H.lastN = -1;
    // A video that played to its end already shows its last frame. Seeking an *ended* (or nearly ended) video makes Chrome (esp. Android)
    // flash frame 0, so only seek when the film is being finished early.
    if (!natural && !el.video.ended) seekFrame(H.frames - 1);
  }
  else el.endImg.style.opacity = '1';
  updateUI();
}

/* ---- film-tied UI (captions, cue, hotspot) ---- */
function updateUI() {
  const x = H.cur;

  // captions: fade/slide in, hold, fade out — slaved to film time
  let maxK = 0;
  el.caps.forEach((c, i) => {
    const dk = V.name === 'desktop' && c.dataset.da != null;   // desktop film has its own caption timing (data-da / data-db)
    const a = +(dk ? c.dataset.da : c.dataset.a), b = +(dk ? c.dataset.db : c.dataset.b), first = c.hasAttribute('data-first');
    const fin = first ? 1 : smooth(clamp((x - a) / 0.04));
    const fout = smooth(clamp((b - x) / 0.04));
    const k = reduced ? 0 : Math.min(fin, fout);
    maxK = Math.max(maxK, k);
    const kk = Math.round(k * 200) / 200;
    if (H.capK[i] !== kk) {
      H.capK[i] = kk;
      c.style.setProperty('--k', kk);
      c.style.visibility = kk > 0.01 ? 'visible' : 'hidden';
    }
  });
  const sv = Math.round(maxK * 100) / 100;
  if (sv !== H.scrimV) { H.scrimV = sv; el.scrim.style.setProperty('--scrim', sv); }

  // The in-video button is clickable from the moment it lands (film time V.hotspotAt on the desktop film),
  // or at the very end of the film (portrait film / fallback).
  // Once the film is over, the last-frame still (not the <video>) is what's on screen: some mobile browsers drop a paused/ended
  // video's frame and show the first one, which leaves the hotspot ring floating over the wrong picture.
  // Hand over from the <video> to the last-frame still WITHOUT a gap: the still goes on top first (is-end), and only once it has
  // had time to paint is the video underneath hidden (is-end-solid). Hiding both in the same frame could flash a blank/first frame.
  if (el.frame.classList.contains('is-end') !== !!H.finished) {
    el.frame.classList.toggle('is-end', !!H.finished);
    clearTimeout(H.solidT);
    if (H.finished) H.solidT = setTimeout(() => el.frame.classList.add('is-end-solid'), 350);
    else el.frame.classList.remove('is-end-solid');
  }
  const atEnd = H.finished || hotspotReached();
  const live = atEnd && !state.open;
  if (live !== el.hotspot.classList.contains('is-live')) {
    el.hotspot.classList.toggle('is-live', live);
    el.hotspot.tabIndex = live ? 0 : -1;
    el.hotspot.setAttribute('aria-hidden', live ? 'false' : 'true');
    if (live && H.focusOnEnd) { H.focusOnEnd = false; el.hotspot.focus({ preventScroll: true }); }
  }

  if (el.skip) el.skip.classList.toggle('is-off', atEnd || reduced);

  // cue: loading → hidden while the film plays → "tap View Portfolio"
  let cs;
  if (!H.loaded && !reduced) cs = 'loading';
  else if (atEnd)            cs = 'end';
  else                       cs = 'hidden';
  if (el.cue.dataset.state !== cs) {
    el.cue.dataset.state = cs;
    if (cs === 'end') el.cueTxt.textContent = (mqFine.matches ? 'Click' : 'Tap') + ' “View Portfolio”';
  }
}
/** True once the film has played far enough that the real in-video button is on screen and still. */
function hotspotReached() {
  return V.hotspotAt != null && H.cur * H.duration >= V.hotspotAt;
}
function setLoad(frac) {
  const pct = Math.round(clamp(frac) * 100);
  el.cueBar.style.transform = `scaleX(${clamp(frac)})`;
  if (el.cue.dataset.state === 'loading') el.cueTxt.textContent = `Loading scene ${pct}%`;
}

/* ---- loading ---- */
const START_BY_MS = 2000;   // the film should be rolling this many ms after the page opened (when the connection allows)
function prefersLite() {
  const c = navigator.connection;
  return !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')));
}
async function loadVideo(my) {
  // The film is NOT downloaded in full first any more: it is attached straight away (index.html already started the request
  // while the page was still parsing) and we begin as soon as the browser can play it through without stalling.
  const lite = prefersLite();
  const src = lite ? V.lite : V.src;
  const v = el.video;
  const abs = new URL(src, location.href).href;
  await new Promise((resolve, reject) => {
    let settled = false, slowT = 0;
    const clean = () => { ['canplaythrough', 'canplay', 'progress', 'error'].forEach(ev => v.removeEventListener(ev, onEv)); clearTimeout(slowT); clearTimeout(hard); };
    const finish = fn => { if (settled) return; settled = true; clean(); fn(); };
    const frac = () => {                                   // loading % = how much of the film is buffered
      try { const b = v.buffered, d = v.duration || V.duration; if (b.length && d) return Math.min(1, b.end(b.length - 1) / d); } catch (_) {}
      return 0;
    };
    const onEv = e => {
      if (my !== H.boot) return finish(() => resolve());   // film was swapped mid-load: bootFilm() notices the stale token
      if (e && e.type === 'error') return finish(() => reject(new Error('video error')));
      setLoad(frac() * 0.98);
      if (v.readyState >= 4) return finish(resolve);       // the browser expects to play to the end without buffering
      if (v.readyState >= 3 && performance.now() >= START_BY_MS) return finish(resolve);   // 2 s passed: enough is buffered, go
    };
    // At the 2 s mark, start as soon as there is a playable buffer (do not wait for the whole file on a slow line)
    slowT = setTimeout(() => onEv(), Math.max(0, START_BY_MS - performance.now()) + 20);
    const hard = setTimeout(() => (v.readyState >= 2 ? finish(resolve) : finish(() => reject(new Error('video timeout')))), 20000);
    ['canplaythrough', 'canplay', 'progress', 'error'].forEach(ev => v.addEventListener(ev, onEv));
    v.muted = true; v.playsInline = true; v.preload = 'auto';
    if (v.currentSrc !== abs && v.getAttribute('src') !== src) { v.src = src; v.load(); }   // already attached early by index.html → keep it
    else if (v.readyState >= 4) onEv();
  });
}
async function bootFilm() {
  const my = ++H.boot;
  if (reduced) { stillMode(); return; }
  try {
    await loadVideo(my);
    if (my !== H.boot) return;
    H.duration = el.video.duration || V.duration;
    H.frames = Math.max(2, Math.round(H.duration * V.fps));
    // iOS often paints the first frame only after one muted play(); harmless elsewhere
    if (my !== H.boot) return;
    H.ready = true; H.loaded = true; H.lastN = -1;
    try { el.endImg.decode().catch(() => {}); } catch (_) {}   // have the last-frame still decoded before the film reaches it
    el.endImg.style.opacity = '0';
    setLoad(1);
    if (H.finished) {                       // person hit “Skip intro” / Portfolio while it was loading
      seekFrame(H.frames - 1);
    } else {
      if (el.video.currentTime > 0.01) el.video.currentTime = 0;
      if (V.pauseMs > 0) H.startT = setTimeout(startFilm, V.pauseMs); else startFilm();   // roll straight away
    }
    updateUI(); wake();
    setTimeout(() => { if (my === H.boot) el.video.classList.add('is-ready'); }, 120);   // belt and braces if no 'seeked' fires
  } catch (_) {
    if (my !== H.boot) return;
    stillMode(true);
  }
}
function stillMode(failed) {
  H.still = true; H.ready = false; H.loaded = true;
  setLoad(1);
  if (reduced) { H.finished = true; H.cur = 1; el.endImg.style.opacity = '1'; }
  else if (!H.finished) H.startT = setTimeout(startFilm, V.pauseMs);   // crossfade the two stills on the same timeline
  updateUI(); wake();
}

/** Jump straight to the final frame (Skip intro, nav “Portfolio”). Resolves once the frame is on screen. */
function jumpToEnd() {
  return new Promise(resolve => {
    clearTimeout(H.startT);
    const wasFinished = H.finished;
    H.finished = true; H.playing = false; H.cur = 1;
    if (!H.ready) { el.endImg.style.opacity = '1'; updateUI(); return resolve(); }
    try { el.video.pause(); } catch (_) {}
    H.lastN = -1; H.pending = null;
    updateUI();
    if (wasFinished) return resolve();
    const done = () => { el.video.removeEventListener('seeked', done); resolve(); };
    el.video.addEventListener('seeked', done);
    seekFrame(H.frames - 1);
    setTimeout(done, 450);
  });
}
/** The button is already on screen and still: freeze right here instead of seeking (no visible hiccup on click). */
function settleHere() {
  clearTimeout(H.startT);
  H.finished = true; H.playing = false; H.pending = null;
  try { el.video.pause(); } catch (_) {}
  updateUI();
}
if (el.skip) el.skip.addEventListener('click', () => { H.focusOnEnd = true; jumpToEnd(); });

/* ==========================================================================
   2. HOTSPOT → transition → gallery
   ========================================================================== */
async function openGallery(from) {
  if (state.open) return;
  state.open = true;
  state.lastFocus = document.activeElement;
  if (!H.finished) { if (hotspotReached()) settleHere(); else await jumpToEnd(); }

  // Make sure the last-frame still is decoded before it takes over from the video for the zoom (no flash, no first frame)
  try { await el.endImg.decode(); } catch (_) {}

  // Zoom target = centre of the in-video button, driven to the middle of the viewport
  const hs = el.hotspot.getBoundingClientRect();
  const fr = el.frame.getBoundingClientRect();
  const cx = hs.left + hs.width / 2, cy = hs.top + hs.height / 2;
  const s = el.frame.style;
  s.setProperty('--ox', (cx - fr.left) + 'px');
  s.setProperty('--oy', (cy - fr.top) + 'px');
  s.setProperty('--zx', (innerWidth / 2 - cx) + 'px');
  s.setProperty('--zy', (innerHeight / 2 - cy) + 'px');
  s.setProperty('--zs', clamp((innerWidth * 1.15) / hs.width, 4, 9).toFixed(2));

  root.classList.add('is-locked', 'is-open');
  try { aurora.load(); loadStrips(); } catch (_) {}
  el.main.inert = true; el.nav.inert = true;
  // the ring swirls into place once it has grown into view
  G.angle = reduced ? 0 : -160; G.snap = null; G.snapL = 2.2; G.vel = 0; G.speed = 0;
  G.idleUntil = performance.now() + 1200;
  clearTimeout(G.intro);
  G.intro = setTimeout(() => { if (state.open && !G.drag) G.snap = 0; }, reduced ? 0 : 1100);
  renderRing();
  startRing();
  el.backBtn.focus({ preventScroll: true });
}
function closeGallery() {
  if (!state.open) return;
  state.open = false;
  if (typeof closeFeat === 'function') { F.open = false; F.box.hidden = true; featInert(false); }
  clearTimeout(G.intro);
  root.classList.remove('is-open');
  el.main.inert = false; el.nav.inert = false;
  setTimeout(() => {
    if (state.open) return;
    root.classList.remove('is-locked');
    stopRing();
    updateUI();
  }, reduced ? 300 : 1400);
  const back = state.lastFocus && document.contains(state.lastFocus) ? state.lastFocus : el.navContact;
  // focus right away so keyboard users keep their place (target is inert-free again)
  (el.hotspot.classList.contains('is-live') ? el.hotspot : back).focus({ preventScroll: true });
}
el.hotspot.addEventListener('click', () => openGallery('hotspot'));
if (el.navPortfolio) el.navPortfolio.addEventListener('click', () => openGallery('nav'));
el.backBtn.addEventListener('click', closeGallery);

/* ==========================================================================
   3. GALLERY — four glass cards on a 3D ring
   ========================================================================== */
const G = {
  angle: 0, vel: 0, speed: 0, snap: null, idleUntil: 0,
  hover: false, focusHold: false, drag: null, suppress: false,
  raf: 0, last: 0, front: -1, cards: [], snapL: 4.2, intro: 0,
};
const N = CONFIG.sites.length;
const STEP = 360 / N;

// card preview films (the real demo sites being scrolled): downloaded after the intro film is rolling, and each one plays ONLY while its card faces the viewer,
// so at most one or two small videos decode at a time. Reduced motion / Save-Data / 2G keep the still instead.
const PV = {
  loaded: false,
  ok() { const c = navigator.connection; return !reduced && !(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))); },
  load() {
    if (PV.loaded || !PV.ok()) return;
    PV.loaded = true;
    G.cards.forEach(c => {
      const v = c.vid; if (!v || !v.dataset.src) return;
      v.addEventListener('playing', () => v.classList.add('is-on'), { once: true });
      if (c.site.rate) { v.defaultPlaybackRate = c.site.rate; v.playbackRate = c.site.rate; }   // optional slower preview
      v.preload = 'auto'; v.src = v.dataset.src; v.removeAttribute('data-src');
    });
    PV.sync();
  },
  sync() {
    if (!PV.loaded) return;
    const live = state.open && G.raf && !document.hidden && PV.ok();
    G.cards.forEach(c => {
      const v = c.vid; if (!v || !v.getAttribute('src')) return;
      const want = !!live && c.facing > 0.3;           // 1 = facing us, 0 = behind
      if (want === c.pv) return;
      c.pv = want;
      if (want) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
    });
  },
};
document.addEventListener('visibilitychange', () => PV.sync());

/* ---- placeholder previews ---- */
const ICON_OPEN = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 11L11 5M6 5h5v5"/></svg>';
const PREVIEWS = {
  saas: `
  <div class="mk mk--a">
    <div class="mk-nav"><span class="mk-dot"></span><b>Aurora</b><i class="mk-sp"></i><u></u><u></u><em>Start free</em></div>
    <div class="mk-hero"><h4>Analytics that move with you</h4><p class="mk-lines"><s></s><s></s><s></s></p>
      <div class="mk-cta"><em>Get started</em><span>Watch demo</span></div></div>
    <div class="mk-dash">
      <div class="mk-dash__top"><span>Revenue</span><b>$48.2k</b><em>+12.4%</em></div>
      <svg class="mk-spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="mkg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f6bf0" stop-opacity=".55"/><stop offset="1" stop-color="#2f6bf0" stop-opacity="0"/></linearGradient></defs>
        <path d="M0 24 C10 22 14 11 24 13 S38 22 48 15 S64 4 74 8 S92 13 100 3 V30 H0Z" fill="url(#mkg)"/>
        <path d="M0 24 C10 22 14 11 24 13 S38 22 48 15 S64 4 74 8 S92 13 100 3" fill="none" stroke="#8db0ff" stroke-width="1.2" vector-effect="non-scaling-stroke"/>
      </svg>
      <div class="mk-bars"><i style="--h:38%"></i><i style="--h:56%"></i><i style="--h:44%"></i><i style="--h:72%"></i><i style="--h:60%"></i><i style="--h:88%"></i><i style="--h:100%"></i></div>
    </div>
    <div class="mk-feats"><div><i></i><s></s><s></s></div><div><i></i><s></s><s></s></div><div><i></i><s></s><s></s></div></div>
    <div class="mk-quote">“We shipped twice as fast.”<small>Placeholder testimonial</small></div>
  </div>`,
  store: `
  <div class="mk mk--b">
    <div class="mk-nav"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a1428" stroke-width="2" stroke-linecap="round" aria-hidden="true" style="width:6cqw;height:6cqw"><path d="M4 7h16M4 12h16M4 17h10"/></svg><b>MERIDIAN</b><i class="mk-sp"></i>
      <span class="mk-bag"><svg viewBox="0 0 24 24" fill="none" stroke="#0a1428" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8zM9 8a3 3 0 016 0"/></svg><em>2</em></span></div>
    <div class="mk-banner"><small>New season</small><h4>Objects made to last</h4><em>Shop now</em><div class="mk-orb"></div></div>
    <h5>Featured</h5>
    <div class="mk-grid">
      <div class="mk-prod"><div class="mk-img mk-img--1"></div><b>Halo Lamp</b><span>$129</span></div>
      <div class="mk-prod"><div class="mk-img mk-img--2"></div><b>Slate Tray</b><span>$64</span></div>
      <div class="mk-prod"><div class="mk-img mk-img--3"></div><b>Tide Vase</b><span>$88</span></div>
      <div class="mk-prod"><div class="mk-img mk-img--4"></div><b>Dusk Clock</b><span>$156</span></div>
    </div>
  </div>`,
  studio: `
  <div class="mk mk--c">
    <div class="mk-nav"><b>HALCYON®</b><i class="mk-sp"></i><span>Work</span><span>Studio</span><span class="mk-pill">Say hi</span></div>
    <h4>We make quiet, striking websites.</h4>
    <div class="mk-marquee"><span>Brand ✶ Web ✶ Motion ✶ Identity ✶ Brand ✶ Web ✶ Motion ✶ Identity ✶ </span></div>
    <div class="mk-mosaic"><i class="t1"></i><i class="t2"></i><i class="t3"></i><i class="t4"></i></div>
    <div class="mk-foot"><span>Let’s talk →</span><i><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg></i></div>
  </div>`,
};
function hostOf(u) { try { return new URL(u, location.href).hostname.replace(/^www\./, ''); } catch (_) { return u; } }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function buildCards() {
  el.ring.innerHTML = '';
  G.cards = CONFIG.sites.map((site, i) => {
    const a = document.createElement('a');
    a.className = 'card' + (site.vid ? (site.frame === '9:16' ? ' card--p' : ' card--l') : '');
    a.href = site.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.draggable = false;
    a.style.setProperty('--a', (i * STEP) + 'deg');
    a.setAttribute('aria-label', `${site.title} — ${site.kind}`);
    // site.strip = a tall image of the real site at several scroll positions; it glides upward inside the card like someone scrolling the page
    const strip = site.strip
      ? `<img class="site__strip" data-src="${esc(site.strip.src)}" alt="" aria-hidden="true" draggable="false" decoding="async" style="--k:${((site.strip.n - 1) / site.strip.n).toFixed(4)};--dur:${site.strip.n * 2.6}s;--del:${(-i * 3.1).toFixed(1)}s">`
      : '';
    // site.vid = a short film of the real site being scrolled; it fades in over the still once it can play (see PV below)
    const film = site.vid
      ? `<video class="site__vid" data-src="${esc(site.vid)}" muted loop playsinline preload="none" disablepictureinpicture disableremoteplayback tabindex="-1" aria-hidden="true"></video>`
      : '';
    const view = site.image
      ? `<img src="${esc(site.image)}" alt="${esc('Preview of ' + site.title + ', ' + site.kind)}" draggable="false" loading="lazy" decoding="async">${strip}${film}`
      : `<div class="site__scroll">${PREVIEWS[site.preview] || PREVIEWS.saas}</div>`;
    a.innerHTML = `
      <div class="card__face card__front">
        <div class="site" aria-hidden="true">
          <div class="site__bar"><span class="site__dots"><i></i><i></i><i></i></span><span class="site__url">${esc(site.host || hostOf(site.url))}</span></div>
          <div class="site__view">${view}<div class="site__sheen"></div></div>
        </div>
        <div class="card__meta"><div><strong>${esc(site.title)}</strong><span class="k">${esc(site.kind)}</span></div><span class="card__open" aria-hidden="true">${ICON_OPEN}</span></div>
      </div>
      <div class="card__face card__back" aria-hidden="true"><span>NEXORÉ</span></div>`;
    a.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') G.hover = true; });
    a.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { G.hover = false; G.idleUntil = performance.now() + CONFIG.ring.resumeDelay; } });
    // keyboard focus only: bring that card round to the front and hold still
    a.addEventListener('focus', () => { if (a.matches(':focus-visible')) { G.focusHold = true; snapTo(i, true); } });
    a.addEventListener('blur',  () => { G.focusHold = false; G.idleUntil = performance.now() + CONFIG.ring.resumeDelay; });
    el.ring.appendChild(a);
    const vid = a.querySelector('video.site__vid');
    if (vid) vid.muted = true;                       // iOS/Safari only autoplay when muted is set as a property too
    return { el: a, site, vid, facing: 0, pv: false };
  });
}

/* ---- loop ---- */
function startRing() { if (G.raf) return; G.last = performance.now(); G.raf = requestAnimationFrame(ringTick); }
function stopRing()  { cancelAnimationFrame(G.raf); G.raf = 0; PV.sync(); }
function ringTick(now) {
  const dt = Math.min(0.05, (now - G.last) / 1000 || 0.016); G.last = now;
  const holding = !!G.drag || G.hover || G.focusHold || now < G.idleUntil;
  const target = (reduced || holding) ? 0 : CONFIG.ring.autoSpeed;
  G.speed = damp(G.speed, target, holding ? 8 : 0.7, dt);   // slows quickly, resumes slowly
  if (!G.drag) G.vel = damp(G.vel, 0, 2.6, dt);             // swipe inertia
  if (G.snap !== null && !G.drag) {
    G.angle = damp(G.angle, G.snap, reduced ? 40 : G.snapL, dt);
    if (Math.abs(G.snap - G.angle) < 0.05) { G.angle = G.snap; G.snap = null; G.snapL = 4.2; }
    G.vel = 0;
  } else if (!G.drag) {
    G.angle += (G.vel + G.speed) * dt;
  }
  renderRing();
  G.raf = requestAnimationFrame(ringTick);
}
let starTW = 0;
function measureStars() { const t = el.stars && el.stars.firstElementChild; starTW = t ? t.getBoundingClientRect().width : 0; }
addEventListener('resize', measureStars);
function renderRing() {
  el.ring.style.transform = `rotateY(${G.angle.toFixed(3)}deg)`;
  // starfield follows the ring: one full turn of the ring = 1.2 tile widths of sky (tiles alternate mirrored, so period = 2 tiles)
  if (el.stars) {
    if (!starTW) measureStars();
    const P = starTW * 2;
    if (P) el.stars.style.transform = `translate3d(${(-mod(G.angle * starTW * 1.2 / 360, P)).toFixed(2)}px,0,0)`;
  }
  G.cards.forEach((c, i) => {
    const rad = (G.angle + i * STEP) * Math.PI / 180;
    const facing = (Math.cos(rad) + 1) / 2;                       // 1 = facing us, 0 = behind
    const dim = 0.9 * (1 - Math.pow(facing, 1.35));               // depth fade
    c.el.style.setProperty('--dim', dim.toFixed(3));
    c.facing = facing;
  });
  PV.sync();
  const f = frontIdx();
  if (f !== S.shown && !S.busy) swapSite(f);
}
/* ---- what’s at the front: rotating heading + description panel ---- */
const S = { shown: -1, busy: false };
const frontIdx = () => mod(Math.round(-G.angle / STEP), N);
function paintSite(i) {
  const s = CONFIG.sites[i];
  el.headEyebrow.textContent = `Type of site · ${i + 1} / ${N}`;
  el.headTitle.textContent = s.type;
  el.nowTitle.textContent = s.title; el.nowKind.textContent = s.kind;
  el.feats.innerHTML = (s.feats || []).map(f => `<li><b>${esc(f[0])}</b>${esc(f[1])}</li>`).join('');
  el.dots.forEach((d, k) => { d.classList.toggle('is-on', k === i); d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
  S.shown = i;
  maybeWarm(i);
}
function swapSite(i) {
  if (S.shown < 0 || reduced) { paintSite(i); return; }
  S.busy = true;
  el.head.classList.add('is-out'); el.info.classList.add('is-out');
  setTimeout(() => {
    paintSite(frontIdx());                 // whatever is at the front *now* (the ring may have moved on)
    el.head.classList.remove('is-out'); el.info.classList.remove('is-out');
    S.busy = false;
  }, 200);
}
function buildDots() {
  el.dotsBox.innerHTML = '';
  el.dots = CONFIG.sites.map((site, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'dot'; b.setAttribute('aria-label', `Show ${site.title}`);
    b.addEventListener('click', () => { snapTo(i); el.live.textContent = `${site.title}, ${site.type}`; });
    el.dotsBox.appendChild(b); return b;
  });
}
function snapTo(i, quiet) {
  const base = -i * STEP;
  G.snap = base + 360 * Math.round((G.angle - base) / 360);
  G.vel = 0;
  if (!quiet) G.idleUntil = performance.now() + CONFIG.ring.resumeDelay * 2;
}
function step(dir) {
  const from = G.snap !== null ? G.snap : G.angle;
  const k = Math.round(-from / STEP) + dir;
  G.snap = -k * STEP; G.vel = 0;
  G.idleUntil = performance.now() + CONFIG.ring.resumeDelay * 2;
  const s = CONFIG.sites[mod(k, N)];
  el.live.textContent = `${s.title}, ${s.type}`;
}
el.prev.addEventListener('click', () => step(-1));
el.next.addEventListener('click', () => step(1));

/* ---- drag / swipe ---- */
const sp = el.space;
const dismissHint = () => el.hint.classList.add('is-gone');
sp.addEventListener('pointerdown', e => {
  if (e.target.closest('.dot, .dock__btn')) dismissHint();
  if (!state.open || (e.pointerType === 'mouse' && e.button !== 0) || e.target.closest('button')) return;
  G.drag = { id: e.pointerId, startX: e.clientX, lastX: e.clientX, lastT: e.timeStamp, moved: false };
  G.suppress = false; G.snap = null;
});
sp.addEventListener('pointermove', e => {
  const d = G.drag; if (!d || e.pointerId !== d.id) return;
  if (!d.moved && Math.abs(e.clientX - d.startX) > CONFIG.ring.dragThreshold) {
    d.moved = true; dismissHint(); sp.classList.add('is-dragging');
    try { sp.setPointerCapture(e.pointerId); } catch (_) {}
  }
  if (d.moved) {
    const dx = e.clientX - d.lastX, ms = Math.max(1, e.timeStamp - d.lastT);
    G.angle += dx * CONFIG.ring.degPerPx;
    G.vel = clamp(G.vel * 0.55 + (dx * CONFIG.ring.degPerPx / (ms / 1000)) * 0.45, -420, 420);
  }
  d.lastX = e.clientX; d.lastT = e.timeStamp;
});
function endDrag(e) {
  const d = G.drag; if (!d || e.pointerId !== d.id) return;
  if (d.moved) {
    G.suppress = true;                              // swallow the click that follows a drag
    setTimeout(() => { G.suppress = false; }, 350);
    try { sp.releasePointerCapture(e.pointerId); } catch (_) {}
  } else { G.vel = 0; }
  sp.classList.remove('is-dragging');
  G.drag = null;
  G.idleUntil = performance.now() + CONFIG.ring.resumeDelay;
}
sp.addEventListener('pointerup', endDrag);
sp.addEventListener('pointercancel', endDrag);
// Cards only open on a real tap — never at the end of a drag.
el.ring.addEventListener('click', e => { if (G.suppress) { e.preventDefault(); e.stopPropagation(); } }, true);

/* ---- heads-up notice before a heavy site opens ---- */
const W = { box: $('#warn'), text: $('#warnText'), go: $('#warnGo'), cancel: $('#warnCancel'), from: null, open: false };
const warnInert = on => { ['#scene', '.space__dock', '.space__top'].forEach(q => { const n = $(q, el.space); if (n) n.inert = on; }); };
function openWarn(site, fromEl) {
  W.text.textContent = site.warn; W.site = site;
  W.go.href = site.url;
  W.go.textContent = 'Open ' + site.title;
  W.from = fromEl; W.open = true;
  W.box.hidden = false; warnInert(true);
  G.focusHold = true; G.drag = null;
  W.go.focus({ preventScroll: true });
}
function closeWarn() {
  if (!W.open) return;
  W.open = false; W.box.hidden = true; warnInert(false);
  G.focusHold = false; G.idleUntil = performance.now() + CONFIG.ring.resumeDelay;
  if (W.from && document.contains(W.from)) W.from.focus({ preventScroll: true }); else el.backBtn.focus({ preventScroll: true });
}
el.ring.addEventListener('click', e => {
  if (G.suppress) return;
  const a = e.target.closest('.card'); if (!a) return;
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button > 0) return;   // modified click: let the browser open a new tab
  const entry = G.cards.find(c => c.el === a);
  if (!entry) return;
  e.preventDefault();
  if (entry.site.warn) { openWarn(entry.site, a); return; }
  const r = a.getBoundingClientRect();
  const x = e.detail === 0 ? r.left + r.width / 2 : e.clientX, y = e.detail === 0 ? r.top + r.height / 2 : e.clientY;
  openSite(entry.site, x, y, a);
});
W.cancel.addEventListener('click', closeWarn);
W.go.addEventListener('click', e => {
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.button > 0) { setTimeout(closeWarn, 0); return; }
  e.preventDefault();
  const site = W.site, r = W.go.getBoundingClientRect(), from = W.from;
  const x = e.detail === 0 ? r.left + r.width / 2 : e.clientX, y = e.detail === 0 ? r.top + r.height / 2 : e.clientY;
  closeWarn();
  openSite(site, x, y, from);
});
W.box.addEventListener('pointerdown', e => e.stopPropagation());       // don't spin the ring from inside the notice
W.box.addEventListener('click', e => { if (e.target === W.box) closeWarn(); });
// (touchmove blocking for iOS lives in the Why Nexoré block below, which lets the panel scroll)
sp.addEventListener('dragstart', e => e.preventDefault());

/* ---- Why Nexoré panel ---- */
const F = { box: $('#feat'), open: false };
const featInert = on => { ['#scene', '.space__dock', '.space__top'].forEach(q => { const n = $(q, el.space); if (n) n.inert = on; }); };
function openFeat() {
  if (F.open || W.open) return;
  F.open = true; F.box.hidden = false; featInert(true);
  G.focusHold = true; G.drag = null;
  $('#featClose').focus({ preventScroll: true });
}
function closeFeat() {
  if (!F.open) return;
  F.open = false; F.box.hidden = true; featInert(false);
  G.focusHold = false; G.idleUntil = performance.now() + CONFIG.ring.resumeDelay;
  $('#featBtn').focus({ preventScroll: true });
}
// The button now opens the immersive explainer (js/why.js). If that script is missing, the original panel above still works.
function openWhy() {
  if (F.open || W.open) return;
  if (!window.NexoreWhy) { openFeat(); return; }
  G.focusHold = true; G.drag = null;
  window.NexoreWhy.open({
    from: $('#featBtn'), contactUrl: CONFIG.contactUrl,
    onClose: () => { G.focusHold = false; G.idleUntil = performance.now() + CONFIG.ring.resumeDelay; },
  });
}
$('#featBtn').addEventListener('click', openWhy);
$('#featClose').addEventListener('click', closeFeat);
F.box.addEventListener('pointerdown', e => e.stopPropagation());
F.box.addEventListener('click', e => { if (e.target === F.box) closeFeat(); });
$('#featContact').href = CONFIG.contactUrl;
// the panel scrolls on small screens, so let touch-moves through inside it
sp.addEventListener('touchmove', e => { if (F.open && e.target.closest('.feat__card')) return; e.preventDefault(); }, { passive: false });

/* ==========================================================================
   Contact sheet: Instagram or a ready-written email draft
   ========================================================================== */
const C = { box: $('#contact'), open: false, from: null };
function mailParts() {
  const to = CONFIG.email, su = CONFIG.emailSubject, body = CONFIG.emailBody;
  return {
    mailto: 'mailto:' + to + '?subject=' + encodeURIComponent(su) + '&body=' + encodeURIComponent(body.replace(/\n/g, '\r\n')),
    gmail: 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) + '&su=' + encodeURIComponent(su) + '&body=' + encodeURIComponent(body),
  };
}
(function setupContact() {
  const m = mailParts(), coarse = matchMedia('(pointer:coarse)').matches;
  $('#contactIg').href = CONFIG.contactUrl;
  // phones: mailto opens the Gmail / Mail app with the draft. Computers: open Gmail in the browser with the draft.
  $('#contactMail').href = coarse ? m.mailto : m.gmail;
  $('#contactMail').target = coarse ? '_self' : '_blank';
  $('#contactAlt').href = m.mailto;
  $('#contactAddr').textContent = CONFIG.email;
})();
function openContact(from) {
  if (C.open) return;
  C.open = true; C.from = from || null; C.box.hidden = false;
  C.box.classList.remove('is-in'); void C.box.offsetWidth; C.box.classList.add('is-in');
  G.focusHold = true; G.drag = null;
  ['#scene', '.space__dock', '.space__top', '.nav', '.hero'].forEach(q => { const n = $(q); if (n) n.inert = true; });
  $('#contactIg').focus({ preventScroll: true });
}
function closeContact() {
  if (!C.open) return;
  C.open = false; C.box.hidden = true;
  ['#scene', '.space__dock', '.space__top', '.nav', '.hero'].forEach(q => { const n = $(q); if (n) n.inert = false; });
  G.focusHold = false; G.idleUntil = performance.now() + CONFIG.ring.resumeDelay;
  if (C.from && document.contains(C.from)) C.from.focus({ preventScroll: true });
}
// Every "contact"-type button opens the sheet (plain links still work with JS off)
document.addEventListener('click', e => {
  const b = e.target.closest('#navContact, #spaceContact, #featContact, #whyContact');
  if (!b) return;
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.button > 0) return;
  e.preventDefault(); e.stopPropagation(); openContact(b);
}, true);
$('#contactClose').addEventListener('click', closeContact);
C.box.addEventListener('click', e => { if (e.target === C.box) closeContact(); });
C.box.addEventListener('pointerdown', e => e.stopPropagation());
$('#contactBox').querySelectorAll('a').forEach(a => a.addEventListener('click', () => { setTimeout(closeContact, 150); }));
document.addEventListener('keydown', e => {
  if (!C.open) return;
  if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); closeContact(); }
  else if (e.key === 'Tab') {
    const f = [...C.box.querySelectorAll('a[href],button')].filter(n => !n.hidden); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}, true);

/* ==========================================================================
   Loading screen + pre-loader
   Before a demo opens, every file it needs (scripts, styles, images, fonts, and the big films) is downloaded
   with REAL progress. The films are kept in memory and handed to the demo (window.NXPRE), so inside the
   demo nothing streams, buffers or pops in. The demo itself only starts once it has painted.
   ========================================================================== */
const PRE = { blobs: new Map(), owner: new Map(), done: new Set(), ctl: null };
window.NXPRE = u => PRE.blobs.get(u);          // the demo (same-origin iframe) asks for its film's in-memory copy
const absURL = u => new URL(u, location.href).href;
const isAbort = e => e && e.name === 'AbortError';

/* ---- loading-screen UI ---- */
const LD = { p: 0, raf: 0, timer: 0, idx: 0, list: [], t0: 0, pend: null };
const RING_C = 2 * Math.PI * 52;
function ldPaint() {
  LD.raf = 0; const pct = Math.floor(LD.p * 100);
  $('#svRingFg').style.strokeDashoffset = String(RING_C * (1 - LD.p));
  $('#svPct').textContent = pct + '%';
  $('#svProg').setAttribute('aria-valuenow', String(pct));
}
function ldProgress(p, got, tot) {              // progress never goes backwards (files discovered late would otherwise make it dip)
  LD.p = Math.max(LD.p, Math.min(1, p));
  if (!LD.raf) LD.raf = requestAnimationFrame(ldPaint);
}
const ldStage = t => { $('#svStage').textContent = t; };
function ldShowFact(i) {
  const box = $('#svFact').parentNode, txt = LD.list[i];
  box.classList.add('is-swap');
  setTimeout(() => {
    $('#svFact').textContent = txt;
    [...$('#svDots').children].forEach((d, k) => d.classList.toggle('on', k === i));
    box.classList.remove('is-swap');
  }, reduced ? 0 : 350);
  clearTimeout(LD.timer);
  LD.timer = setTimeout(() => { if (SV.open) { LD.idx = (LD.idx + 1) % LD.list.length; ldShowFact(LD.idx); } }, Math.min(7000, 2800 + txt.length * 45));
}
function ldStart(site) {
  LD.p = 0; LD.t0 = performance.now();
  const mine = (site.facts || []).slice(), gen = CONFIG.facts.slice(), list = [];
  mine.forEach((f, i) => { list.push(f); if (i % 2 === 0 && gen.length) list.push(gen.shift()); });
  LD.list = list.concat(gen);
  const veil = SV.veil;
  veil.style.setProperty('--nxl-a', site.accent || '#8db0ff');
  veil.removeAttribute('aria-hidden');
  $('#svBg').style.backgroundImage = site.image ? `url("${site.image}")` : 'none';
  $('#svTitle').textContent = site.title; $('#svKind').textContent = site.kind;
  ldStage('Getting ready…');
  $('#svDots').innerHTML = LD.list.map(() => '<i></i>').join('');
  $('#svFact').textContent = ''; LD.idx = 0;
  ldPaint(); ldShowFact(0);
}
function ldStop() { clearTimeout(LD.timer); if (LD.raf) { cancelAnimationFrame(LD.raf); LD.raf = 0; } }

/* ---- downloading ---- */
// Reads a response stream with byte counting. keep: 'blob' | 'text' | null (null = just warm the browser cache).
async function pull(url, keep, T, ctl, touch, ms) {
  let sig = ctl.signal, tm = 0;
  if (ms) { const c = new AbortController(); sig = c.signal; ctl.signal.addEventListener('abort', () => c.abort(), { once: true }); tm = setTimeout(() => c.abort(), ms); }
  try { return await pullBody(url, keep, T, sig, touch); } finally { clearTimeout(tm); }
}
async function pullBody(url, keep, T, signal, touch) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const tr = T.get(url) || { got: 0, total: 0 }; T.set(url, tr);
  tr.total = +res.headers.get('Content-Length') || tr.total;
  const type = res.headers.get('Content-Type') || '', chunks = [];
  if (!res.body || !res.body.getReader) {
    const b = await res.blob(); tr.got = tr.total = b.size; touch();
    return keep === 'blob' ? b : keep === 'text' ? b.text() : null;
  }
  const rd = res.body.getReader();
  for (;;) {
    const r = await rd.read(); if (r.done) break;
    tr.got += r.value.length; touch();
    if (keep) chunks.push(r.value);
  }
  tr.total = tr.got; touch();
  if (keep === 'blob') return new Blob(chunks, { type });
  if (keep === 'text') return new Blob(chunks).text();
  return null;
}
const CODE_OR_ASSET = /\.(?:m?js|css|png|jpe?g|webp|avif|gif|svg|woff2?|ttf|glb|gltf|json|ico)$/i;
function refsIn(text, base, isHtml) {
  const out = new Set();
  const add = r => {
    if (!r || /^(?:data|blob|javascript|mailto|tel):/i.test(r)) return;
    try {
      const a = new URL(r.replace(/&amp;/g, '&'), base); a.hash = '';
      if (a.hostname === 'fonts.googleapis.com' && /\/css/.test(a.pathname)) out.add(a.href);
      else if (a.origin === location.origin && CODE_OR_ASSET.test(a.pathname)) out.add(a.href);
    } catch (_) {}
  };
  if (isHtml) {
    for (const m of text.matchAll(/(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi)) add(m[1]);
    for (const m of text.matchAll(/url\(\s*["']?([^"')\s]+)/gi)) add(m[1]);
  } else {                                      // scripts (chunks they import) and stylesheets (images, fonts)
    for (const m of text.matchAll(/["'`](\.{1,2}\/[\w@%./-]+\.(?:m?js|css|png|jpe?g|webp|svg|woff2?|glb|gltf))["'`]/g)) add(m[1]);
    for (const m of text.matchAll(/url\(\s*["']?([^"')\s]+)/gi)) add(m[1]);
  }
  return [...out];
}
// Follows a page's own files (and the chunks / fonts / images those reference) so the list never goes stale after a rebuild.
async function crawl(pageUrl, T, ctl, touch) {
  const seen = new Set();
  const warnFonts = async u => {                // Google Fonts: the css names many language subsets: keep just the latin one
    const css = await pull(u, 'text', T, ctl, touch, 6000);
    const blocks = css.split('/*').filter(b => /^\s*latin\s*\*\//.test(b));
    const urls = [...(blocks.length ? blocks.join('') : css).matchAll(/url\(([^)]+)\)/g)].map(m => m[1].replace(/["']/g, '')).slice(0, 8);
    await Promise.all(urls.map(f => pull(f, null, T, ctl, touch, 6000).catch(() => { if (ctl.signal.aborted) throw new DOMException('closed', 'AbortError'); })));
  };
  const visit = async (u, depth) => {
    if (seen.has(u)) return; seen.add(u);
    try {
      if (new URL(u).hostname === 'fonts.googleapis.com') return await warnFonts(u);
      const ext = (new URL(u).pathname.match(/\.(\w+)$/) || [])[1] || '';
      const isHtml = depth === 0, isCode = /^(?:m?js|css)$/i.test(ext);
      if ((isHtml || isCode) && depth < 4) {
        const txt = await pull(u, 'text', T, ctl, touch);
        await Promise.all(refsIn(txt, u, isHtml).map(r => visit(r, depth + 1)));
      } else await pull(u, null, T, ctl, touch);
    } catch (e) { if (ctl.signal.aborted) throw e; if (depth === 0 && new URL(u).origin === location.origin) throw e; /* a file that can't be found (or slow fonts) is skipped; the demo still loads */ }
  };
  await visit(pageUrl, 0);
}
// One shared download per demo: it can start in the background (warm-up) and the loading screen simply attaches to it.
const WARM = new Map();   // site url → { T, ctl, promise, listeners, spec, filmsLeft, last, done }
function releaseOthers(key) {
  for (const [u, k] of [...PRE.owner]) if (k !== key) { URL.revokeObjectURL(PRE.blobs.get(u)); PRE.blobs.delete(u); PRE.owner.delete(u); PRE.done.delete(k); }
  for (const [k, E] of [...WARM]) if (k !== key) { try { E.ctl.abort(); } catch (_) {} WARM.delete(k); PRE.done.delete(k); }
}
function startFetch(site) {
  const key = site.url;
  const old = WARM.get(key); if (old) return old;
  releaseOthers(key);                                    // memory: only the films of the demo being fetched stay in memory
  const spec = (site.preload && site.preload()) || {};
  const E = { key, spec, T: new Map(), ctl: new AbortController(), listeners: new Set(), last: performance.now(), filmsLeft: (spec.blobs || []).length, done: false };
  WARM.set(key, E);
  const touch = () => { E.last = performance.now(); E.listeners.forEach(f => f()); };
  const jobs = [];
  for (const b of spec.blobs || []) {
    const abs = absURL(b.src); E.T.set(abs, { got: 0, total: b.bytes || 0 });
    jobs.push(pull(abs, 'blob', E.T, E.ctl, touch).then(blob => { PRE.blobs.set(abs, URL.createObjectURL(blob)); PRE.owner.set(abs, key); E.filmsLeft--; touch(); }));
  }
  jobs.push(crawl(absURL(site.url), E.T, E.ctl, touch));
  for (const x of spec.extra || []) { const u = absURL(x); jobs.push(pull(u, null, E.T, E.ctl, touch, new URL(u).origin === location.origin ? 0 : 8000).catch(e => { if (E.ctl.signal.aborted) throw e; })); }
  let wd;
  const stall = new Promise((_, rej) => { wd = setInterval(() => { if (performance.now() - E.last > 25000) rej(new Error('stalled')); }, 1000); });
  E.promise = Promise.race([Promise.all(jobs), stall]).then(() => { E.done = true; PRE.done.add(key); }).finally(() => clearInterval(wd));
  E.promise.catch(() => { if (WARM.get(key) === E) WARM.delete(key); });   // a failed / aborted fetch can be retried
  return E;
}
async function preloadSite(site, ctl) {
  const key = site.url;
  if (PRE.done.has(key)) { ldProgress(0.9, 1, 1); return true; }   // fetched before (or warmed in the background): everything is in memory / cache
  const E = startFetch(site), floor = E.spec.hint || 1;
  const ui = () => {
    let got = 0, tot = 0; E.T.forEach(t => { got += t.got; tot += Math.max(t.total, t.got); });
    tot = Math.max(tot, floor);
    ldProgress((got / tot) * 0.9, got, tot);
    ldStage(E.filmsLeft ? 'Downloading ' + (E.spec.label || 'the demo') + '…' : 'Loading scripts, fonts & images…');
  };
  E.listeners.add(ui); ui();
  let onAbort;
  try {
    await new Promise((res, rej) => {
      onAbort = () => rej(new DOMException('closed', 'AbortError'));
      if (ctl.signal.aborted) return onAbort();
      ctl.signal.addEventListener('abort', onAbort, { once: true });
      E.promise.then(res, rej);
    });
  } finally { E.listeners.delete(ui); ctl.signal.removeEventListener('abort', onAbort); }
  ldProgress(0.9, 1, 1);
  return true;
}
// Warm-up: when the visitor rests on a site in the ring for a moment, start fetching it quietly (never on Save-Data / 2G / mobile data)
let warmT = 0;
function maybeWarm(i) {
  clearTimeout(warmT);
  if (!CONFIG.prefetchDemos || reduced) return;
  const c = navigator.connection;
  if (c && (c.saveData || c.type === 'cellular' || /(^|-)2g$/.test(c.effectiveType || ''))) return;
  warmT = setTimeout(() => { if (state.open && !SV.open && !document.hidden) { try { startFetch(CONFIG.sites[i]); } catch (_) {} } }, 2200);
}

/* ---- boot: the demo loads from the warm cache, then we wait until it has really painted ---- */
function frameReady(f, sinceLoad) {
  const d = f.contentDocument; if (!d || !f.contentWindow) return true;
  if (d.readyState !== 'complete') return false;
  if ([...d.images].some(i => !i.complete)) return false;
  const own = d.getElementById('load'); if (own && !own.dataset.gone) return false;                                   // Véyra's own intro loader
  const iv = d.getElementById('initial-loader'); if (iv && iv.style.display !== 'none' && !iv.classList.contains('fade-out')) return false;   // Vanta's
  if (sinceLoad < 4000) {                                                                                           // soft checks: never hold the visitor for long (slow Google Fonts, iOS never buffers a paused video)
    if (d.fonts && d.fonts.status === 'loading') return false;
    if ([...d.querySelectorAll('video')].some(v => (v.currentSrc || v.src) && v.readyState < 2 && !v.error)) return false;
  }
  return true;
}
function bootFrame(f, url, dead) {
  return new Promise(resolve => {
    let done = false, tLoad = 0;
    const fin = () => { if (!done) { done = true; resolve(); } };
    const t0 = performance.now();
    const tick = () => {
      if (done) return;
      if (dead()) return fin();
      const since = performance.now() - tLoad;
      let ok; try { ok = frameReady(f, since); } catch (_) { ok = true; }
      ldProgress(0.9 + 0.09 * (1 - Math.exp(-(performance.now() - t0) / 1800)), 1, 1);
      if (ok || since > 12000) {                // two painted frames + a beat, so the first thing the visitor sees is already smooth
        const w = f.contentWindow;
        try { w.requestAnimationFrame(() => w.requestAnimationFrame(() => setTimeout(fin, 80))); } catch (_) { setTimeout(fin, 80); }
        return;
      }
      setTimeout(tick, 60);
    };
    f.onload = () => {
      tLoad = performance.now();
      try { f.contentDocument.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; }); } catch (_) {}   // lazy images load now, not mid-scroll
      tick();
    };
    f.src = url;
    setTimeout(fin, 60000);                     // absolute safety net
  });
}

/* ==========================================================================
   Circular reveal: a tapped card opens its site in a full-screen layer that grows from the tap point
   ========================================================================== */
const SV = { box: $('#siteView'), frame: null, slot: $('#svSlot'), veil: $('#svVeil'), ring: $('#svRing'), back: $('#svBack'),
             open: false, x: 0, y: 0, R: 0, anim: [], run: 0, from: null, pushed: false, busy: false };
function svRadius(x, y) {
  // use the largest of every size the browser reports (mobile URL bars, zoom, scrollbars) so the circle always out-grows the real screen
  const vv = window.visualViewport, de = document.documentElement;
  const w = Math.max(innerWidth, de.clientWidth, vv ? vv.width : 0, SV.box ? SV.box.offsetWidth : 0);
  const h = Math.max(innerHeight, de.clientHeight, vv ? vv.height : 0, SV.box ? SV.box.offsetHeight : 0);
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) * 1.08 + 24;
}
function svPlay(dir, done) {
  const { x, y, R } = SV, rm = reduced;
  SV.anim.forEach(a => a.cancel()); SV.anim = [];
  const dur = rm ? 1 : (dir > 0 ? 1050 : 800), easing = dir > 0 ? 'cubic-bezier(.65,.02,.18,1)' : 'cubic-bezier(.5,0,.2,1)';
  const from = dir > 0 ? `circle(0px at ${x}px ${y}px)` : `circle(${R}px at ${x}px ${y}px)`;
  const to   = dir > 0 ? `circle(${R}px at ${x}px ${y}px)` : `circle(0px at ${x}px ${y}px)`;
  const a1 = SV.box.animate({ clipPath: [from, to] }, { duration: dur, easing, fill: 'forwards' });
  Object.assign(SV.ring.style, { left: x + 'px', top: y + 'px', width: (2 * R) + 'px', height: (2 * R) + 'px', margin: (-R) + 'px 0 0 ' + (-R) + 'px' });
  SV.ring.hidden = false;
  const s0 = dir > 0 ? 0 : 1, s1 = dir > 0 ? 1 : 0;
  const a2 = SV.ring.animate([
    { transform: `scale(${s0})`, opacity: dir > 0 ? 1 : 0.9 },
    { transform: `scale(${s1})`, opacity: dir > 0 ? 0.0 : 0 }], { duration: dur, easing, fill: 'forwards' });
  SV.anim = [a1, a2];
  a1.onfinish = () => {
    SV.ring.hidden = true;
    // fully open: drop the circle completely, so rotating the phone / resizing the window can never leave a corner uncovered
    if (dir > 0) { try { a1.cancel(); } catch (_) {} SV.box.style.clipPath = 'none'; }
    done && done();
  };
}
function openSite(site, x, y, from) {
  if (SV.open || SV.busy) return;
  SV.busy = true; SV.open = true; SV.from = from || null;
  const run = ++SV.run, dead = () => run !== SV.run || !SV.open;
  SV.x = Math.round(x); SV.y = Math.round(y); SV.R = svRadius(x, y);
  SV.veil.style.backgroundImage = 'none';
  SV.veil.classList.remove('is-gone'); SV.box.classList.remove('is-ready');
  SV.box.style.clipPath = `circle(0px at ${SV.x}px ${SV.y}px)`;
  SV.box.classList.remove('is-closing'); SV.box.hidden = false; SV.back.disabled = true;
  SV.R = svRadius(x, y);                          // measured again now that the layer is on screen
  G.focusHold = true; G.drag = null;
  el.space.inert = true;
  SV.h0 = history.length;
  try { history.pushState({ nx: 1 }, ''); SV.pushed = true; } catch (_) { SV.pushed = false; }
  ldStart(site);                                  // loading screen: progress ring, facts, the site's colour
  // a brand-new iframe every time (its first load replaces, not adds, a history entry)
  const f = document.createElement('iframe');
  f.className = 'siteview__frame'; f.title = site.title + ' demo website'; f.allow = 'autoplay; fullscreen'; f.referrerPolicy = 'no-referrer';
  stopRing();                                     // the ring sits still behind the growing circle anyway: give the animation the whole frame budget
  SV.slot.appendChild(f); SV.frame = f;
  PRE.ctl = new AbortController();
  // 1) while the circle grows, every file of the demo downloads (network work only, so the circle stays smooth)
  const grown = new Promise(res => svPlay(1, () => {
    SV.busy = false; SV.back.disabled = false; SV.back.focus({ preventScroll: true });
    stopRing();                                   // free the CPU/GPU for the demo
    res();
  }));
  const files = preloadSite(site, PRE.ctl).catch(err => { if (!isAbort(err)) console.warn('Preload fell back to normal loading:', err && err.message); return false; });
  // 2) only when the circle has covered the screen AND everything is downloaded does the demo start (heavy demos used to freeze the circle)
  Promise.all([grown, files]).then(async () => {
    if (dead()) return;
    ldStage('Starting ' + site.title + '…');
    await bootFrame(f, site.url, dead);
    if (dead()) return;
    ldProgress(1, 1, 1); ldStage('Ready');
    await new Promise(r => setTimeout(r, Math.max(250, 600 - (performance.now() - LD.t0))));   // show 100% and give the first fact a moment
    if (dead()) return;
    SV.box.classList.add('is-ready'); SV.veil.setAttribute('aria-hidden', 'true');
    setTimeout(() => { SV.veil.classList.add('is-gone'); ldStop(); }, 60);
  });
}
function closeSiteNow() {
  if (!SV.open || SV.busy) return;
  SV.busy = true; SV.open = false;
  ldStop(); try { if (PRE.ctl) PRE.ctl.abort(); } catch (_) {}   // closing mid-download stops it
  // cheap, smooth closing: the live site (a heavy video canvas) is swapped for its still preview instantly, so the shrinking circle never competes with it
  SV.box.classList.add('is-closing');
  SV.veil.style.transition = 'none'; SV.veil.classList.remove('is-gone'); void SV.veil.offsetWidth; SV.veil.style.transition = '';
  SV.box.classList.remove('is-ready');
  try { if (SV.frame) SV.frame.style.display = 'none'; } catch (_) {}
  SV.back.disabled = true;
  SV.R = svRadius(SV.x, SV.y);                    // the screen may have been rotated since it opened
  startRing();
  svPlay(-1, () => {
    SV.box.hidden = true; SV.box.style.clipPath = ''; SV.busy = false;
    // removing the iframe also drops every history entry the site created inside it
    try { if (SV.frame) { SV.frame.onload = null; SV.frame.remove(); SV.frame = null; } } catch (_) {}
    // now the only thing left on top of the history is our own marker entry: pop it silently
    // (sites add their own entries while they run, so step back over ALL of the entries added since we opened)
    if (SV.pushed) {
      SV.pushed = false;
      const n = history.length - SV.h0;
      if (n > 0) { SV.quiet = true; setTimeout(() => { SV.quiet = false; }, 800); try { history.go(-n); } catch (_) { SV.quiet = false; } }
    }
    el.space.inert = false;
    G.focusHold = false; G.idleUntil = performance.now() + CONFIG.ring.resumeDelay;
    if (SV.from && document.contains(SV.from)) SV.from.focus({ preventScroll: true });
  });
}
function closeSite() { closeSiteNow(); }   // the Back button never touches history while the site is on screen (that is what caused the white screen)
addEventListener('popstate', () => {
  if (SV.quiet) { SV.quiet = false; return; }                         // our own clean-up step
  if (SV.open && !SV.busy) { SV.pushed = false; closeSiteNow(); }      // phone back gesture / browser back
});
SV.back.addEventListener('click', closeSite);
document.addEventListener('keydown', e => { if (SV.open && e.key === 'Escape' && !C.open) { e.preventDefault(); closeSite(); } });
addEventListener('resize', () => { if (SV.open) SV.R = svRadius(SV.x, SV.y); });

/* ---- keyboard ---- */
document.addEventListener('keydown', e => {
  if (!state.open || SV.open || C.open) return;
  if (F.open) { if (e.key === 'Escape') { e.preventDefault(); closeFeat(); } return; }
  if (W.open) { if (e.key === 'Escape') { e.preventDefault(); closeWarn(); } return; }
  if (e.key === 'Escape') { e.preventDefault(); closeGallery(); }
  else if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
});


/* ---- button fill: remember where the pointer touched, and finish the fill on touch screens ---- */
(function fillButtons() {
  const SEL = '.btn, .dock__btn, .contact__opt, .why-btn';
  const place = (b, e) => { const r = b.getBoundingClientRect(); b.style.setProperty('--fx', (e.clientX - r.left) + 'px'); b.style.setProperty('--fy', (e.clientY - r.top) + 'px'); };
  document.addEventListener('pointerover', e => { const b = e.target.closest && e.target.closest(SEL); if (b && !b.contains(e.relatedTarget)) place(b, e); }, true);
  document.addEventListener('pointerdown', e => {
    const b = e.target.closest && e.target.closest(SEL); if (!b || b.disabled) return;
    place(b, e);
    if (e.pointerType === 'mouse') return;                      // computers fill on hover instead
    clearTimeout(b._fx); b.classList.add('is-filled');
    const off = () => { clearTimeout(b._fx); b._fx = setTimeout(() => b.classList.remove('is-filled'), 650); };
    b.addEventListener('pointerup', off, { once: true }); b.addEventListener('pointercancel', off, { once: true });
    b._fx = setTimeout(() => b.classList.remove('is-filled'), 2500);   // safety
  }, true);
})();

/* ==========================================================================
   Film swap: rotate a phone / resize a window across the 6:5 line and the other film takes over
   ========================================================================== */
function swapFilm() {
  const next = mqDesk.matches ? FILMS.desktop : FILMS.mobile;
  if (next === V) return;
  const wasFinished = H.finished;             // someone already at the end stays at the end (button live) on the new film
  clearTimeout(H.startT); H.boot++;           // invalidates any download / boot still in flight
  if (H.raf) { cancelAnimationFrame(H.raf); H.raf = 0; }
  try { el.video.pause(); } catch (_) {}
  el.video.classList.remove('is-ready');
  el.video.removeAttribute('src'); el.video.load();
  if (H.blobUrl) { URL.revokeObjectURL(H.blobUrl); H.blobUrl = null; }
  V = next;
  applyFilmLayout();
  Object.assign(H, {
    cur: wasFinished ? 1 : 0, ready: false, still: false, playing: false, finished: wasFinished, mode: 'play',
    clock: 0, lastN: -1, pending: null, frames: V.fps * V.duration, duration: V.duration,
    loaded: false, capK: [], scrimV: -1,
  });
  el.endImg.style.opacity = wasFinished ? '1' : '0';
  setLoad(0);
  updateUI();
  bootFilm();
}
mqDesk.addEventListener ? mqDesk.addEventListener('change', swapFilm) : mqDesk.addListener(swapFilm);

/* ==========================================================================
   Boot
   ========================================================================== */
buildCards();
buildDots();
paintSite(0);
addEventListener('resize', () => { drawAmbient(true); }, { passive: true });
mqReduce.addEventListener && mqReduce.addEventListener('change', e => {
  reduced = e.matches; root.classList.toggle('rm', reduced);
  if (reduced) { if (H.ready) jumpToEnd(); else stillMode(); }
  updateUI();
});
// scrolling card previews: fetched after the intro film is rolling (never competes with it), or when the gallery opens
function loadStrips() {
  PV.load();
  $$('.site__strip[data-src]').forEach(im => {
    const src = im.dataset.src; im.removeAttribute('data-src');
    im.addEventListener('load', () => im.classList.add('is-on'), { once: true });
    im.src = src;
  });
}
// aurora behind the details panel: loaded only AFTER the intro film is rolling (so it never competes with it for bandwidth);
// still poster for reduced motion / Save-Data
const aurora = (() => {
  const v = document.getElementById('auroraVid'); if (!v) return { load() {} };
  const c = navigator.connection;
  const off = () => reduced || (c && c.saveData);
  const stop = () => { try { v.pause(); } catch (e) {} };
  const load = () => {
    if (off()) return;
    if (!v.getAttribute('src') && v.dataset.src) { v.preload = 'auto'; v.src = v.dataset.src; v.load(); }
    if (state.open || v.getAttribute('src')) v.play().catch(() => {});
  };
  mqReduce.addEventListener && mqReduce.addEventListener('change', e => { if (e.matches) stop(); else load(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else load(); });
  return { load, stop };
})();
// start fetching it shortly after the film has begun (or right away if the film could not load)
(function lateAurora() {
  const go = () => setTimeout(() => { aurora.load(); loadStrips(); }, 600);
  const t = setInterval(() => { if (H.loaded) { clearInterval(t); go(); } }, 250);
  setTimeout(() => { clearInterval(t); aurora.load(); loadStrips(); }, 9000);
})();

updateUI();
bootFilm();

})();
