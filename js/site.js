/* Shared behaviour for the content pages: footer year. */
(function () {
  'use strict';
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
