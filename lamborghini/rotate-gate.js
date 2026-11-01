/**
 * Rotate gate: tells app.js whether the "please rotate" overlay is currently showing.
 * The overlay itself is pure CSS (see end of style.css); this mirrors the same media query.
 */
(function () {
  'use strict';
  var mq = window.matchMedia('(orientation: portrait) and (pointer: coarse) and (max-width: 820px)');
  window.ROTATE_GATE = {
    blocked: function () { return mq.matches; },
    onChange: function (fn) {
      if (mq.addEventListener) mq.addEventListener('change', fn);
      else if (mq.addListener) mq.addListener(fn);
    }
  };
})();
