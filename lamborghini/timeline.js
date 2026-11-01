/**
 * Lamborghini Revuelto — Animation Timeline & Text Cue Configuration (v4, video-based)
 *
 * Synced to the 2x-speed video (lv_0_20261026153817.mp4, 49.6 s), encoded for scrubbing as
 * assets/revuelto-scrub.mp4 (1920x1026, full 60 fps, crf 18, a keyframe every 4 frames, no audio).
 * ALL times below are seconds in THAT video. (They are the old 99 s timings divided by 2;
 * the burned-in "0-100 IN THE BLINK OF AN EYE" caption sits at ~22.1 - 23.45 s.)
 *
 * Config parameters per cue:
 * - id: Unique identifier
 * - start: Video time (seconds) when fade-in begins
 * - end: Video time (seconds) when fade-out finishes
 * - headline: Main uppercase title (null if label-only)
 * - subtitle: Optional subtitle under headline
 * - label: Small supporting label (restrained orange #ff6a00)
 * - position: 'bottom-center' | 'bottom-left' | 'top-center'
 * - shadowStrength: 'medium' | 'strong'
 * - stayVisibleUntilEnd: keeps final REVUELTO title pinned till end of scroll
 *
 * NOTE: overlay text over the burned-in caption window is kept at the bottom so the two do not collide.
 */

