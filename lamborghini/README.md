# Lamborghini Revuelto — Cinematic Scroll-Driven Experience

A premium, full-screen, scroll-driven interactive showcase for the Lamborghini Revuelto. Built entirely with plain HTML5 Canvas, modern CSS, and vanilla JavaScript—zero external frameworks and zero CDN dependencies for the animation engine.

---

## Key Features

1. **Fixed Full-Screen Canvas Architecture**:
   - Fixed at `100vw` × `100svh` (`100vh` fallback), capped at `devicePixelRatio = 2`.
   - Direct manual cover-crop computation inside the canvas context without wrappers or layout containers.
   - High-quality bicubic image smoothing enabled.

2. **Cinematic Smooth Scroll (video scrubbing)**:
   - `1200vh` empty spacer drives native scrolling with custom lerp smoothing in a 60/120fps `requestAnimationFrame` loop.
   - Scroll position sets `currentTime` of one video, `assets/revuelto-scrub.mp4` (1920×1026, full 60 fps, 49.6 s, crf 18, no audio, keyframe every 4 frames so seeking is instant in both directions; about 78 MiB). The video is painted onto the canvas, which keeps the mobile crop/zoom.

3. **Loading**:
   - The canvas shows black until the first video frame is ready; the browser streams the rest of the file as you scroll (the host must support range requests, as Cloudflare/Netlify/GitHub Pages do).
   - If the server does not support range requests (e.g. `python -m http.server`), the film cannot be seeked while it streams, so the page automatically downloads the whole file first (a small "Loading film N%" line shows at the bottom) and plays it from memory. Auto-scroll waits until it has finished. Add `?debug` to the URL to see video time / seeking state.
   - To swap the film: re-encode with `ffmpeg -i new.mp4 -an -c:v libx264 -preset medium -crf 18 -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart assets/revuelto-scrub.mp4`, then re-time `timeline.js` (cue and keyframe times are seconds in the video).

4. **Dynamic Mobile Portrait Crop & Rear Shot Zoom**:
   - Viewport-responsive manual cover cropping.
   - Interpolates focal centers per shot (e.g. focusing on headlights at `38% 52%`, macro wheel hub at `60% 50%`, cockpit steering wheel + dashboard at `38% 50%`).
   - Dynamic zoom ramp on small rear shots (ramps $1.0 \to 1.3$ from 16s to 19s, holds until 24s, eases smoothly back to $1.0$ by 25s before the engine bay push-in).

5. **Pure Typography & Legibility**:
   - Zero UI: no navigation bars, progress indicators, video controls, badges, cards, or gradient masks.
   - Only cinematic typography with multi-layered `text-shadow` tuned per shot for readability against both dark studio floors and bright metallic reflections.
   - Restrained `#ff6a00` orange accent line and label.
   - All text timings and cues configurable in `timeline.js`.

---

## Auto-Scroll

The page scrolls itself automatically 5 seconds after it opens (no button). Any wheel, touch or navigation-key input takes over immediately and stops it for good. Speed and delay are `AUTO_SCROLL_PX_PER_SEC` and `AUTO_SCROLL_DELAY_MS` at the top of `app.js`.

---

## How to Launch Locally

### Option A: Using `lite-server` (Recommended)

From the project root:
```bash
lite-server
```
or specifying a custom port:
```bash
lite-server --port 3000
```

### Option B: Using Python built-in static server

```bash
python3 -m http.server 3000
```

Open your browser at:
`http://localhost:3000` (or the network URL displayed by lite-server).

---

## Adjusting Text Timings

All text cues, headlines, subtitles, labels, and timings are cleanly organized in `timeline.js`:
- `start`: Video time in seconds when fade-in begins.
- `end`: Video time in seconds when fade-out completes.
- `position`: `'bottom-center'`, `'bottom-left'`, or `'top-center'`.
- `shadowStrength`: `'medium'` or `'strong'`.

## Smooth scroll engine (scrub-engine.js)
Steady scrolling (including auto-scroll) now PLAYS the film, locked to the scroll via playbackRate; slow moves, reverse and jumps seek instead (aimed ahead by the measured seek latency). The playhead uses a critically damped spring, the canvas is capped to the film's resolution, and the film streams first and is then swapped for an in-memory copy invisibly. Add `?debug` to see mode / rate / error.
