# Nexoré — web design portfolio

The root `index.html` is the portfolio page (intro film → "View Portfolio" → rotating 3D gallery of four sites).

| Folder | Site |
|---|---|
| `/` | Nexoré portfolio (opens first) |
| `lamborghini/` | Lamborghini Revuelto — cinematic scroll experience |
| `veyra/` | Véyra — luxury fragrance store |
| `elvare/` | Élvaré — jewellery e-commerce |
| `vanta/` | Vanta District — 3D streetwear store (built version) |
| `source/vanta-district/` | Vanta's React/Vite source (not needed for hosting) |

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
- Demo pages /veyra/, /lamborghini/, /elvare/, /vanta/: noindex removed, canonical + og:url added, listed in sitemap.xml.
- Added a main heading to /veyra/ and /lamborghini/, and a short descriptive text block to /veyra/, /lamborghini/, /vanta/ (visually hidden, readable by search engines and screen readers).
- Shortened the /elvare/ title, resized the /vanta/ description, re-encoded the Véyra and Vanta preview films (SSIM 0.993, same frames).

## Nov 8 2026 audit pass (SiteFaults, second round)
- All JS (`js/`, `lamborghini/`, `veyra/scrub-engine.js`) and `css/styles.css` are now fully minified from `source/unminified/` (edit there, rebuild with esbuild `--minify`, copy back). Véyra's inline script and Élvaré's inline CSS are minified too; readable copies: `source/unminified/veyra/index.html`, `source/unminified/elvare/inline-styles.css`.
- Faster first load: the card preview films, aurora film, starfield and strips are fetched on the visitor's first touch/click/key/mouse move or when the gallery opens (`loadLate` in js/app.js), not while the intro film is loading. First load went from ~11.8 MB to ~5 MB (mostly the intro film).
- The first caption (the page's h1) is visible from the first paint via CSS (`.cap[data-first]`), without waiting for js/app.js.
- Extra descriptive text added to /vanta/ and /lamborghini/ (visually hidden); sitemap dates refreshed.
