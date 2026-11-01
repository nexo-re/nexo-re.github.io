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
