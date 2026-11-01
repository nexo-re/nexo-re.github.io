/* ==========================================================================
   WHY NEXORÉ — immersive explainer (opens from the gallery's "Why Nexoré" button)
   Self-contained: builds its own DOM on first open, touches nothing else.
   Public API: window.NexoreWhy.open({ from, contactUrl, onClose }) / .close() / .isOpen

   Story: one sample shop ("Ember & Co.", invented for illustration) is shown
   with six common problems. Each problem is then rebuilt in front of the
   visitor — drag the slider (or let it play) and the problem physically
   transforms into the fix. The finale flips all six at once.
   ========================================================================== */
(() => {
'use strict';
if (window.NexoreWhy) return;

const $ = (s, r = document) => r.querySelector(s);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mqRm = matchMedia('(prefers-reduced-motion: reduce)');
const isRM = () => mqRm.matches || document.documentElement.classList.contains('rm');

/* ---------- tiny markup helpers ---------- */
const V = o => Object.keys(o || {}).map(k => `--${k}:${o[k]}`).join(';');
const E = (cls, v, inner = '', tag = 'div') => `<${tag} class="${cls}" style="${V(v)}">${inner}</${tag}>`;
const JAR = '<div class="jar"><i class="jb"></i><i class="jl"></i><i class="jk"></i><i class="jf fl"></i></div>';
const jar = (cls, v, col) => E('p ' + cls, Object.assign({ jc: col || '#8a5a3a' }, v), JAR);
const CUR = v => E('cur loop', v, '<svg viewBox="0 0 12 17" aria-hidden="true"><path d="M1 1v13l3.4-3.2 2.4 5.2 2.2-1-2.4-5.1h4.8z"/></svg>');
const win = (url, inner, dk) => `<div class="win"><div class="bar"><i></i><i></i><i></i><span class="url fs" style="--fs:1.9">${url}</span></div><div class="pg${dk ? ' dk' : ''}">${inner}</div></div>`;
const URL_ = 'embercandles.example';
const COLS = ['#8a5a3a', '#c58b4a', '#7b5b6e', '#4a4a52', '#a9b4a3', '#b9707a', '#6d8c96', '#5b4636', '#6f9a7a'];

/* ==========================================================================
   Scenes. t = 0 → the problem, t = 1 → the fix.
   ========================================================================== */
function s1() {                                    /* brand presence */
  const old = E('a mv', { o0: 1, o1: 0, d: 0 }, [
    E('pt fs serif', { l: 4, tp: 3, fs: 2 }, '<span class="lnk">Home</span><span class="lnk">Products</span><span class="lnk">About us</span><span class="lnk">Contact</span>'),
    E('pt fs serif', { l: 4, tp: 10, fs: 4.4 }, '<span style="color:#1c1c1c">Welcome to<br>our website</span>'),
    E('p greyb', { l: 4, tp: 26, w: 36, h: 1.4 }), E('p greyb', { l: 4, tp: 29, w: 32, h: 1.4 }), E('p greyb', { l: 4, tp: 32, w: 34, h: 1.4 }),
    E('pt fs serif', { l: 4, tp: 37, fs: 2 }, '<span class="lnk">Click here to view products</span>'),
    E('p greyb', { l: 52, tp: 12, w: 34, h: 26 }),
    E('pt fs serif', { l: 4, tp: 53, fs: 1.7 }, '<span style="color:#8a93a3">© 2019 Ember &amp; Co. All rights reserved.</span>'),
  ].join(''));
  const nu = E('a mv', { o0: 0, o1: 1, d: .15 }, [
    E('pt fs dim', { l: 5, tp: 3, fs: 2 }, '<span style="letter-spacing:.2em">EMBER &amp; CO.</span>'),
    E('pt fs dim', { l: 58, tp: 3, fs: 2 }, 'Shop &nbsp;&nbsp; Story &nbsp;&nbsp; Contact'),
  ].join(''));
  const body = [
    E('a bgn mv', { o0: 0, o1: 1, d: 0 }),
    old,
    E('p glow mv s1g', { l: 42, tp: -6, w: 52, h: 52, o0: 0, o1: 1, s0: .4, s1: 1, d: .2 }),
    nu,
    E('pt fs d mv', { l: 5, tp: 11, fs: 7.6, o0: 0, o1: 1, x0: -4, d: .3 }, '<span style="color:var(--w-cream)">Light the<br>evening.</span>'),
    E('pt fs dim mv', { l: 5, tp: 33, fs: 2.6, o0: 0, o1: 1, y0: 3, d: .45 }, 'Small-batch candles,<br>poured by hand.'),
    E('p btn-a fs mv', { l: 5, tp: 43, w: 20, h: 7, fs: 2.6, o0: 0, o1: 1, y0: 3, d: .55 }, 'Shop scents'),
    jar('jarx mv', { l: 58, tp: 9, w: 26, h: 34.7, x0: -2, y0: -.3, s0: .46, s1: 1, d: .1 }, '#8a5a3a'),
  ].join('');
  return win(URL_, body) + CUR({ ax: 104, ay: 46, bx: 72, by: 36, cx: 68, cy: 30, dx: 10, dy: 1 });
}

function s2() {                                    /* product discovery */
  const names = ['Cedar', 'Amber', 'Fig', 'Smoke', 'Linen', 'Rose', 'Salt', 'Oud', 'Mint'];
  const fam = ['Woody', 'Warm', 'Fruity', 'Smoky', 'Fresh', 'Floral', 'Marine', 'Resin', 'Herbal'];
  let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  let cards = '';
  for (let i = 0; i < 9; i++) {
    const c = i % 3, r = (i / 3) | 0, hi = i === 4;
    const inner = jar('', { l: 2.4, tp: 1.9, w: 8, h: 10.67 }, COLS[i]) +
      E('p lab mv', { l: 0, tp: 0, w: 26.7, h: 14.7, o0: 0, o1: 1, d: .5 },
        E('pt fs b', { l: 12, tp: 3.2, fs: 2.9 }, names[i]) + E('pt fs dim', { l: 12, tp: 7, fs: 2.1 }, fam[i]) +
        (hi ? E('p btn-a fs', { l: 12, tp: 9.8, w: 11, h: 3.8, fs: 2 }, 'Enquire') : ''));
    cards += E('p mv card' + (hi ? ' hi' : ''), {
      l: 3 + c * 28.67, tp: 10 + r * 16.67, w: 26.67, h: 14.67,
      x0: ((rnd() - .5) * 64).toFixed(1), y0: ((rnd() - .5) * 38).toFixed(1), r0: ((rnd() - .5) * 44).toFixed(0), s0: (.85 + rnd() * .5).toFixed(2), d: (i * .03).toFixed(2),
    }, inner);
  }
  const body = E('a bgn mv', { o0: 0, o1: 1 }) +
    E('p mv', { l: 3, tp: 2.2, w: 60, h: 5, y0: -4, o0: 0, o1: 1, d: .25 }, '<div class="chips"><span class="chip on">All</span><span class="chip">Woody</span><span class="chip">Floral</span><span class="chip">Fresh</span></div>') + cards;
  return win(URL_, body) + CUR({ ax: 100, ay: 66, bx: 62, by: 38, cx: 34, cy: 48, dx: 14, dy: 72 });
}

function s3() {                                    /* questions in the DMs */
  const Q = [['Price?', 'Price', 'From $28', 57], ['In stock?', 'Availability', 'In stock', 51], ['Delivery to my area?', 'Delivery', 'Check your area', 28], ['Which sizes?', 'Sizes', '8 oz · 12 oz', 44], ['How do I order?', 'Order', '', 35]];
  const rows = Q.map((q, i) => E('p mv bub loop', { i, l: 34, tp: 12 + i * 9.6, w: 53, h: 8, cr: q[3], x0: i % 2 ? 3 : 0, y0: (6 - i * 2.6).toFixed(1), s0: .94, d: i * .05 },
    `<span class="q fs" style="--fs:2.6">${q[0]}</span><span class="al fs" style="--fs:2.4">${q[1]}</span>` +
    (q[2] ? `<span class="av fs" style="--fs:2.6">${q[2]}</span>` : '<span class="btn-a">Enquire</span>'))).join('');
  const body = [
    E('p', { l: 3, tp: 4, w: 27, h: 52, }, '<div class="a" style="background:var(--w-card);border-radius:calc(var(--u)*1.4)"></div>'),
    jar('', { l: 6.5, tp: 14, w: 20, h: 26.67 }, '#8a5a3a'),
    E('pt fs d', { l: 34, tp: 3.6, fs: 3.8 }, 'Cedar · 12 oz'),
    E('pt fs dim', { l: 34, tp: 8.2, fs: 2.1 }, 'Hand-poured candle'),
    E('p mv', { l: 66, tp: 3.2, w: 21, h: 4, o0: 1, o1: 0, d: 0 }, '<div style="display:flex;align-items:center;justify-content:flex-end;gap:calc(var(--u)*1.2);font-size:calc(var(--u)*2)" class="dim">Inbox <span class="badge"><span class="strip loop"><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i><i>9+</i></span></span></div>'),
    rows,
  ].join('');
  return win(URL_, body, true);
}

function s4() {                                    /* enquiry / ordering */
  const F = ['First name', 'Last name', 'Email', 'Phone', 'Address line 1', 'Address line 2', 'City / PIN', 'Message'];
  let f = '';
  F.forEach((n, i) => {
    const keep = i < 2, top1 = i === 0 ? 12 : 22, top0 = 9 + i * 5.6;
    const v = keep
      ? { h0: 4.4, h1: 8, l: 0, tp: top1, y0: (top0 - top1).toFixed(1), d: 0 }
      : { h0: 4.4, h1: 4.4, tp: top0, y1: -3, s1: .96, o0: 1, o1: 0, d: (i * .03).toFixed(2) };
    f += E('fld mv', v, `<span class="fs" style="--fs:1.8">${keep ? ['Name', 'Area / pincode'][i] : n}</span>` + (i === 5 ? '<em>Required</em>' : ''));
  });
  const body = [
    E('p panel', { l: 19, tp: 2.5, w: 52, h: 50 }),
    E('pt fs b', { l: 22, tp: 4.4, fs: 2.4 }, '<span class="mv" style="--o0:1;--o1:0;display:inline-block;opacity:calc(1 - var(--t) * 3)">Contact us</span>'),
    E('pt fs b', { l: 22, tp: 4.4, fs: 2.4 }, '<span style="display:inline-block;opacity:calc(var(--t) * 3 - 1.6);color:var(--w-cream)">Cedar · 12 oz</span>'),
    f,
    E('p mv go btn-a fs', { tp: 33, fs: 3, y0: 21, d: 0, l: 22, w: 46, h: 8 }, '<span style="opacity:calc(1 - var(--te) * 3)">Submit</span><span style="opacity:calc(var(--te) * 3 - 1.4)">Send enquiry</span>'),
    E('p mv', { l: 22, tp: 44, w: 46, h: 7, o0: 0, o1: 1, y0: 4, d: .6 }, '<div class="a" style="background:var(--w-card);border-radius:calc(var(--u)*1.4)"></div><span class="pt fs dim" style="--l:1.8;--tp:1.4;--fs:1.9;line-height:1.3">Hi! I’d like the Cedar candle, 12 oz.<br>Sent in the chat you already use.</span>'),
  ].join('');
  return win(URL_, body, true) + CUR({ ax: 24, ay: 20, bx: 44, by: 40, cx: 52, cy: 62, dx: 56, dy: 70 });
}

function s5() {                                    /* mobile */
  const oldC = (() => {
    let h = E('pt fs', { l: 3, tp: 3, fs: 1.5 }, '<span class="lnk">Home</span><span class="lnk">Shop</span><span class="lnk">About</span><span class="lnk">Journal</span><span class="lnk">Contact</span><span class="lnk">Cart</span>');
    h += E('p greyb', { l: 3, tp: 8, w: 90, h: 11 });
    for (let k = 0; k < 3; k++) {
      const x = 3 + k * 31;
      h += E('p greyb', { l: x, tp: 23, w: 20, h: 1.8 }) + E('p greyb', { l: x, tp: 27.5, w: 27, h: 1.2 }) + E('p greyb', { l: x, tp: 30, w: 25, h: 1.2 }) + E('p greyb', { l: x, tp: 32.5, w: 26, h: 1.2 });
      h += E('p tiny', { l: x, tp: 37, w: 7, h: 3.2 }, 'Buy');
    }
    return h + E('p greyb', { l: 3, tp: 46, w: 90, h: 1.2 });
  })();
  const scr = [
    E('a bgn mv', { o0: 0, o1: 1 }),
    E('a mv', { o0: 1, o1: 0 }, `<div class="wob loop">${oldC}</div>`),
    E('p sbar loop mv', { l: 3, tp: 61, w: 16, h: 1.2, o0: 1, o1: 0 }),
    E('pt fs mv', { l: 3.5, tp: 3.2, fs: 2.2, o0: 0, o1: 1, d: .2 }, '<span class="dim" style="letter-spacing:.18em">EMBER &amp; CO.</span>'),
    E('p mv', { l: 34, tp: 3.4, w: 4.4, h: 3, o0: 0, o1: 1, d: .2 }, '<i style="position:absolute;left:0;right:0;top:0;height:calc(var(--u)*.5);background:var(--w-cream);border-radius:9px"></i><i style="position:absolute;left:0;right:0;top:calc(var(--u)*1.2);height:calc(var(--u)*.5);background:var(--w-cream);border-radius:9px"></i><i style="position:absolute;left:0;right:0;top:calc(var(--u)*2.4);height:calc(var(--u)*.5);background:var(--w-cream);border-radius:9px"></i>'),
    E('pt fs d mv', { l: 3.5, tp: 11, fs: 5.4, o0: 0, o1: 1, y0: 6, d: .3 }, '<span style="color:var(--w-cream)">Light the<br>evening.</span>'),
    E('p mv', { l: 3.5, tp: 24, w: 34, h: 25, o0: 0, o1: 1, y0: 7, d: .42 }, '<div class="a" style="background:var(--w-card);border-radius:calc(var(--u)*2)"></div>' + jar('', { l: 10.5, tp: 3, w: 13, h: 17.3 }, '#c58b4a')),
    E('p btn-a fs mv', { l: 3.5, tp: 53, w: 34, h: 8, fs: 3, o0: 0, o1: 1, y0: 7, d: .55 }, 'Enquire'),
  ].join('');
  return `<div class="p phone" style="--l:28;--tp:3.5;--w:44;--h:68"><div class="scr">${scr}</div></div>` +
    E('p pinch loop mv', { l: 81, tp: 32, w: 10, h: 10, o0: 1, o1: 0 }, '<i></i><i></i>');
}

function s6() {                                    /* search + custom feature */
  const body = [
    E('p res', { l: 3, tp: 4, w: 50, h: 30 }),
    E('pt fs', { l: 5.4, tp: 6, fs: 1.9 }, '<span style="color:#5d6573">embercandles.example</span>'),
    E('pt fs b mv', { l: 5.4, tp: 10.5, fs: 3.6, o0: 1, o1: 0, d: 0 }, '<span style="color:#1a4fd6">Home</span>'),
    E('pt fs b mv', { l: 5.4, tp: 10.5, fs: 2.8, o0: 0, o1: 1, d: .2 }, '<span style="color:#1a4fd6">Hand-poured candles in<br>cedar and amber · Ember &amp; Co.</span>'),
    E('pt fs mv', { l: 5.4, tp: 19.5, fs: 2.2, o0: 1, o1: 0, d: 0 }, '<span style="color:#5d6573">Welcome to our website.<br>Click here to enter.</span>'),
    E('pt fs mv', { l: 5.4, tp: 20.5, fs: 2.1, o0: 0, o1: 1, d: .3, y0: 2 }, '<span style="color:#3a3f4a">Small-batch candles. Browse scents, check<br>delivery and enquire in one tap.</span>'),
    E('pt fs dim', { l: 3, tp: 37, fs: 1.9 }, 'Page structure'),
    E('pt fs mv', { l: 3, tp: 42, fs: 2.1, o0: 1, o1: 0, d: 0 }, '<span style="color:var(--w-grey-2)">No headings, no outline.</span>'),
    E('p row mv', { l: 3, tp: 41, w: 50, h: 5.4, o0: 0, o1: 1, y0: 4, d: .35 }, '<b>H1</b>Hand-poured candles'),
    E('p row mv', { l: 3, tp: 47.2, w: 50, h: 5.4, o0: 0, o1: 1, y0: 4, d: .45 }, '<b>H2</b>Scents'),
    E('p row mv', { l: 3, tp: 53.4, w: 50, h: 5.4, o0: 0, o1: 1, y0: 4, d: .55 }, '<b>H2</b>Delivery and enquiries'),
    E('pt fs dim mv', { l: 58, tp: 8, fs: 2.2, o0: 1, o1: 0, d: 0 }, 'Contact us for<br>more information.'),
    E('p tool mv', { l: 56, tp: 4, w: 32, h: 44, o0: 0, o1: 1, x0: 8, d: .4 },
      E('pt fs d', { l: 2.6, tp: 3, fs: 3 }, 'Find your scent') +
      E('p chips', { l: 2.6, tp: 9, w: 28, h: 4 }, '<span class="chip on">Woody</span><span class="chip" style="background:var(--w-card-hi)">Floral</span><span class="chip" style="background:var(--w-card-hi)">Fresh</span>') +
      E('pt fs b', { l: 2.6, tp: 16, fs: 2.2 }, '<span style="color:var(--w-amber)">Cedar · Oud · Smoke</span>') +
      jar('', { l: 2.6, tp: 21, w: 6, h: 8 }, COLS[0]) + jar('', { l: 10.6, tp: 21, w: 6, h: 8 }, COLS[7]) + jar('', { l: 18.6, tp: 21, w: 6, h: 8 }, COLS[3]) +
      E('p field fs', { l: 2.6, tp: 33, w: 24.8, h: 5.4, fs: 1.9 }, 'Enter your area') +
      E('pt fs dim', { l: 2.6, tp: 40, fs: 1.7 }, 'Built only where it helps')),
  ].join('');
  return win(URL_, body, true) + CUR({ ax: 104, ay: 62, bx: 66, by: 32, cx: 30, cy: 26, dx: 4, dy: 12 });
}

const SCENES = [
  { name: 'Brand presence', build: s1, pl: 'Looks nothing like the brand', fl: 'A site that looks like the brand',
    ph: 'The product is premium. The page isn’t.', pb: 'When a website doesn’t reflect the quality of the brand behind it, customers can doubt the product before they read a word.',
    fh: 'A site that looks like the brand.', fb: 'A cinematic, custom-designed website built around your product and your story, never a recycled template.' },
  { name: 'Product discovery', build: s2, pl: 'Hard to find the right product', fl: 'A catalogue that guides',
    ph: 'Where is the thing I wanted?', pb: 'Cluttered, unlabelled listings make people hunt. Some simply leave.',
    fh: 'A catalogue that guides.', fb: 'Clear categories, named products and one obvious next step, so choosing feels easy.' },
  { name: 'Product information', build: s3, pl: 'The same questions, again and again', fl: 'Answers live on the page',
    ph: 'The same five questions, daily.', pb: 'When price, stock, sizes and delivery aren’t on the page, they land in your DMs instead.',
    fh: 'The answers live on the page.', fb: 'Clear product information up front, so customers get what they need without waiting for a reply.' },
  { name: 'Enquiry and ordering', build: s4, pl: 'Enquiring takes too much effort', fl: 'Choose, add details, send',
    ph: 'Too many steps to say “I want it”.', pb: 'Long forms and buried buttons can make an interested customer give up.',
    fh: 'Choose, add details, send.', fb: 'A short, pre-filled enquiry or order flow, through the channel that suits your business: WhatsApp, a form or a DM.' },
  { name: 'Mobile layout', build: s5, pl: 'Falls apart on a phone', fl: 'Designed for the thumb first',
    ph: 'Built for desktop. Used on phones.', pb: 'Tiny text, sideways scrolling and hard-to-tap buttons send mobile visitors away.',
    fh: 'Designed for the thumb first.', fb: 'Responsive layouts with one clear column and thumb-sized buttons that adapt to every screen.' },
  { name: 'Search and custom features', build: s6, pl: 'Easy to overlook online', fl: 'Found, and fitted to the business',
    ph: 'Easy to overlook.', pb: 'A page with a vague title and no structure gives search engines little to work with.',
    fh: 'Found, and fitted to the business.', fb: 'On-page SEO helps search engines understand your pages; it can’t promise a ranking. Custom features are added only where your business needs them.' },
];
const STEPS = SCENES.length + 2;                   /* board, six scenes, finale */
const ARR_L = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4"/></svg>';
const ARR_R = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
const ICO_X = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>';
const ICO_R = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8a5.5 5.5 0 1 0 1.8-4.1M2.5 2.5v3h3"/></svg>';

/* ==========================================================================
   State + DOM
   ========================================================================== */
const S = { open: false, closing: false, step: -1, busy: false, opts: {}, tw: [], raf: 0, auto: 0, fsc: null, fi: -1, wheelT: 0, inert: [], finT: 0, introT: 0 };
let R = null;
let ro = null;

function makeSc(i) {
  const sc = document.createElement('div');
  sc.className = 'sc s' + (i + 1);
  sc.setAttribute('aria-hidden', 'true');
  sc.innerHTML = SCENES[i].build();
  sc._t = 0;
  sc.style.setProperty('--t', '0');
  sc.style.setProperty('--u', '3px');
  (ro || (ro = new ResizeObserver(es => es.forEach(e => e.target.style.setProperty('--u', (e.contentRect.width / 100).toFixed(3) + 'px'))))).observe(sc);
  return sc;
}

function build() {
  if (R) return;
  const root = document.createElement('div');
  root.id = 'why'; root.hidden = true;
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Why Nexoré');
  root.innerHTML = `
    <header class="why-bar">
      <span class="brand brand--static why-brand" aria-hidden="true">NE<b>X</b>ORÉ</span>
      <span class="why-act" id="whyAct"></span>
      <button type="button" class="why-btn why-x" id="whyClose" aria-label="Close and return to the portfolio">${ICO_X}<span>Close</span></button>
    </header>
    <div class="why-main" id="whyMain" data-kind="board">
      <div class="why-copy" id="whyCopy" data-show="board" aria-live="polite">
        <div class="cp cp--board"><h2 class="why-h">Good businesses lose customers here.</h2>
          <p class="why-p">Six common problems a website can have. Not every business faces all of them, but you may recognise a few.</p>
          <p class="why-hint">Tap a problem to watch it get fixed.</p></div>
        <div class="cp cp--problem"><h2 class="why-h" id="whyPH"></h2><p class="why-p" id="whyPB"></p></div>
        <div class="cp cp--fix"><h2 class="why-h" id="whyFH"></h2><p class="why-p" id="whyFB"></p></div>
        <div class="cp cp--finale"><h2 class="why-h">Cinematic outside. Practical inside.</h2>
          <p class="why-p">Nexoré pairs distinctive visual storytelling with solutions built around your goals and your customers’ experience, never an attractive website without a purpose.</p>
          <p class="why-fine">What gets built depends on your business: catalogues, ordering and custom features are scoped to each project.</p>
          <div class="why-cta"><a class="why-btn why-btn--p" id="whyContact" href="#" target="_blank" rel="noopener noreferrer" aria-label="Start a conversation with Nexoré on Instagram (opens in a new tab)">Start a conversation</a>
          <button type="button" class="why-btn" id="whyBack">Back to portfolio</button></div></div>
      </div>
      <div class="why-view">
        <div class="why-board" id="whyBoard" data-mode="problem" role="group" aria-label="Six common website problems"></div>
        <div class="why-focus" id="whyFocus">
          <div class="why-stage" id="whyStage"></div>
          <div class="why-ctl">
            <span class="why-ctl__end">Problem</span>
            <input class="why-range" id="whyRange" type="range" min="0" max="1000" value="0" step="1" aria-label="Drag from the problem to the fix">
            <span class="why-ctl__end">Fixed</span>
            <button type="button" class="why-btn why-btn--ic" id="whyReplay" aria-label="Replay">${ICO_R}</button>
          </div>
          <p class="why-note">Sample shop, invented for illustration.</p>
        </div>
      </div>
    </div>
    <footer class="why-foot">
      <button type="button" class="why-btn why-prev" id="whyPrev">${ARR_L}<span>Back</span></button>
      <div class="why-dots" id="whyDots" role="group" aria-label="Steps"></div>
      <button type="button" class="why-btn why-btn--p why-next" id="whyNext"><span>Rebuild it</span>${ARR_R}</button>
    </footer>
    <p class="sr" id="whyLive" aria-live="polite"></p>`;
  document.body.appendChild(root);

  R = { root, main: $('#whyMain', root), copy: $('#whyCopy', root), board: $('#whyBoard', root), stage: $('#whyStage', root), range: $('#whyRange', root),
    act: $('#whyAct', root), dots: $('#whyDots', root), prev: $('#whyPrev', root), next: $('#whyNext', root), replay: $('#whyReplay', root), live: $('#whyLive', root), tiles: [] };

  /* board tiles: the same scene components, shown small */
  SCENES.forEach((s, i) => {
    const tile = document.createElement('div');
    tile.className = 'why-tile'; tile.tabIndex = 0; tile.setAttribute('role', 'button'); tile.style.setProperty('--k', i);
    tile.setAttribute('aria-label', `${s.name}: ${s.pl}. Open the fix.`);
    const sc = makeSc(i);
    tile.appendChild(sc);
    const lab = document.createElement('span'); lab.className = 'why-tile__lab'; lab.setAttribute('aria-hidden', 'true');
    lab.innerHTML = `<span class="l-p">${s.pl}</span><span class="l-f">${s.fl}</span>`;
    tile.appendChild(lab);
    const act = () => go(i + 1);
    tile.addEventListener('click', act);
    tile.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
    R.board.appendChild(tile); R.tiles.push({ el: tile, sc });
  });

  /* step dots */
  for (let i = 0; i < STEPS; i++) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'why-dot';
    b.setAttribute('aria-label', i === 0 ? 'The problems' : i === STEPS - 1 ? 'Why Nexoré' : 'The fix: ' + SCENES[i - 1].name);
    if (i === 1 || i === STEPS - 1) b.dataset.g = '';
    b.addEventListener('click', () => go(i));
    R.dots.appendChild(b);
  }

  $('#whyClose', root).addEventListener('click', close);
  $('#whyBack', root).addEventListener('click', close);
  R.prev.addEventListener('click', () => go(S.step - 1));
  R.next.addEventListener('click', () => go(S.step + 1));
  R.range.addEventListener('input', onRange);
  R.range.addEventListener('pointerdown', stopAuto);
  R.replay.addEventListener('click', onReplay);

  /* keyboard — kept inside the experience so the gallery behind never sees it */
  root.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.target === R.range) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(S.step + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(S.step - 1); }
  });

  /* swipe (touch / pen) and wheel */
  let sw = null;
  R.main.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' || e.target.closest('input,button,a')) return; sw = { x: e.clientX, y: e.clientY }; });
  R.main.addEventListener('pointerup', e => {
    if (!sw) return; const dx = e.clientX - sw.x, dy = e.clientY - sw.y; sw = null;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.5) go(S.step + (dx < 0 ? 1 : -1));
  });
  R.main.addEventListener('pointercancel', () => { sw = null; });
  R.main.addEventListener('wheel', e => {
    if (e.target.closest('input')) return;
    const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(d) < 30) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && R.main.scrollHeight > R.main.clientHeight + 4) return;   // let tall layouts scroll
    const now = performance.now(); if (now - S.wheelT < 900) return; S.wheelT = now;
    go(S.step + (d > 0 ? 1 : -1));
  }, { passive: true });

  document.addEventListener('visibilitychange', () => root.classList.toggle('is-paused', document.hidden));
  $('#whyContact', root).href = S.opts.contactUrl || '#';
}

