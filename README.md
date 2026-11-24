# Nexoré — web design portfolio

The root `index.html` is the portfolio page (intro film → "View Portfolio" → rotating 3D gallery of six sites).

| Folder | Site |
|---|---|
| `/` | Nexoré portfolio (opens first) |
| `lamborghini/` | Lamborghini Revuelto — cinematic scroll experience |
| `veyra/` | Véyra — luxury fragrance store |
| `elvare/` | Élvaré — jewellery e-commerce |
| `vanta/` | Vanta District — 3D streetwear store (built version) |
| `aureniva/` | Auréniva Interiors — interior design studio with a scroll-driven film (built version) |
| `loopelle/` | Loopelle — handmade crochet shop with a 3D plushie hero |
| `source/vanta-district/` | Vanta's React/Vite source (not needed for hosting) |
| `source/aureniva-interiors/` | Auréniva's React/Vite source (not needed for hosting; see its `NOTE-PORTFOLIO.md`) |

## Host on GitHub Pages
1. Create a repo and push this folder's contents to the `main` branch:
   ```
   git init && git add . && git commit -m "Nexoré portfolio"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
   (Use git or GitHub Desktop — the browser uploader caps at 100 files, and Lamborghini has ~1,190 frames.)
2. Repo → Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
3. Your site goes live at `https://<you>.github.io/<repo>/`.

## Edit the gallery
`js/app.js` → `CONFIG.sites` (title, kind, `type` = the rotating headline, `feats` = the 3 real-world features shown under the ring, url, card image) and `CONFIG.contactUrl` (where both Contact buttons go). Card images are in `assets/img/previews/`.
More notes on the intro film in `PORTFOLIO-NOTES.md`.

## Nov 2 2026 audit fixes (SiteFaults)
- JS/CSS served from /js, /css, /lamborghini, /veyra are minified. Readable originals live in `source/unminified/` (edit those, then re-minify and copy back).
- Demo pages /veyra/, /lamborghini/, /elvare/, /vanta/, /aureniva/, /loopelle/: noindex removed, canonical + og:url added, listed in sitemap.xml.
- Added a main heading to /veyra/ and /lamborghini/, and a short descriptive text block to /veyra/, /lamborghini/, /vanta/ (visually hidden, readable by search engines and screen readers).
- Shortened the /elvare/ title, resized the /vanta/ description, re-encoded the Véyra and Vanta preview films (SSIM 0.993, same frames).

## Nov 8 2026 audit pass (SiteFaults, second round)
- All JS (`js/`, `lamborghini/`, `veyra/scrub-engine.js`) and `css/styles.css` are now fully minified from `source/unminified/` (edit there, rebuild with esbuild `--minify`, copy back). Véyra's inline script and Élvaré's inline CSS are minified too; readable copies: `source/unminified/veyra/index.html`, `source/unminified/elvare/inline-styles.css`.
- Faster first load: the card preview films, aurora film, starfield and strips are fetched on the visitor's first touch/click/key/mouse move or when the gallery opens (`loadLate` in js/app.js), not while the intro film is loading. First load went from ~11.8 MB to ~5 MB (mostly the intro film).
- The first caption (the page's h1) is visible from the first paint via CSS (`.cap[data-first]`), without waiting for js/app.js.
- Extra descriptive text added to /vanta/ and /lamborghini/ (visually hidden); sitemap dates refreshed.

## Added: Auréniva Interiors and Loopelle (Nov 2026)
- Two new demos in the gallery ring, the case studies page, the sitemap and the 404 page: `/aureniva/` (16:9 card) and `/loopelle/` (9:16 card).
- `/aureniva/` is the built version of the React/Vite project (source in `source/aureniva-interiors/`). Its 240 film frames are preloaded from the portfolio loading screen. The page-view / session-recording scripts and the on-screen boot-error overlay from the original upload were removed.
- `/loopelle/` is the static crochet-shop site with its 3D hero. It loads three.js from cdn.jsdelivr.net, so the 3D plushie needs internet; without it the site shows its 2D picture instead. Root-absolute paths in its 404 page were made relative, and its canonical / og URLs now point to `https://nexo-re.github.io/loopelle/`.
- New media: `assets/video/previews/{aureniva,loopelle}.mp4`, `assets/img/previews/{poster-,}{aureniva,loopelle}.webp`, `assets/og/og-{aureniva,loopelle}.jpg`. The Loopelle preview film was recorded without the 3D model (no internet in the build environment); re-record it with the 3D hero if you want the card to match exactly.
- `CONFIG.sites[]` in `source/unminified/js/app.js` holds both new entries (minified into `js/app.js`).
