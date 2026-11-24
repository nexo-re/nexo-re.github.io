/* ==========================================================================
   SITE SETTINGS  -  the ONLY file you edit for each new crochet business
   (plus products.csv for the catalogue, and the pictures in /assets).
   Save the file, refresh the browser, done.
   ========================================================================== */
window.SITE = {

  /* ---------- 1. BUSINESS NAME + LOGO ---------- */
  business: {
    name:    'Loopelle',                             // shown everywhere on the site
    tagline: 'Handmade · Plushies',           // small line under the name in the menu
    instagram: '',   // '' to hide - add your Loopelle Instagram link here
    whatsapp:  '',                           // country code + number, digits only, e.g. '919876543210'. '' to hide
    email:     'nexoree@gmail.com',          // checkout + contact forms draft an email to this address (visitor presses Send)
  },

  logo: {
    /* Logo as pictures (best: a single-colour SVG or transparent PNG).
       wordmark = the full name logo (required)   |   mark = small round icon (optional) */
    wordmark: 'assets/brand/loopelle-logo.png',
    mark:     'assets/brand/mark.png',

    /* The logo that draws itself on the first screen is tinted this colour
       (so it stays readable over the doll). Set false to keep the logo's own colours. */
    tintHero: true
  },


  /* ---------- 2. HERO: the crochet that gets stitched + the hanging crochets ---------- */
  hero: {
    /* The picture that gets crocheted stitch by stitch.
       Use a PNG/WebP with a TRANSPARENT background (cut-out), roughly portrait. */
    image: 'assets/hero/hero.webp',

    /* 3D hero: a .glb model. It is stitched row by row (from its front view), then turns into the live
       3D model, and does a full 360 turn while it glides to the bottom-right corner.
       '' = use the picture above instead. Loads three.js from jsDelivr (needs internet). */
    model: 'assets/hero/model.glb',

    /* Exactly 5 crochets (any size, transparent background) drop in and hang from above.
       Each one falls and glides into its own product card
       (hang-1 -> product row 1, hang-2 -> row 2 ... in products.csv). A black cord + clasp is added automatically. */
    hanging: [
      'assets/hanging/hang-1.webp',
      'assets/hanging/hang-2.webp',
      'assets/hanging/hang-3.webp',
      'assets/hanging/hang-4.webp',
      'assets/hanging/hang-5.webp'
    ],

    /* Where the hanging crochets may swing, as a fraction of the hero picture's width/height.
       left/right = the "middle" column (e.g. the doll's head) - two crochets hang on each
       outer side and two in the middle. sideBottom = how low the outer ones may hang
       (0.44 = down to 44% of the picture's height, i.e. above the doll's arms).
       Only touch this if a new hero picture overlaps the crochets. */
    charmZone: { left: 0.225, right: 0.775, sideBottom: 0.36 },

    stitchSize: 15      // bigger number = bigger stitches = faster crocheting
  },


  /* ---------- 3. SHOP TEXT ---------- */
  shop: {
    eyebrow:  'The Loopelle Collection',
    heading:  'Plushie friends',
    subtext:  'Handmade crochet plushies, made one stitch at a time.',   // free-shipping line is added after this
    searchHint: 'Search plushies...',
    currency: '$',
    locale:   'en-US',          // number format: 'en-US', 'en-GB' ...
    freeShippingAbove: 0,    // 0 = don't show
    lowStockAt: 5,              // shows "Only N left" at or below this stock
    cardLine: 'Handmade with love',
    credit: 'Digital Experience by <b>NEXORÉ</b>'    // footer credit, '' to remove
  },

  /* Little chat helper in the corner (the hero picture pops in as its avatar). */
  helper: { name: 'Loopelle' },


  /* ---------- 4. COLOURS ---------- */
  theme: {
    accent:   '#F4C2C2',   // buttons, prices, borders, yarn decorations
    logoFill: '#ff8fb8'    // colour the hero logo fills with
  },

  /* ---------- 5. PRODUCT STORIES (adoption certificate + "watch it being crocheted") ----------
     One entry per product, matched by product name (lower-case). All numbers are for the
     little "being crocheted" progress bar. Products not listed here get a made-up default. */
  lore: {
    'scarf bunny':     { character: 'Ruby',     stitches: 5120, metres: 146, hours: 11.0 },
    'calico kitty':    { character: 'Mochi',    stitches: 4380, metres: 124, hours: 9.5  },
    'little froggy':   { character: 'Puddles',  stitches: 3860, metres: 108, hours: 8.5  },
    'teddy bear':      { character: 'Cocoa',    stitches: 4740, metres: 134, hours: 10.5 },
    'scarf penguin':   { character: 'Frosty',   stitches: 4620, metres: 130, hours: 10.0 },
    'fluffy chick':    { character: 'Sunny',    stitches: 3540, metres: 100, hours: 8.0  },
    'spotty puppy':    { character: 'Biscuit',  stitches: 4460, metres: 126, hours: 9.5  },
    'blossom octopus': { character: 'Blossom',  stitches: 4180, metres: 118, hours: 9.0  }
  }
};