/* ==========================================================================
   Time: tweening --t
   ========================================================================== */
function setT(sc, v) {
  sc._t = v;
  sc.style.setProperty('--t', v.toFixed(4));
  if (v > .015) sc.setAttribute('data-fix', ''); else sc.removeAttribute('data-fix');
  if (sc === S.fsc) onFocusT(v);
}
function tweenTo(sc, to, dur, delay = 0) {
  S.tw = S.tw.filter(w => w.sc !== sc);
  if (isRM() && dur > 0) { dur = 0; delay = 0; }
  if (dur <= 0 && delay <= 0) { setT(sc, to); return; }
  S.tw.push({ sc, from: sc._t, to, t0: performance.now() + delay, dur });
  if (!S.raf) S.raf = requestAnimationFrame(tick);
}
function tick(now) {
  S.raf = 0;
  S.tw = S.tw.filter(w => {
    const k = clamp((now - w.t0) / w.dur);
    if (now < w.t0) return true;
    setT(w.sc, w.from + (w.to - w.from) * ease(k));
    return k < 1;
  });
  if (S.tw.length) S.raf = requestAnimationFrame(tick);
}
function stopAuto() { clearTimeout(S.auto); if (S.fsc) S.tw = S.tw.filter(w => w.sc !== S.fsc); }

