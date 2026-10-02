/* ============================================================
   THE GOLDY STANDARD: Pre-launch teaser
   Poll -> email capture -> confirmation.
   A lead is never silently dropped: if the endpoint is missing
   or fails, we hand the visitor a prefilled email fallback.
   ============================================================ */
(function () {
  'use strict';

  var CFG = window.GS_CONFIG || {};
  var TRACKS = {
    'fat-loss':    'Fat Loss',
    'lean-muscle': 'Build Muscle',
    'fighter':     'Fighter Conditioning'
  };

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Inject config values into copy ---------- */
  $$('[data-spots]').forEach(function (el) { el.textContent = CFG.FOUNDING_SPOTS || 100; });
  $$('[data-price]').forEach(function (el) { el.textContent = CFG.FOUNDING_PRICE || 197; });
  $$('[data-full]').forEach(function (el)  { el.textContent = CFG.FULL_PRICE || 297; });
  var yr = $('#yr'); if (yr) { yr.textContent = new Date().getFullYear(); }
  if (CFG.HOME_URL) { $$('[data-home-link]').forEach(function (a) { a.setAttribute('href', CFG.HOME_URL); }); }

  /* ---------- Sticky header ---------- */
  var hdr = $('.hdr');
  var onScroll = function () {
    if (hdr) { hdr.classList.toggle('stuck', window.scrollY > 40); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Step machine ---------- */
  var steps = {
    1: $('[data-step="1"]'),
    2: $('[data-step="2"]'),
    3: $('[data-step="3"]')
  };
  var chosen = null;

  function show(n) {
    Object.keys(steps).forEach(function (k) {
      if (steps[k]) { steps[k].hidden = (String(k) !== String(n)); }
    });
    var card = $('.claim__card');
    if (card && n !== 1) {
      var top = card.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
    var focusTarget = n === 2 ? $('#fname') : null;
    if (focusTarget) { setTimeout(function () { focusTarget.focus(); }, 420); }
  }

  /* ---------- Poll ---------- */
  $$('.poll__opt').forEach(function (btn) {
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', function () {
      chosen = btn.getAttribute('data-vote');
      $$('.poll__opt').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      $$('[data-chosen]').forEach(function (el) { el.textContent = TRACKS[chosen] || 'your track'; });
      try { localStorage.setItem('gs_track', chosen); } catch (e) {}
      show(2);
    });
  });

  var back = $('.step__back');
  if (back) { back.addEventListener('click', function () { show(1); }); }

  /* ---------- Form ---------- */
  var form   = $('#lead-form');
  var errBox = $('#form-err');
  var submit = $('.form__submit');
  var label  = $('.form__label');

  function showErr(msg) {
    if (!errBox) { return; }
    errBox.textContent = msg;
    errBox.hidden = false;
  }
  function clearErr() { if (errBox) { errBox.hidden = true; } }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function mailtoFallback(payload) {
    var to = CFG.FALLBACK_EMAIL || 'thegoldystandard@hannahgoldy.com';
    var subject = 'Founding member signup: ' + (TRACKS[payload.track] || 'The Goldy Standard');
    var body = 'Name: ' + payload.firstName + '\nEmail: ' + payload.email +
               '\nTrack: ' + (TRACKS[payload.track] || payload.track) + '\n';
    return 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      clearErr();

      var fname = $('#fname');
      var email = $('#email');
      var nameV = (fname.value || '').trim();
      var mailV = (email.value || '').trim();

      fname.setAttribute('aria-invalid', 'false');
      email.setAttribute('aria-invalid', 'false');

      if (!nameV) {
        fname.setAttribute('aria-invalid', 'true');
        showErr('Please add your first name.');
        fname.focus();
        return;
      }
      if (!validEmail(mailV)) {
        email.setAttribute('aria-invalid', 'true');
        showErr('That email address does not look right. Mind checking it?');
        email.focus();
        return;
      }

      var payload = {
        firstName: nameV,
        email: mailV,
        track: chosen || (function () { try { return localStorage.getItem('gs_track'); } catch (e) { return null; } })(),
        trackLabel: null,
        source: CFG.SOURCE_TAG || 'prelaunch-teaser',
        submittedAt: new Date().toISOString()
      };

      payload.trackLabel = TRACKS[payload.track] || null;

      submit.disabled = true;
      if (label) { label.textContent = 'Saving...'; }

      var done = function () {
        try { localStorage.setItem('gs_signed_up', '1'); } catch (e) {}
        show(3);
      };

      var fail = function (reason) {
        submit.disabled = false;
        if (label) { label.textContent = 'Claim My Spot'; }
        console.warn('[GS] Lead capture failed:', reason);
        var href = mailtoFallback(payload);
        showErr('');
        errBox.hidden = false;
        errBox.innerHTML = 'We could not save that automatically. ' +
          '<a href="' + href + '" class="link-gold">Tap here to send it by email instead</a> ' +
          'and you will still get your founding spot.';
      };

      if (!CFG.LEAD_ENDPOINT) {
        fail('LEAD_ENDPOINT is not set in config.js');
        return;
      }

      var ctrl = ('AbortController' in window) ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) { ctrl.abort(); } }, 12000);

      fetch(CFG.LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl ? ctrl.signal : undefined
      })
        .then(function (res) {
          clearTimeout(timer);
          if (!res.ok) { throw new Error('HTTP ' + res.status); }
          done();
        })
        .catch(function (err) {
          clearTimeout(timer);
          fail(err && err.message ? err.message : 'network error');
        });
    });
  }

  /* ---------- Launch: pay for the picked track through Stripe ---------- */
  var SALES = CFG.SALES_OPEN === true || /[?&]sales=preview\b/.test(location.search);
  var CHECKOUT = CFG.CHECKOUT_ENDPOINT || 'https://hannahgoldy.com/api/checkout';
  if (SALES) {
    document.documentElement.classList.add('sales-open');
    $$('[data-cta-label]').forEach(function (el) { el.textContent = 'Get The Program'; });
    var sub = $('[data-presale-sub]');
    if (sub) { sub.innerHTML = 'You picked <strong class="gold" data-chosen>' + (TRACKS[chosen] || 'your track') + '</strong>. Twelve weeks, built to follow on your own schedule.'; }

    var setPrice = function (st) {
      var founding = st.foundingLeft > 0;
      $$('[data-buy-price]').forEach(function (el) { el.textContent = founding ? st.prices.founding : st.prices.full; });
      var was = $('[data-buy-was]');
      if (was) { was.hidden = !founding; was.textContent = '$' + st.prices.full; }
      var note = $('[data-buy-note]');
      if (note) {
        note.textContent = founding
          ? 'Founding price: ' + st.foundingLeft + ' of ' + st.foundingLimit + ' spots left.'
          : 'One payment, lifetime access to your track.';
      }
    };
    fetch(CHECKOUT, { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (st) {
      if (st && st.prices) { setPrice(st); }
    }).catch(function () {});

    var buyBtn = $('#buy-btn'), buyErr = $('#buy-err');
    if (buyBtn) {
      buyBtn.addEventListener('click', function () {
        var track = chosen || (function () { try { return localStorage.getItem('gs_track'); } catch (e) { return null; } })();
        if (!track) { show(1); return; }
        buyBtn.disabled = true;
        if (buyErr) { buyErr.hidden = true; }
        fetch(CHECKOUT, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ track: track, kind: 'track' }) })
          .then(function (r) { return r.json(); })
          .then(function (r) {
            if (r && r.ok && r.url) { window.location.href = r.url; return; }
            throw new Error((r && r.error) || 'checkout');
          })
          .catch(function (e) {
            buyBtn.disabled = false;
            if (buyErr) {
              buyErr.textContent = e.message === 'payments_not_configured'
                ? 'Checkout opens soon. Follow @hannahgoldy for the launch.'
                : 'Checkout did not open. Please try again in a minute.';
              buyErr.hidden = false;
            }
          });
      });
    }
    if (/[?&]checkout=canceled\b/.test(location.search) && buyErr) {
      buyErr.textContent = 'No charge was made. Pick your track whenever you are ready.';
      buyErr.hidden = false;
    }
  }

  /* ---------- Optional countdown ---------- */
  if (CFG.LAUNCH_DATE) {
    var target = new Date(CFG.LAUNCH_DATE).getTime();
    if (!isNaN(target)) {
      var note = $('.hero__note');
      if (note) {
        var cd = document.createElement('span');
        cd.className = 'hero__cd';
        note.appendChild(document.createElement('br'));
        note.appendChild(cd);
        var tick = function () {
          var diff = target - Date.now();
          if (diff <= 0) { cd.textContent = 'Doors are open.'; return; }
          var d = Math.floor(diff / 864e5);
          var h = Math.floor(diff % 864e5 / 36e5);
          var m = Math.floor(diff % 36e5 / 6e4);
          cd.textContent = 'Opens in ' + d + 'd ' + h + 'h ' + m + 'm.';
        };
        tick();
        setInterval(tick, 30000);
      }
    }
  }
})();