window.TIMELINE_CONFIG = {
  totalVideoDuration: 49.6,   // fallback only; the real length is read from the video file
  videoSrc: 'assets/revuelto-scrub.mp4',
  fadeInDuration: 0.25,  // seconds of video time
  fadeOutDuration: 0.2,  // seconds of video time
  smoothing: 7,            // playhead catch-up speed WITHOUT Lenis (per second; higher = snappier)
  smoothingWithLenis: 14,  // playhead catch-up speed WITH Lenis (Lenis already smooths the scroll)
  lenisLerp: 0.085,        // Lenis scroll smoothing (0.05 = floaty/cinematic, 0.15 = snappy)
  scrollMultiplier: 12,  // 1200vh spacer = 12 * window.innerHeight

  cues: [
    {
      id: 'hero-intro',          // car assembled, Y-headlights ignite (~7.3s)
      start: 3.75,
      end: 5.25,
      headline: 'LAMBORGHINI REVUELTO',
      subtitle: 'THE NEW ERA OF V12 PERFORMANCE',
      label: null,
      position: 'bottom-center',
      shadowStrength: 'medium',
      stayVisibleUntilEnd: false
    },
    {
      id: 'side-profile',        // orbit reaches side profile (~11.5s) then swings to rear
      start: 5.8,
      end: 7,
      headline: 'FORM MEETS FUNCTION',
      subtitle: null,
      label: 'SIDE AIR INTAKES',
      position: 'bottom-left',
      shadowStrength: 'medium',
      stayVisibleUntilEnd: false
    },
    {
      id: 'v12-engine',          // decklid opens ~25.5s, close-up of V12 badge 28-32s
      start: 13.9,
      end: 16,
      headline: 'V12 ENGINE',
      subtitle: null,
      label: 'NATURALLY ASPIRATED 6.5L V12',
      position: 'top-center',
      shadowStrength: 'strong',
      stayVisibleUntilEnd: false
    },
    {
      id: 'active-aero',         // direct rear view after cut at ~34.0s
      start: 17.2,
      end: 18.2,
      headline: null,
      subtitle: null,
      label: 'ACTIVE REAR AERODYNAMICS',
      position: 'top-center',
      shadowStrength: 'medium',
      stayVisibleUntilEnd: false
    },
    {
      id: 'v12-hybrid',          // x-ray: gearbox + rear e-motor, blue energy from ~39s
      start: 19.15,
      end: 21.8,
      headline: 'V12 HYBRID POWER',
      subtitle: null,
      label: 'ELECTRIC MOTOR AND TRANSVERSE E-GEARBOX',
      position: 'bottom-center',
      shadowStrength: 'strong',
      stayVisibleUntilEnd: false
    },
    {
      id: 'power-specs',         // hard cut at ~44.0s; burned-in caption sits mid-frame
      start: 22.25,
      end: 23.4,
      headline: '1,015 CV (1,001 HP)',
      subtitle: null,
      label: 'TRI-MOTOR HYBRID ARCHITECTURE',
      position: 'bottom-center',
      shadowStrength: 'strong',
      stayVisibleUntilEnd: false
    },
    {
      id: 'taillights',          // red Y-taillights ignite ~48.2s
      start: 24.15,
      end: 24.95,
      headline: null,
      subtitle: null,
      label: 'Y-SHAPE LED TAILLIGHTS',
      position: 'top-center',
      shadowStrength: 'medium',
      stayVisibleUntilEnd: false
    },
    {
      id: 'aero-precision',      // airflow streamlines 50.0 - 52.2s (cut to wide studio at 52.25)
      start: 25.15,
      end: 26.05,
      headline: 'AERODYNAMIC PRECISION',
      subtitle: null,
      label: 'LAMINAR AIRFLOW',
      position: 'bottom-center',
      shadowStrength: 'medium',
      stayVisibleUntilEnd: false
    },
    {
      id: 'pure-performance',    // wheel macro 54.4 - 60.3s
      start: 27.4,
      end: 30,
      headline: 'PURE PERFORMANCE',
      subtitle: null,
      label: 'CARBON CERAMIC BRAKES',
      position: 'bottom-left',
      shadowStrength: 'strong',
      stayVisibleUntilEnd: false
    },
    {
      id: 'beyond-ordinary',     // Y-headlight macro 69.3 - 75.5s
      start: 34.8,
      end: 37.65,
      headline: 'BEYOND THE ORDINARY',
      subtitle: null,
      label: 'Y-SIGNATURE LED HEADLIGHTS',
      position: 'bottom-left',
      shadowStrength: 'medium',
      stayVisibleUntilEnd: false
    },
    {
      id: 'scissor-doors',       // doors start lifting ~75.8s, open by ~78.5s
      start: 38.2,
      end: 40.35,
      headline: 'ENGINEERED TO EXCITE',
      subtitle: null,
      label: 'VERTICAL SCISSOR DOORS',
      position: 'bottom-center',
      shadowStrength: 'medium',
      stayVisibleUntilEnd: false
    },
    {
      id: 'cockpit-tour',        // interior shot 1: 81.3 - 88.9s
      start: 41.4,
      end: 44.15,
      headline: null,
      subtitle: null,
      label: 'DRIVER-FOCUSED COCKPIT',
      position: 'top-center',
      shadowStrength: 'strong',
      stayVisibleUntilEnd: false
    },
    {
      id: 'final-revuelto',      // final hero stance with glowing headlights
      start: 48.8,
      end: 49.54,
      headline: 'REVUELTO',
      subtitle: null,
      label: null,
      position: 'bottom-center',
      shadowStrength: 'medium',
      stayVisibleUntilEnd: true
    }
  ],

  /**
   * Mobile Portrait Crop & Dynamic Zoom Keyframes (re-timed to the new edit)
   * On mobile portrait (H > W), interpolates cx, cy, and zoom based on video time t.
   * On desktop/landscape, defaults to cx: 0.5, cy: 0.5, zoom: 1.0.
   */
  mobileKeyframes: [
    { t: 0,  cx: 0.50, cy: 0.55, zoom: 1.0 }, // Chassis assembly
    { t: 2.5,  cx: 0.50, cy: 0.55, zoom: 1.0 },
    { t: 3.25,  cx: 0.38, cy: 0.52, zoom: 1.0 }, // Front 3/4 hero, Y-headlights
    { t: 5.25, cx: 0.38, cy: 0.52, zoom: 1.0 },
    { t: 6, cx: 0.48, cy: 0.50, zoom: 1.0 }, // Side profile
    { t: 6.75, cx: 0.48, cy: 0.50, zoom: 1.0 },
    { t: 7.25, cx: 0.34, cy: 0.50, zoom: 1.0 }, // Rear 3/4 (car sits left of centre)
    { t: 8, cx: 0.30, cy: 0.50, zoom: 1.0 }, // Begin extra zoom on small rear shot
    { t: 9.5, cx: 0.34, cy: 0.50, zoom: 1.3 }, // Hold 1.3 zoom, follow car toward centre
    { t: 11, cx: 0.42, cy: 0.50, zoom: 1.3 },
    { t: 12, cx: 0.44, cy: 0.50, zoom: 1.3 }, // End hold
    { t: 12.5, cx: 0.50, cy: 0.50, zoom: 1.0 }, // Ease back to 1.0 before engine-bay push-in
    { t: 12.75, cx: 0.50, cy: 0.50, zoom: 1.0 }, // Decklid open
    { t: 16, cx: 0.50, cy: 0.50, zoom: 1.0 }, // Engine close-up
    { t: 16.25, cx: 0.50, cy: 0.52, zoom: 1.0 }, // Pull back to direct rear view
    { t: 20.25, cx: 0.50, cy: 0.52, zoom: 1.0 }, // X-ray rear view
    { t: 21.75, cx: 0.50, cy: 0.52, zoom: 1.0 },
    { t: 22, cx: 0.48, cy: 0.50, zoom: 1.0 }, // Hard cut: x-ray rear 3/4 (battery + motors)
    { t: 23.75, cx: 0.48, cy: 0.50, zoom: 1.0 },
    { t: 24.15, cx: 0.55, cy: 0.50, zoom: 1.0 }, // Taillights ignite
    { t: 25, cx: 0.55, cy: 0.50, zoom: 1.0 },
    { t: 25.15, cx: 0.44, cy: 0.50, zoom: 1.0 }, // Wind-tunnel airflow
    { t: 26.1, cx: 0.44, cy: 0.50, zoom: 1.0 },
    { t: 26.2, cx: 0.50, cy: 0.50, zoom: 1.0 }, // Hard cut: wide studio orbit
    { t: 27.1, cx: 0.50, cy: 0.50, zoom: 1.0 },
    { t: 27.25, cx: 0.52, cy: 0.50, zoom: 1.0 }, // Wheel macro (bull emblem & brake)
    { t: 30.15, cx: 0.52, cy: 0.50, zoom: 1.0 },
    { t: 31, cx: 0.62, cy: 0.50, zoom: 1.0 }, // After wipe: front fender / Y-light pan
    { t: 32.75, cx: 0.62, cy: 0.50, zoom: 1.0 },
    { t: 33.25, cx: 0.50, cy: 0.50, zoom: 1.0 }, // Pull back to front 3/4 and head-on view
    { t: 34.25, cx: 0.48, cy: 0.50, zoom: 1.0 },
    { t: 34.75, cx: 0.47, cy: 0.50, zoom: 1.0 }, // Y-headlight macro
    { t: 36.6, cx: 0.45, cy: 0.50, zoom: 1.0 },
    { t: 37.75, cx: 0.45, cy: 0.52, zoom: 1.0 }, // Front 3/4 before doors open
    { t: 38.25, cx: 0.46, cy: 0.45, zoom: 1.0 }, // Scissor doors open upward
    { t: 40.25, cx: 0.46, cy: 0.45, zoom: 1.0 },
    { t: 40.65, cx: 0.62, cy: 0.50, zoom: 1.0 }, // Interior shot 1: seats / dashboard from the side
    { t: 41.5, cx: 0.58, cy: 0.50, zoom: 1.0 },
    { t: 42.5, cx: 0.50, cy: 0.50, zoom: 1.0 },
    { t: 43, cx: 0.46, cy: 0.50, zoom: 1.0 }, // Steering wheel + centre display together
    { t: 44.4, cx: 0.44, cy: 0.50, zoom: 1.0 },
    { t: 44.65, cx: 0.52, cy: 0.50, zoom: 1.0 }, // Hard cut: interior shot 2
    { t: 45.6, cx: 0.52, cy: 0.50, zoom: 1.0 },
    { t: 45.8, cx: 0.45, cy: 0.50, zoom: 1.0 }, // Pull out through the door
    { t: 46.75, cx: 0.48, cy: 0.50, zoom: 1.0 }, // Doors lower
    { t: 47.5, cx: 0.50, cy: 0.50, zoom: 1.0 }, // Closed side profile
    { t: 48.25, cx: 0.46, cy: 0.50, zoom: 1.0 },
    { t: 48.85, cx: 0.48, cy: 0.52, zoom: 1.0 }, // Final hero stance
    { t: 49.54, cx: 0.48, cy: 0.52, zoom: 1.0 }
  ]
};