function onFocusT(v) {
  if (document.activeElement !== R.range || !R.range.matches(':active')) R.range.value = Math.round(v * 1000);
  R.range.style.setProperty('--p', (v * 100).toFixed(1) + '%');
  R.range.setAttribute('aria-valuetext', v < .05 ? 'Problem' : v > .95 ? 'Fixed' : 'Rebuilding');
  if (R.main.dataset.kind === 'scene') R.copy.dataset.show = v < .5 ? 'problem' : 'fix';
  const lb = isRM() && R.replay.querySelector('b'); if (lb) lb.textContent = v < .5 ? 'Show the fix' : 'Show the problem';
}
function onRange() { stopAuto(); if (S.fsc) setT(S.fsc, R.range.value / 1000); }
function onReplay() {
  if (!S.fsc) return;
  stopAuto();
  if (isRM()) { setT(S.fsc, S.fsc._t < .5 ? 1 : 0); return; }
  setT(S.fsc, 0);
  S.auto = setTimeout(() => tweenTo(S.fsc, 1, 3000), 700);
}

/* ==========================================================================
   Steps
   ========================================================================== */
function leaveScene() {
  stopAuto();
  if (S.fsc) { ro && ro.unobserve(S.fsc); S.fsc = null; S.fi = -1; }
  R.stage.replaceChildren();
}
function setBoard(mode) {
  clearTimeout(S.finT);
  R.tiles.forEach(t => { S.tw = S.tw.filter(w => w.sc !== t.sc); });
  R.board.dataset.mode = mode;
  if (mode === 'problem') { R.tiles.forEach(t => setT(t.sc, 0)); return; }
  if (isRM()) { R.tiles.forEach(t => setT(t.sc, 1)); return; }
  R.tiles.forEach(t => setT(t.sc, 0));
  S.finT = setTimeout(() => R.tiles.forEach((t, i) => tweenTo(t.sc, 1, 1300, i * 170)), 520);
}
function enterScene(i) {
  leaveScene();
  const s = SCENES[i];
  $('#whyPH', R.root).textContent = s.ph; $('#whyPB', R.root).textContent = s.pb;
  $('#whyFH', R.root).textContent = s.fh; $('#whyFB', R.root).textContent = s.fb;
  const sc = makeSc(i); R.stage.appendChild(sc); S.fsc = sc; S.fi = i;
  R.range.value = 0; R.range.style.setProperty('--p', '0%');
  R.replay.innerHTML = isRM() ? '<b style="font-weight:700;font-size:.8125rem">Show the fix</b>' : ICO_R;
  R.replay.classList.toggle('why-btn--ic', !isRM());
  R.replay.setAttribute('aria-label', isRM() ? 'Toggle problem and fix' : 'Replay');
  if (!isRM()) S.auto = setTimeout(() => tweenTo(sc, 1, 3200), 2600);
}
function apply(n) {
  S.step = n;
  const kind = n === 0 ? 'board' : n === STEPS - 1 ? 'finale' : 'scene';
  R.main.dataset.kind = kind;
  if (kind === 'scene') { enterScene(n - 1); R.copy.dataset.show = 'problem'; }
  else { leaveScene(); setBoard(kind === 'finale' ? 'fixed' : 'problem'); R.copy.dataset.show = kind; }
  const act = n === 0 ? 'The problems' : kind === 'finale' ? 'Why Nexoré' : 'The fix';
  R.act.textContent = act;
  R.live.textContent = act + (kind === 'scene' ? ': ' + SCENES[n - 1].name : '');
  [...R.dots.children].forEach((d, i) => { if (i === n) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); });
  R.prev.disabled = n === 0;
  const last = n === STEPS - 1;
  R.next.setAttribute('aria-disabled', last ? 'true' : 'false'); R.next.tabIndex = last ? -1 : 0;
  R.next.style.visibility = last ? 'hidden' : '';
  R.next.firstElementChild.textContent = n === 0 ? 'Rebuild it' : n === STEPS - 2 ? 'Why Nexoré' : 'Next';
  R.main.scrollTop = 0;
}
function go(n) {
  n = clamp(n, 0, STEPS - 1);
  if (!S.open || n === S.step || S.busy) return;
  const dir = n > S.step ? 1 : -1, rm = isRM();
  S.busy = true;
  R.main.style.setProperty('--dir', dir);
  R.main.classList.add('is-out');
  setTimeout(() => {
    apply(n);
    R.main.classList.add('is-pre'); void R.main.offsetWidth;
    R.main.classList.remove('is-pre', 'is-out');
    S.busy = false;
  }, rm ? 0 : 230);
}

