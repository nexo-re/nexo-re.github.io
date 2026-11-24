/* ==========================================================================
   forms.js - checkout + contact forms.
   There is no server: each form validates, then builds an email (customer info
   + bag items) addressed to site-config.js -> business.email and opens it as a
   draft in the visitor's email app. If no app opens, the panel offers
   "Open in Gmail" and "Copy message" so the order is never lost.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.SITE || {}, B = S.business || {}, SH = S.shop || {};
  var NAME = B.name || 'Shop', TO = String(B.email || '').trim();
  var CUR = SH.currency || '$', LOC = SH.locale || 'en-US';

  function $(id) { return document.getElementById(id); }
  function val(form, n) { var el = form.elements[n]; return el ? el.value : ''; }   // never form.name (that is the form's own attribute)
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return CUR + Number(n).toLocaleString(LOC); }

  /* ---------- sanitising: strip control characters, cap lengths, single-line fields lose line breaks ---------- */
  function strip(v) { return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u2028\u2029]/g, ''); }
  function line(v, max) { return strip(v).replace(/\s+/g, ' ').trim().slice(0, max || 120); }
  function para(v, max) { return strip(v).replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, max || 1200); }

  var RE_MAIL = /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/, RE_TEL = /^[+()\d\s.\-]{6,22}$/, RE_ZIP = /^[A-Za-z0-9][A-Za-z0-9 \-]{1,10}$/;

  /* ---------- opening drawers (the drawer engine lives in app.js and is exposed as window.SiteUI) ---------- */
  function whenReady(fn, tries) {
    if (window.SiteUI) return fn(window.SiteUI);
    if ((tries || 0) > 300) return;
    setTimeout(function () { whenReady(fn, (tries || 0) + 1); }, 100);
  }
  function openDrawer(id) {
    whenReady(function (UI) {
      UI.show('menu', false); UI.show('cart', false); UI.show('coDr', false); UI.show('ctDr', false);
      if (id === 'coDr') prepCheckout();
      if (id === 'ctDr') showForm('ct');
      UI.show(id, true);
    });
  }

  /* ---------- error display ---------- */
  function setErr(form, name, msg) {
    var f = form.elements[name]; if (!f) return;
    var box = form.querySelector('[data-err="' + name + '"]');
    if (box) box.textContent = msg || '';
    if (msg) { f.setAttribute('aria-invalid', 'true'); } else { f.removeAttribute('aria-invalid'); }
  }
  function validate(form, rules) {
    var first = null, ok = true;
    Object.keys(rules).forEach(function (name) {
      var f = form.elements[name], msg = rules[name](f);
      setErr(form, name, msg);
      if (msg) { ok = false; if (!first) first = f; }
    });
    if (first) { try { first.focus(); } catch (e) { } }
    return ok;
  }
  function clearErrOnInput(form) {
    form.addEventListener('input', function (e) { var n = e.target && e.target.name; if (n && e.target.getAttribute('aria-invalid')) setErr(form, n, ''); });
    form.addEventListener('change', function (e) { var n = e.target && e.target.name; if (n && e.target.getAttribute('aria-invalid')) setErr(form, n, ''); });
  }
  var req = function (label, min, max) { return function (f) { var v = line(f.value, max || 120); if (!v) return 'Please enter ' + label; if (v.length < (min || 1)) return label.charAt(0).toUpperCase() + label.slice(1) + ' looks too short'; return ''; }; };
  var vMail = function (f) { var v = line(f.value, 160); if (!v) return 'Please enter your email'; return RE_MAIL.test(v) ? '' : 'That email doesn\u2019t look right'; };
  var vTel = function (f) { var v = line(f.value, 30); return !v || RE_TEL.test(v) ? '' : 'Use digits, spaces, + or - only'; };
  var vZip = function (f) { var v = line(f.value, 14); if (!v) return 'Please enter your postal code'; return RE_ZIP.test(v) ? '' : 'That postal code doesn\u2019t look right'; };
  var vAgree = function (f) { return f.checked ? '' : 'Please tick this box to continue'; };

  /* ---------- building + sending the email ---------- */
  function mailtoUrl(subject, body) { return 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body.replace(/\n/g, '\r\n')); }
  function gmailUrl(subject, body) { return 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(TO) + '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); }
  function openMail(url) { var a = document.createElement('a'); a.href = url; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); }
  function copyText(text) {
    function fallback() {
      var t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { } t.remove(); return ok;
    }
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(); });
    return Promise.resolve(fallback());
  }
  function toast(m) { if (window.SiteUI) window.SiteUI.toast(m); }

  function showForm(kind) { $(kind + 'Form').hidden = false; $(kind + 'Done').hidden = true; }
  function showDone(kind, subject, body, opts) {
    var d = $(kind + 'Done'), mail = mailtoUrl(subject, body), gm = gmailUrl(subject, body);
    d.innerHTML =
      '<div class="fd-ic" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z" opacity="0"/><path d="M3 7l9 6 9-6"/><rect x="3" y="5" width="18" height="14" rx="2"/></svg></div>' +
      '<h4>' + esc(opts.title) + '</h4>' +
      '<p class="fd-p">' + esc(opts.text) + '</p>' +
      '<div class="fd-act">' +
        '<a class="b p" href="' + esc(mail) + '" id="' + kind + 'Mail">Open email app</a>' +
        '<a class="b w" href="' + esc(gm) + '" target="_blank" rel="noopener noreferrer">Open in Gmail</a>' +
        '<button class="b w" type="button" id="' + kind + 'Copy">Copy message</button>' +
      '</div>' +
      '<p class="fd-p fd-s">Nothing opened? Copy the message and email it to <b>' + esc(TO) + '</b>.</p>' +
      '<details class="fd-pv"><summary>Preview message</summary><textarea readonly rows="9" aria-label="Message preview"></textarea></details>' +
      '<div class="fd-act fd-end">' + (opts.confirm ? '<button class="b p" type="button" id="' + kind + 'Sent">' + esc(opts.confirm) + '</button>' : '') +
      '<button class="b w" type="button" id="' + kind + 'Edit">Go back and edit</button></div>';
    d.querySelector('textarea').value = body;
    $(kind + 'Copy').onclick = function () { copyText(body).then(function (ok) { toast(ok ? 'Message copied' : 'Couldn\u2019t copy \u2013 select the text in Preview'); }); };
    $(kind + 'Edit').onclick = function () { showForm(kind); };
    var sent = $(kind + 'Sent'); if (sent) sent.onclick = opts.onSent;
    $(kind + 'Form').hidden = true; d.hidden = false;
    var sc = d.closest('.fm-wrap'); if (sc) sc.scrollTop = 0;
  }

  /* ---------- CHECKOUT ---------- */
  function prepCheckout() {
    var items = window.SiteUI ? window.SiteUI.getBag() : [], sum = $('coSum'), total = 0, h = '';
    items.forEach(function (it) { total += it.p * it.q; h += '<li><span>' + esc(it.n) + ' <i>\u00d7 ' + it.q + '</i></span><b>' + money(it.p * it.q) + '</b></li>'; });
    sum.innerHTML = items.length ? '<ul>' + h + '</ul><div class="fs-t"><span>Subtotal</span><b>' + money(total) + '</b></div><p>Shipping and payment details are confirmed by email after we receive your order.</p>' : '<p>Your bag is empty.</p>';
    $('coGo').disabled = !items.length;
    showForm('co');
  }
  function buildOrder(f) {
    var items = window.SiteUI.getBag(), total = 0, L = [];
    L.push('NEW ORDER \u2013 ' + NAME, '');
    L.push('CUSTOMER', 'Name: ' + line(val(f, 'name'), 80), 'Email: ' + line(val(f, 'email'), 160), 'Phone: ' + (line(val(f, 'phone'), 30) || '\u2013'), '');
    L.push('SHIP TO', line(val(f, 'name'), 80), line(val(f, 'addr1'), 120));
    if (line(val(f, 'addr2'), 120)) L.push(line(val(f, 'addr2'), 120));
    L.push(line(val(f, 'city'), 80) + ', ' + line(val(f, 'state'), 80) + ' ' + line(val(f, 'zip'), 14), line(val(f, 'country'), 80), '');
    L.push('ORDER');
    items.forEach(function (it, i) { total += it.p * it.q; L.push((i + 1) + '. ' + it.n + ' x ' + it.q + ' \u2013 ' + money(it.p * it.q)); });
    L.push('', 'Subtotal: ' + money(total), '(Shipping + payment to be confirmed by reply)');
    var note = para(val(f, 'notes'), 600); if (note) L.push('', 'NOTES', note);
    L.push('', '\u2014 sent from ' + location.hostname);
    return { subject: line('New order from ' + line(val(f, 'name'), 60) + ' \u2013 ' + items.length + (items.length === 1 ? ' item' : ' items') + ', ' + money(total), 150), body: L.join('\n'), count: items.length };
  }
  function initCheckout() {
    var f = $('coForm'); if (!f) return;
    clearErrOnInput(f);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!TO) { toast('Orders are not set up yet'); return; }
      if (!window.SiteUI || !window.SiteUI.getBag().length) { toast('Your bag is empty'); return; }
      var ok = validate(f, {
        name: req('your full name', 2, 80), email: vMail, phone: vTel, addr1: req('your street address', 4), city: req('your city', 2, 80),
        state: req('your state or region', 2, 80), zip: vZip, country: req('your country', 2, 80), agree: vAgree
      });
      if (!ok) return;
      var o = buildOrder(f);
      showDone('co', o.subject, o.body, {
        title: 'Your order email is ready',
        text: 'We opened a draft in your email app. Press Send to place your order \u2013 we\u2019ll reply with shipping and payment details.',
        confirm: 'I\u2019ve sent it \u2013 clear my bag',
        onSent: function () { window.SiteUI.clearBag(); window.SiteUI.closeAll(); f.reset(); toast('Thank you! We\u2019ll be in touch soon'); }
      });
      openMail(mailtoUrl(o.subject, o.body));
    });
  }

  /* ---------- CONTACT ---------- */
  function initContact() {
    var f = $('ctForm'); if (!f) return;
    clearErrOnInput(f);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!TO) { toast('Contact is not set up yet'); return; }
      var ok = validate(f, {
        name: req('your name', 2, 80), email: vMail, phone: vTel,
        message: function (x) { var v = para(x.value, 1200); return !v ? 'Please write a message' : v.length < 10 ? 'Please write a little more (10+ characters)' : ''; }, agree: vAgree
      });
      if (!ok) return;
      var topic = line(val(f, 'topic'), 60) || 'Question', msg = para(val(f, 'message'), 1200);
      var L = ['MESSAGE VIA ' + NAME + ' WEBSITE', '', 'Name: ' + line(val(f, 'name'), 80), 'Email: ' + line(val(f, 'email'), 160), 'Phone: ' + (line(val(f, 'phone'), 30) || '\u2013'), 'Topic: ' + topic, '', msg, '', '\u2014 sent from ' + location.hostname];
      var subject = line(topic + ' \u2013 message from ' + line(val(f, 'name'), 60), 150), body = L.join('\n');
      showDone('ct', subject, body, {
        title: 'Your message is ready',
        text: 'We opened a draft in your email app. Press Send and we\u2019ll get back to you soon.',
        confirm: 'I\u2019ve sent it',
        onSent: function () { window.SiteUI.closeAll(); f.reset(); toast('Thanks for getting in touch!'); }
      });
      openMail(mailtoUrl(subject, body));
    });
  }

  /* ---------- wiring ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-open]');
    if (t) { e.preventDefault(); openDrawer(t.getAttribute('data-open')); return; }
    if (e.target.closest && e.target.closest('#co')) { if (window.SiteUI && window.SiteUI.getBag().length) openDrawer('coDr'); }
  });
  initCheckout(); initContact();
  if (location.hash === '#contact') openDrawer('ctDr');
  if (!TO && window.console) console.warn('[Shop] set business.email in site-config.js so checkout and contact forms know where to send.');
})();
