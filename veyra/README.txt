VÉYRA demo site (by NEXORÉ)

RUN: serve the folder, don't double-click index.html (video scrubbing needs a server):
  python -m http.server 8000   ->  open http://localhost:8000

TO CHANGE THE VIDEO, re-encode it so it scrubs smoothly (short keyframe gaps are what make scroll-scrubbing smooth):
  ffmpeg -i YOUR.mp4 -an -vf "fps=60,scale=1920:1080:flags=lanczos" -c:v libx264 -preset slow -crf 20 -g 8 -keyint_min 8 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart assets/hero.mp4
  ffmpeg -i YOUR.mp4 -an -vf "fps=30,scale=1920:1080:flags=lanczos" -c:v libx264 -preset slow -crf 24 -g 4 -keyint_min 4 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart assets/hero-m.mp4
  ffmpeg -i YOUR.mp4 -frames:v 1 -vf "scale=1920:1080:flags=lanczos" -q:v 2 assets/poster.jpg
(hero.mp4 = desktop, hero-m.mp4 = phones. Keep each file under GitHub's 100 MB limit.)

EDIT: text, prices, products and caption timings are in the "EDIT ME" block at the top of the script in index.html.
Replace drawn bottles: add img:'assets/yourfile.png' to a product.

SMOOTH SCROLL ENGINE (scrub-engine.js)
Steady scrolling PLAYS the film (locked to the scroll by playbackRate); slow moves, reverse and jumps SEEK it. The playhead is a critically damped spring. The film streams first, then an in-memory copy takes over invisibly. Videos are now encoded with no B-frames and a keyframe every 6 frames (hero.mp4) / 4 frames (hero-m.mp4), same colour tags. Re-encode with: -bf 0 -g 6 -keyint_min 6 -sc_threshold 0 (add -refs 3, keep -colorspace bt470bg -color_primaries bt470bg -color_trc smpte170m).
