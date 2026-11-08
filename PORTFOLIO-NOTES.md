# Nexoré — autoplay film + 3D portfolio

Open via any static server (e.g. `npx serve .` or `python3 -m http.server`). Opening index.html straight from disk also works, but the loader % is approximate.

## Two films, picked automatically
| Screen | Film | File |
|---|---|---|
| Phones & tablets held upright (width ÷ height < 1.2) | 9:16 portrait film | `assets/video/hero-scrub.mp4` |
| Desktop, laptops, and any landscape screen (width ÷ height ≥ 1.2) | 16:9 landscape film | `assets/video/hero-desktop.mp4` |

The choice is made from the shape of the window, not the device name, so it also swaps live if someone rotates a phone or resizes a window across that line (someone who already reached the end stays at the end, with the button live). The breakpoint is `(min-aspect-ratio: 6/5)` and appears in three places that must stay in sync: `js/app.js` (`mqDesk`), `css/styles.css` (the "Desktop / landscape film" block) and `index.html` (the `<picture>` / preload `media` attributes).

### Desktop button timing
In the 16:9 film the real “View Portfolio” button lands at ≈5.7 s and stops moving at ≈6.0 s. The clickable hotspot goes live at exactly that film time (`CONFIG.desktop.hotspotAt`), not when the clip ends, and clicking it before the clip finishes freezes the film in place (no seek hiccup) before the zoom into the gallery. The hotspot box (`CONFIG.desktop.hotspot`, in % of the frame) was measured from the film's final frame and matches the button to within 1 px at every window size. If you ever swap the film, re-measure both numbers.

## Edit
- Intro timing, per film: `CONFIG.video` (portrait: `pauseMs` 3000, `rate` 1.6) and `CONFIG.desktop` (landscape: `pauseMs` 2000, `rate` 1, `hotspotAt` 6.0).
- `js/app.js` → `CONFIG` at the very top: your 4 demo sites (title, kind, url, preview type, optional screenshot `image`), contact link (`contactUrl`, opens Instagram), ring speed, hotspot box.
- Colours live in `:root` of `css/styles.css` (--ink-0/1/2, --blue).

## Re-encode the desktop film
ffmpeg -i desktop.mp4 -an -c:v libx264 -preset slow -crf 20 -g 5 -keyint_min 5 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart assets/video/hero-desktop.mp4
ffmpeg -i desktop.mp4 -an -vf scale=640:360 -c:v libx264 -preset slow -crf 27 -g 5 -keyint_min 5 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart assets/video/hero-desktop-lite.mp4
Also regenerate `assets/img/hero-desktop-first.webp` / `hero-desktop-last.webp` (first and last frame), and update `CONFIG.desktop` (fps, duration, bytes, hotspot, hotspotAt).

## Re-encode the portrait film (every frame a keyframe)
ffmpeg -i hero.mp4 -an -vf scale=810:1440 -c:v libx264 -preset slow -crf 26 -g 1 -bf 0 -pix_fmt yuv420p -movflags +faststart assets/video/hero-scrub.mp4
If you change length/fps, update `CONFIG.video` (fps, duration, bytes).

## Notes
- Hotspot is a child of the video frame, so its % box follows the video at every size.
- Fonts: Bricolage Grotesque + Work Sans (SIL OFL, licences in assets/fonts).
- Test on real iOS Safari before launch; I could only test in Chrome.

## Aurora behind the site-details panel
The panel under the 3D ring (`#info`) plays `assets/video/aurora.mp4` (cropped 960×~430, muted, ~370 KB; an 8 s seamless loop made by cross-fading the last 2 s into the first 2 s of the source) behind its text, with `assets/img/aurora-poster.webp` as the still for reduced-motion / Save-Data. Styles: "aurora behind the site-details panel" block in `css/styles.css`; the dark scrim there controls text legibility.

## Véyra + Lamborghini scroll smoothness
Both demos share `scrub-engine.js` (copy in each folder). See each folder's README.

