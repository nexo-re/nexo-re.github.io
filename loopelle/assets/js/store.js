/* Product store: reads products.csv (name, price, original_price, shipping_time, stock, photo, category, badge, description) */
(function () {
  'use strict';
  var C = window.SAYORI_CONFIG || {};
  var listeners = [], current = null;

  function parseCSV(text) {
    var rows = [], row = [], f = '', q = false, i = 0, c;
    text = String(text || '').replace(/^\uFEFF/, '');
    while (i < text.length) {
      c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { f += '"'; i += 2; continue; } q = false; i++; continue; }
        f += c; i++; continue;
      }
      if (c === '"') { q = true; i++; continue; }
      if (c === ',') { row.push(f); f = ''; i++; continue; }
      if (c === '\r') { i++; continue; }
      if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; i++; continue; }
      f += c; i++;
    }
    if (f.length || row.length) { row.push(f); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (x) { return String(x).trim() !== ''; }); });
  }

  function num(v) {
    var s = String(v == null ? '' : v).replace(/[^0-9.]/g, '');
    if (!s) return null;
    var n = parseFloat(s);
    return isFinite(n) ? n : null;
  }
  function slug(s) { return String(s).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function titleCase(s) { s = String(s).trim(); return s.charAt(0).toUpperCase() + s.slice(1); }
  function imgUrl(u) { u = String(u || '').trim(); return /^(https?:)?\/\/|^assets\/|^\//.test(u) ? u : 'assets/products/' + u; }
  function shipLabel(s) {
    s = String(s == null ? '' : s).trim();
    if (!s) return '';
    if (/^\d+(\s*[-\u2013to]+\s*\d+)?$/i.test(s)) return 'Ships in ' + s.replace(/\s+/g, '') + ' days';
    if (/^ships?\b/i.test(s)) return titleCase(s);
    return 'Ships in ' + s;
  }

  function fromRows(rows) {
    if (!rows.length) return null;
    var idx = {};
    rows[0].forEach(function (h, i) { idx[String(h).trim().toLowerCase()] = i; });
    if (idx.name === undefined || idx.price === undefined) return null;
    var seen = {}, out = [];
    rows.slice(1).forEach(function (r) {
      var get = function (k) { return idx[k] === undefined ? '' : (r[idx[k]] == null ? '' : String(r[idx[k]]).trim()); };
      var name = get('name'), price = num(get('price'));
      if (!name || price === null || price <= 0) return;
      var sn = num(get('stock')), stock = sn === null ? null : Math.floor(sn);
      var orig = num(get('original_price'));
      var imgs = get('photo').split(/[|\n]+/).map(imgUrl).filter(function (u) { return u !== 'assets/products/'; });
      var catText = get('category') || 'Gifts';
      var k = slug(name) || 'item', base = k, n = 2;
      while (seen[k]) k = base + '-' + (n++);
      seen[k] = 1;
      out.push({
        k: k, n: name, p: price, o: orig && orig > price ? orig : 0,
        stock: stock, soldOut: stock !== null && stock <= 0,
        low: stock !== null && stock > 0 && stock <= (C.lowStockAt || 5) ? stock : 0,
        ship: shipLabel(get('shipping_time')), imgs: imgs, img: imgs[0] || '',
        c: slug(catText) || 'gifts', cl: catText, b: get('badge'), d: get('description')
      });
    });
    return out;
  }

  window.SayoriStore = {
    onChange: function (fn) { listeners.push(fn); if (current) fn(current); }
  };

  fetch('products.csv', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('products.csv not found'); return r.text(); })
    .then(function (t) {
      var list = fromRows(parseCSV(t));
      if (!list) throw new Error('products.csv needs name and price columns');
      current = list;
      listeners.forEach(function (fn) { fn(list); });
    })
    .catch(function (e) { if (window.console) console.error('[Shop] catalogue missing', e); });
})();
