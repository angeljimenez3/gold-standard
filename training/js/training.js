/* ============================================================
   HANNAH GOLDY — Orlando personal training
   Booking links, call/text buttons, enquiry form.
   An enquiry is never silently dropped.
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.HG_CONFIG || {};
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var yr = $('#yr'); if (yr) { yr.textContent = new Date().getFullYear(); }

  /* ---------- Sticky header ---------- */
  var hdr = $('.hdr');
  var onScroll = function () { if (hdr) { hdr.classList.toggle('stuck', window.scrollY > 40); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Program link + "spots full" state ---------- */
  $$('[data-program-link]').forEach(function (a) { if (CFG.PROGRAM_URL) { a.setAttribute('href', CFG.PROGRAM_URL); } });
  if (CFG.ONE_ON_ONE_FULL) {
    $$('[data-full-note]').forEach(function (n) { n.hidden = false; });
    $$('[data-book]').forEach(function (a) { if (/free call/i.test(a.textContent)) { a.textContent = 'Join The Waitlist'; } });
  }

  /* ---------- Booking links ----------
     If a real calendar URL exists, send people straight there.
     Otherwise every "book" button scrolls to the enquiry form. */
  if (CFG.BOOKING_URL) {
    $$('[data-book]').forEach(function (a) {
      a.setAttribute('href', CFG.BOOKING_URL);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  } else {
    $$('[data-book]').forEach(function (a) {
      a.setAttribute('href', '#enquiry');
    });
  }

  /* ---------- Call / text buttons ---------- */
  var callBtn = $('[data-call]');
  var textBtn = $('[data-text]');
  if (CFG.PHONE) {
    if (callBtn) { callBtn.hidden = false; callBtn.setAttribute('href', 'tel:' + CFG.PHONE); }
    if (textBtn) { textBtn.hidden = false; textBtn.setAttribute('href', 'sms:' + CFG.PHONE); }
  }

  /* ---------- Booking card layout ----------
     Without a calendar link, "Book A Call" would just scroll to the form sitting
     directly below it, under an "or send me a message" divider. Hide both so the
     form reads as the booking step. Hide the actions row if nothing is left in it. */
  if (!CFG.BOOKING_URL) {
    var primary = $('[data-book-primary]');
    if (primary) { primary.hidden = true; }
  }
  var acts = $('.book__actions');
  var orDiv = $('.book__or');
  var anyAction = acts && $$('a', acts).some(function (a) { return !a.hidden; });
  if (acts && !anyAction) { acts.hidden = true; }
  if (orDiv && !anyAction) { orDiv.hidden = true; }

  /* ---------- Enquiry form ---------- */
  var form   = $('#enquiry');
  var errBox = $('#form-err');
  var submit = $('.form__submit');
  var label  = $('.form__label');
  var done   = $('.book__done');

  function showErr(html) {
    if (!errBox) { return; }
    errBox.innerHTML = html;
    errBox.hidden = false;
  }
  function clearErr() { if (errBox) { errBox.hidden = true; } }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  function mailtoFallback(p) {
    var to = CFG.EMAIL || 'hannahgoldy@hannahgoldy.com';
    var body = 'Name: ' + p.name + '\nEmail: ' + p.email +
               '\nPhone: ' + (p.phone || '-') +
               '\nInterested in: ' + p.goal +
               '\n\n' + (p.message || '');
    return 'mailto:' + to + '?subject=' + encodeURIComponent('Training enquiry from ' + p.name) +
           '&body=' + encodeURIComponent(body);
  }

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      clearErr();

      var f = {
        name:  $('#name'), email: $('#email'), phone: $('#phone'),
        goal:  $('#goal'), msg:   $('#msg')
      };
      Object.keys(f).forEach(function (k) { if (f[k]) { f[k].setAttribute('aria-invalid', 'false'); } });

      var nameV = (f.name.value || '').trim();
      var mailV = (f.email.value || '').trim();
      var goalV = f.goal.value;

      if (!nameV) { f.name.setAttribute('aria-invalid','true'); showErr('Please add your name.'); f.name.focus(); return; }
      if (!validEmail(mailV)) { f.email.setAttribute('aria-invalid','true'); showErr('That email address does not look right. Mind checking it?'); f.email.focus(); return; }
      var phoneDigits = (f.phone.value || '').replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 15) { f.phone.setAttribute('aria-invalid','true'); showErr('Please add your phone number so I can call or text you back.'); f.phone.focus(); return; }
      if (!goalV) { f.goal.setAttribute('aria-invalid','true'); showErr('Let me know what you are after so I can point you the right way.'); f.goal.focus(); return; }

      var payload = {
        name: nameV, email: mailV,
        phone: (f.phone.value || '').trim(),
        goal: goalV,
        message: (f.msg.value || '').trim(),
        company: ($('#company') || {}).value || '',
        source: CFG.SOURCE_TAG || 'orlando-pt',
        submittedAt: new Date().toISOString()
      };

      submit.disabled = true;
      if (label) { label.textContent = 'Sending...'; }

      var succeed = function () {
        var n = $('[data-name]'); if (n) { n.textContent = nameV.split(' ')[0]; }
        form.hidden = true;
        var or = $('.book__or'), acts = $('.book__actions'), sub = $('.book__sub');
        [or, acts, sub].forEach(function (el) { if (el) { el.hidden = true; } });
        if (done) { done.hidden = false; }
        if (done) { done.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      };

      var fail = function (why) {
        submit.disabled = false;
        if (label) { label.textContent = 'Send It'; }
        console.warn('[HG] Enquiry failed:', why);
        showErr('That did not send automatically. ' +
                '<a href="' + mailtoFallback(payload) + '" class="link-gold">Tap here to send it by email instead</a> ' +
                'and it will reach me either way.');
      };

      if (!CFG.LEAD_ENDPOINT) { fail('LEAD_ENDPOINT not set in config.js'); return; }

      var ctrl = ('AbortController' in window) ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) { ctrl.abort(); } }, 12000);

      fetch(CFG.LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl ? ctrl.signal : undefined
      })
        .then(function (res) { clearTimeout(timer); if (!res.ok) { throw new Error('HTTP ' + res.status); } succeed(); })
        .catch(function (e) { clearTimeout(timer); fail(e && e.message ? e.message : 'network error'); });
    });
  }
})();
