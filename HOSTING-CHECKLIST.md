# Before you go live — 3 things only you can fill in

## 1. Your domain (required)
Canonical links, share images, the sitemap and the schema use `https://nexo-re.github.io` (already filled in).
Replace it everywhere in one go (use your real address, no trailing slash):

    # Mac / Linux (run inside this folder; on macOS use: sed -i '' ...)
    grep -rl "nexo-re.github.io" --include="*.html" --include="*.txt" --include="*.xml" . | xargs sed -i 's#https://nexo-re.github.io#https://www.yourrealdomain.com#g'

Or use Find & Replace across the folder in any code editor.
Host the site at the **root** of the domain (not in a sub-folder) so the 404 page and share images resolve.

## 2. Google Analytics (optional until you have an ID)
Open `js/analytics.js` and replace `G-XXXXXXXXXX` with your GA4 Measurement ID.
Until then nothing is sent and no cookies are set. If you expect visitors from the EU/UK, add a cookie-consent banner.

## 3. Check these statements are true for you
- "We reply to every enquiry within 24 hours": appears on the home hero, contact sheet, contact page, privacy page and footer. Change the wording if 24 hours isn't realistic.
- "Where we work: Online" on the contact page.
- `privacy.html` is a sensible template, not legal advice. Add your legal name/address if the law where you operate requires it.

## What was deliberately left out
- **Map + directions / street address:** Nexoré has no public address in the files, so none was invented. If you have a studio or office, send the address and add it to `contact.html` and to the schema in `index.html`.
- **Demo sites (Véyra, Lamborghini, Élvaré, Vanta)** are set to `noindex` so search engines show Nexoré's own pages instead of fictional shops. Remove the `<meta name="robots">` line in each demo's `index.html` to change this.
- Don't upload the `source/` folder (raw working files).