## Latest changes
- Buttons: colour floods in from the pointer (hover on computers, tap on touch screens). Styles: "Button fill" block in css/styles.css; JS: `fillButtons` in js/app.js.
- Ring auto-rotation reversed: `CONFIG.ring.autoSpeed` is now -7 (set 7 for the old direction).
- Contact opens a sheet with Instagram and Email. Email options + draft text: `CONFIG.email`, `emailSubject`, `emailBody` in js/app.js (phones use mailto:, computers open Gmail compose).
- Cards open the demo site in a full-screen layer that grows from the tap point as a circle (Back button, Esc and the phone's back gesture all close it). Ctrl/Cmd-click still opens a new tab.
- Vanta District: thin white frame (`.nx-3d-box`) around every drag/zoom 3D model box.

## Round 3
- "Skip intro" and "Portfolio" buttons removed: the intro film plays on its own and the in-film "View Portfolio" button opens the gallery.
- Back from an opened demo site: one tap, no white screen (each open uses a fresh iframe; the history entries sites add are cleaned up on close).
- Auto-scroll (Lamborghini, Véyra): the film plays natively in real time and the page scrolls to follow it, so picture, text and scrollbar can't drift. The page is now locked (no manual scrolling) so only the auto-play moves it; Véyra unlocks once the bottle lands in the shop. Véyra's auto-scroll runs through the hero and carries the bottle into the shop, then stops. Lamborghini: `AUTO_FILM_RATE` / `AUTO_SCROLL_DELAY_MS` in app.js. Véyra: `AUTO_DELAY` / `AUTO_RATE` in index.html.

## Launch pack (SEO + conversion)
New pages: `case-studies.html`, `contact.html` (email + Instagram + 5 FAQs), `privacy.html`, `404.html`. Shared styles/scripts: `css/site.css`, `js/site.js`, `js/analytics.js` (Google Analytics, paste your ID). Share images: `assets/og/`. Also `robots.txt`, `sitemap.xml`, `favicon.svg`. See `HOSTING-CHECKLIST.md` before going live.


## Demo loading screen (js/app.js → "Loading screen + pre-loader")
Tapping a demo shows a loading screen (progress ring, real MB counter, rotating facts, the demo's colour). Every file the demo needs is
downloaded first; only then does the demo start, and it is revealed once it has painted. Per demo, in `CONFIG.sites[]`:
- `accent`  — colour of the ring / labels.
- `facts`   — 3–4 short facts shown while loading (shared ones live in `CONFIG.facts`).
- `preload` — `() => ({ label, hint, blobs, extra })`. `hint` ≈ total bytes (keeps the % smooth), `blobs` = big files kept in memory and handed to the
  demo (the films), `extra` = any other file to warm (also works for third-party URLs; those time out after 8 s and never block the demo).
  Scripts, styles, images, Google Fonts and Vite chunks are found automatically by reading the demo's own files, so a rebuild with new hashes needs no change.
- The Lamborghini / Véyra demos reuse the preloaded film through `ScrubEngine.src()` / `loadFull()` in `scrub-engine.js` (they work unchanged when opened on their own).
- Vanta fetches two lighting maps (`dikhololo_night_1k.hdr`, `potsdamer_platz_1k.hdr`) from raw.githack.com at runtime. They are warmed here; for the
  most reliable result, download them into `vanta/assets/` and pass `files="..."` to `<Environment>` in the source.

## Round 4
- Domain placeholder replaced everywhere with https://nexo-re.github.io (canonical, og/twitter, schema, sitemap, robots).
- Demo loading screen shows only the % (no MB text).
- Intro film streams: its request starts from an inline script in index.html and playback begins as soon as the browser can play it through (aim: 2 s after the page opens; `START_BY_MS` in js/app.js). No first-frame hold (`pauseMs: 0`).
- Faster loading: aurora video loads only after the film is rolling; why.css no longer blocks first paint; shorter "Ready" pause in the demo loader; the demo at the front of the ring is fetched quietly after 2.2 s of rest (`CONFIG.prefetchDemos`, skipped on Save-Data / 2G / mobile data). No file was re-encoded, so quality is unchanged.
- "Start a project" and "Case studies" moved from the bottom caption box into the top Nexoré banner. Below 560px the "Get a quote" pill hides to make room.

## Scrolling card previews
Each ring card now shows its site being scrolled: `assets/img/previews/strip-<site>.webp` is a tall image of the real site captured at 6–7 scroll positions, and CSS (`.site__strip`, `stripScroll`) glides it upward and back, with each card offset in time. Set per site in `CONFIG.sites[].strip` (`src`, `n` = number of frames). The still `image` shows until the strip loads. Strips are fetched only after the intro film is rolling (or when the gallery opens) and are static under reduced motion.


## Card previews = real films of each site scrolling
Each ring card plays `assets/video/previews/<site>.mp4` (the real demo scrolled top to bottom and back, muted, looping) over the still `assets/img/previews/poster-<site>.webp`.
Lamborghini + Véyra use a 16:9 frame (960×540); Élvaré + Vanta use a 9:16 frame (540×960 / 450×800). Set per site in `CONFIG.sites[]` with `vid` and `frame` ('16:9' or '9:16'); the film's shape must match.
A film plays only while its card faces the viewer (`PV` in js/app.js); reduced-motion, Save-Data and 2G visitors see the still. CSS: "Card previews" block in css/styles.css.
To redo one: record the page scrolling, then
ffmpeg -framerate 20 -i frames/%04d.jpg -vf "scale=960:540,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p" -c:v libx264 -preset slow -crf 29 -movflags +faststart -an site.mp4
(the reverse/concat makes it loop back and forth). The old `strip-*.webp` images are no longer used by the cards and can be deleted.
