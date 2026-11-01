/* Google Analytics 4 — paste your Measurement ID below (Analytics → Admin → Data streams → Measurement ID).
   Until you do, this file does nothing, so nothing is sent and no cookies are set.
   Visitors whose browser sends "Do Not Track" are not measured. */
(function () {
  'use strict';
  var GA_ID = 'G-XXXXXXXXXX';
  window.nxTrack = function () {};                                   // safe no-op until GA is live
  if (!/^G-[A-Z0-9]{6,}$/.test(GA_ID) || GA_ID === 'G-XXXXXXXXXX') return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
  var s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.nxTrack = function (name, params) { gtag('event', name, params || {}); };

  // count clicks on any link/button marked data-cta="..."
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-cta]');
    if (el) window.nxTrack('cta_click', { cta: el.getAttribute('data-cta'), page: location.pathname });
  }, true);
})();