/* ==========================================================================
   Open / close
   ========================================================================== */
const INERT = ['#space', '#nav', '#main'];
function open(o = {}) {
  if (S.open || S.closing) return;
  S.opts = o; build();
  S.open = true; S.busy = false;
  $('#whyContact', R.root).href = o.contactUrl || '#';
  S.from = o.from || document.activeElement;
  S.inert = INERT.map(q => { const n = $(q); const was = n ? n.inert : false; if (n) n.inert = true; return [n, was]; });
  R.root.hidden = false;
  apply(0);
  R.root.classList.add('is-in'); clearTimeout(S.introT); S.introT = setTimeout(() => R.root.classList.remove('is-in'), 2200);
  const rm = isRM();
  if (rm) R.root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
  else {
    const b = S.from && S.from.getBoundingClientRect ? S.from.getBoundingClientRect() : null;
    const x = b && b.width ? b.left + b.width / 2 : innerWidth / 2, y = b && b.height ? b.top + b.height / 2 : innerHeight / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 4;
    R.root.animate([{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${r}px at ${x}px ${y}px)` }], { duration: 760, easing: 'cubic-bezier(.16,1,.3,1)' });
  }
  R.next.focus({ preventScroll: true });
}
function close() {
  if (!S.open || S.closing) return;
  S.closing = true;
  stopAuto(); clearTimeout(S.finT);
  const fin = () => {
    R.root.hidden = true; S.open = false; S.closing = false;
    leaveScene(); S.tw = []; S.step = -1;
    S.inert.forEach(([n, was]) => { if (n) n.inert = was; }); S.inert = [];
    if (typeof S.opts.onClose === 'function') S.opts.onClose();
    if (S.from && document.contains(S.from)) S.from.focus({ preventScroll: true });
  };
  if (isRM()) { R.root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160 }).onfinish = fin; return; }
  const b = S.from && S.from.getBoundingClientRect ? S.from.getBoundingClientRect() : null;
  const x = b && b.width ? b.left + b.width / 2 : innerWidth / 2, y = b && b.height ? b.top + b.height / 2 : innerHeight / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 4;
  const a = R.root.animate([{ clipPath: `circle(${r}px at ${x}px ${y}px)` }, { clipPath: `circle(0px at ${x}px ${y}px)` }], { duration: 480, easing: 'cubic-bezier(.6,0,.4,1)', fill: 'forwards' });
  a.onfinish = () => { fin(); a.cancel(); };
}

mqRm.addEventListener && mqRm.addEventListener('change', () => { if (S.open && S.fsc) enterScene(S.fi); });

window.NexoreWhy = { open, close, get isOpen() { return S.open; } };
})();
