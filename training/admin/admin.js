/* Dashboard (hannahgoldy.com/admin): login, then leads, founding list and members. */

(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var TRACKS = [
    { id: 'fat-loss', name: 'Fat Loss' },
    { id: 'lean-muscle', name: 'Build Muscle' },
    { id: 'fighter', name: 'Fighter Conditioning' }
  ];
  var FOUNDING_SPOTS = 100;
  var WEEK = 7 * 86400000;
  var data = null;

  /* lessons per track, read from the members area so it always matches */
  var lessonCount = {};
  try {
    COURSES.forEach(function (c) {
      lessonCount[c.id] = c.modules.reduce(function (n, m) { return n + m.lessons.length; }, 0);
    });
  } catch (e) { TRACKS.forEach(function (t) { lessonCount[t.id] = 17; }); }

  function esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function fmtDate(iso, withTime) {
    if (!iso) { return ''; }
    var d = new Date(iso);
    if (isNaN(d)) { return ''; }
    var o = { timeZone: 'America/New_York', month: 'short', day: 'numeric' };
    if (d.getFullYear() !== new Date().getFullYear()) { o.year = 'numeric'; }
    if (withTime) { o.hour = 'numeric'; o.minute = '2-digit'; }
    return new Intl.DateTimeFormat('en-US', o).format(d);
  }
  function ago(iso) {
    var ms = Date.now() - new Date(iso).getTime();
    if (!(ms >= 0)) { return ''; }
    var m = Math.round(ms / 60000);
    if (m < 2) { return 'just now'; }
    if (m < 60) { return m + ' min ago'; }
    var h = Math.round(m / 60);
    if (h < 24) { return h + 'h ago'; }
    var d = Math.round(h / 24);
    return d === 1 ? 'yesterday' : d + ' days ago';
  }
  function recent(iso) { return iso && Date.now() - new Date(iso).getTime() < WEEK; }
  function trackName(id) { var t = TRACKS.filter(function (x) { return x.id === id; })[0]; return t ? t.name : ''; }
  function doneIn(member, cid) {
    return Object.keys(member.progress || {}).filter(function (k) { return k.indexOf(cid + ':') === 0; }).length;
  }
  function pct(n, of) { return of ? Math.round((n / of) * 100) : 0; }
  function meter(p) { return '<div class="adm-meter"><span style="width:' + Math.max(0, Math.min(100, p)) + '%"></span></div>'; }
  function money(cents) {
    var d = (Number(cents) || 0) / 100;
    return '$' + d.toLocaleString('en-US', { minimumFractionDigits: d % 1 ? 2 : 0, maximumFractionDigits: 2 });
  }
  var TIER = { founding: 'Founding', full: 'Full price', addon: 'Member add-on' };
  function empty(cols, text) { return '<tr class="adm-empty"><td colspan="' + cols + '">' + esc(text) + '</td></tr>'; }

  /* ---------- views ---------- */
  function show(state) {
    document.querySelectorAll('[data-when]').forEach(function (el) { el.hidden = el.getAttribute('data-when') !== state; });
  }

  function render() {
    var leads = data.leads, signups = data.signups, members = data.members;

    // tiles
    $('#tLeads').textContent = leads.length;
    $('#tLeadsSub').textContent = leads.filter(function (l) { return recent(l.createdAt); }).length + ' in the last 7 days';
    var f = signups.length;
    $('#tFound').textContent = f;
    $('#tFoundMeter').style.width = Math.min(100, pct(f, FOUNDING_SPOTS)) + '%';
    $('#tFoundMeterWrap').setAttribute('aria-label', f + ' of ' + FOUNDING_SPOTS + ' founding spots taken');
    $('#tFoundSub').textContent = f >= FOUNDING_SPOTS ? 'All founding spots are taken' : (FOUNDING_SPOTS - f) + ' founding spots left';
    $('#tMembers').textContent = members.length;
    var lessonsDone = members.reduce(function (n, m) { return n + Object.keys(m.progress || {}).length; }, 0);
    $('#tMembersSub').textContent = members.filter(function (m) { return recent(m.lastSeen); }).length + ' active this week, ' + lessonsDone + (lessonsDone === 1 ? ' lesson done' : ' lessons done');

    var sales = data.sales || [], payments = data.payments || [], st = data.stripe || {};
    $('#tSales').textContent = money(sales.reduce(function (n, s) { return n + (s.amount || 0); }, 0));
    $('#tSalesSub').textContent = sales.length + (sales.length === 1 ? ' sale' : ' sales') +
      (st.foundingLimit ? ', ' + st.foundingLeft + ' of ' + st.foundingLimit + ' founding spots left' : '');
    // Stripe setup problems, in the order they need fixing
    var setup = st.setup || {}, warn = '';
    if (!st.connected || setup.key === 'missing') { warn = 'Stripe not connected'; }
    else if (setup.key === 'publishable') { warn = 'Stripe: use the secret key (sk_), not the publishable one'; }
    else if (setup.key === 'error') { warn = 'Stripe key problem: ' + (setup.message || 'check the key'); }
    else if (setup.webhook === 'missing') { warn = 'Stripe webhook not set up'; }
    else if (setup.webhook === 'disabled') { warn = 'Stripe webhook is disabled'; }
    else if (setup.webhook === 'missing_events') { warn = 'Webhook missing: ' + (setup.missingEvents || []).join(', '); }
    else if (st.testMode) { warn = 'Stripe test mode'; }
    var badge = $('#stripeBadge');
    badge.hidden = !warn;
    badge.textContent = warn;

    // payment requests (pay links and invoices)
    $('#payRows').innerHTML = payments.length ? payments.map(function (p) {
      var paid = p.status === 'paid';
      return '<tr><td class="nowrap">' + esc(fmtDate(p.createdAt)) + '</td>' +
        '<td>' + esc(p.clientName || p.clientEmail || p.payerEmail || '') + '</td>' +
        '<td>' + esc(p.description) + '</td>' +
        '<td class="num">' + esc(money(p.amount)) + '</td>' +
        '<td>' + (p.kind === 'invoice' ? 'Invoice' : 'Pay link') + (p.live === false ? ' (test)' : '') + '</td>' +
        '<td><span class="adm-status adm-status--' + (paid ? 'paid' : 'open') + '">' + (paid ? 'Paid ' + esc(fmtDate(p.paidAt)) : 'Unpaid') + '</span></td>' +
        '<td class="nowrap">' + (p.url && !paid ? '<button class="adm-copy" type="button" data-copy="' + esc(p.url) + '">Copy link</button>' : '') + '</td></tr>';
    }).join('') : empty(7, 'No payment requests yet. Create one above and it shows here until it is paid.');

    // program sales
    $('#saleRows').innerHTML = sales.length ? sales.map(function (s) {
      return '<tr><td class="nowrap">' + esc(fmtDate(s.createdAt, true)) + '</td>' +
        '<td>' + esc(s.name ? s.name + ' ' : '') + '<a href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a></td>' +
        '<td class="nowrap">' + esc(s.trackLabel || trackName(s.track)) + '</td>' +
        '<td class="nowrap">' + esc(TIER[s.tier] || '') + (s.live === false ? ' (test)' : '') + '</td>' +
        '<td class="num">' + esc(money(s.amount)) + '</td>' +
        '<td><span class="adm-code">' + esc(s.code || '') + '</span></td></tr>';
    }).join('') : empty(6, 'No program sales yet.');

    // founding list picks: one gold series, values in text ink
    var picks = TRACKS.map(function (t) {
      return { name: t.name, n: signups.filter(function (s) { return s.track === t.id; }).length };
    });
    var none = signups.filter(function (s) { return !s.track; }).length;
    if (none) { picks.push({ name: 'Did not pick', n: none }); }
    var max = Math.max.apply(null, picks.map(function (p) { return p.n; }).concat([1]));
    $('#picks').innerHTML = f ? picks.map(function (p) {
      return '<div class="adm-bar" title="' + esc(p.name + ': ' + p.n + ' of ' + f + ' (' + pct(p.n, f) + '%)') + '">' +
        '<span class="adm-bar__name">' + esc(p.name) + '</span>' +
        '<span class="adm-bar__track"><span class="adm-bar__fill" style="width:' + pct(p.n, max) + '%"></span></span>' +
        '<span class="adm-bar__val">' + p.n + ' <span>' + pct(p.n, f) + '%</span></span></div>';
    }).join('') : '<p class="adm-muted">No signups yet. Picks show up here as people join the founding list.</p>';

    // course progress by track
    $('#courseRows').innerHTML = TRACKS.map(function (t) {
      var withAccess = members.filter(function (m) { return (m.tracks || []).indexOf(t.id) !== -1; });
      var total = lessonCount[t.id] || 17;
      var started = withAccess.filter(function (m) { return doneIn(m, t.id) > 0; }).length;
      var finished = withAccess.filter(function (m) { return doneIn(m, t.id) >= total; }).length;
      var avg = withAccess.length ? Math.round(withAccess.reduce(function (n, m) { return n + pct(doneIn(m, t.id), total); }, 0) / withAccess.length) : 0;
      return '<tr><td class="nowrap">' + esc(t.name) + '</td><td class="num">' + withAccess.length + '</td><td class="num">' + started +
        '</td><td class="num">' + finished + '</td><td><div class="adm-mini">' + meter(avg) + '<b>' + avg + '%</b></div></td></tr>';
    }).join('');

    // training leads
    $('#leadRows').innerHTML = leads.length ? leads.map(function (l) {
      return '<tr><td class="nowrap">' + esc(fmtDate(l.createdAt, true)) + '</td>' +
        '<td class="nowrap">' + esc(l.name) + '</td>' +
        '<td>' + esc(l.goal) + '</td>' +
        '<td class="nowrap"><a href="tel:' + esc(l.phoneE164 || l.phone) + '">' + esc(l.phone) + '</a></td>' +
        '<td><a href="mailto:' + esc(l.email) + '">' + esc(l.email) + '</a></td>' +
        '<td class="note">' + esc(l.message || '') + '</td></tr>';
    }).join('') : empty(6, 'No training leads yet. They land here the moment someone sends the form on /training.');

    // founding list
    $('#signupRows').innerHTML = signups.length ? signups.map(function (s) {
      return '<tr><td class="nowrap">' + esc(fmtDate(s.createdAt, true)) + '</td><td>' + esc(s.firstName) + '</td>' +
        '<td><a href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a></td><td>' + esc(s.trackLabel || trackName(s.track) || 'Did not pick') + '</td></tr>';
    }).join('') : empty(4, 'Nobody on the founding list yet.');

    // members
    $('#memberRows').innerHTML = members.length ? members.map(function (m) {
      var tracks = (m.tracks || []);
      var prog = tracks.map(function (id) {
        var total = lessonCount[id] || 17, n = doneIn(m, id);
        return '<div class="adm-prog__row" title="' + esc(trackName(id) + ': ' + n + ' of ' + total + ' lessons') + '"><span>' +
          esc(trackName(id).split(' ')[0]) + ' ' + n + '/' + total + '</span>' + meter(pct(n, total)) + '</div>';
      }).join('');
      return '<tr><td><a href="mailto:' + esc(m.email) + '">' + esc(m.email) + '</a></td>' +
        '<td>' + (tracks.map(function (id) { return '<span class="adm-tag">' + esc(trackName(id)) + '</span>'; }).join('') || '<span class="adm-muted">None</span>') + '</td>' +
        '<td><div class="adm-prog">' + (prog || '<span class="adm-muted">No lessons yet</span>') + '</div></td>' +
        '<td class="num">' + (m.visits || 0) + '</td>' +
        '<td class="nowrap" title="' + esc(fmtDate(m.lastSeen, true)) + '">' + esc(ago(m.lastSeen)) + '</td>' +
        '<td class="nowrap">' + esc(fmtDate(m.firstSeen)) + '</td></tr>';
    }).join('') : empty(6, 'No member activity yet.');

    $('#updated').textContent = 'Updated ' + fmtDate(data.generatedAt, true);
    contactList = buildContacts();
    renderContacts();
  }

  /* ---------- contacts: everyone in one list, one row per email ---------- */
  var contactList = [];
  function buildContacts() {
    var map = {};
    function add(email, info, tag, when) {
      email = String(email || '').trim().toLowerCase();
      if (!email) { return; }
      var c = map[email] || (map[email] = { email: email, name: '', phone: '', phoneE164: '', tags: [], notes: [], first: '', last: '' });
      if (info.name && (!c.name || info.name.length > c.name.length)) { c.name = info.name; }
      if (info.phone && !c.phone) { c.phone = info.phone; c.phoneE164 = info.phoneE164 || ''; }
      if (c.tags.indexOf(tag) === -1) { c.tags.push(tag); }
      if (info.note && c.notes.indexOf(info.note) === -1) { c.notes.push(info.note); }
      if (when) {
        if (!c.first || when < c.first) { c.first = when; }
        if (!c.last || when > c.last) { c.last = when; }
      }
    }
    // the two website forms: /training enquiries and the /program founding-list signup
    data.leads.forEach(function (l) {
      add(l.email, { name: l.name, phone: l.phone, phoneE164: l.phoneE164, note: 'Wants ' + l.goal + (l.message ? ': "' + l.message + '"' : '') }, 'Training form', l.createdAt);
    });
    data.signups.forEach(function (s) {
      add(s.email, { name: s.firstName, note: 'Founding list, picked ' + (s.trackLabel || trackName(s.track) || 'no program yet') }, 'Program signup', s.createdAt);
    });
    return Object.keys(map).map(function (k) { return map[k]; })
      .sort(function (a, b) { return String(b.last).localeCompare(String(a.last)); });
  }
  function visibleContacts() {
    var q = $('#cSearch').value.trim().toLowerCase(), digits = q.replace(/\D/g, ''), tag = $('#cFilter').value;
    return contactList.filter(function (c) {
      if (tag && c.tags.indexOf(tag) === -1) { return false; }
      if (!q) { return true; }
      return c.name.toLowerCase().indexOf(q) !== -1 || c.email.indexOf(q) !== -1 ||
        (digits.length >= 3 && c.phone.replace(/\D/g, '').indexOf(digits) !== -1);
    });
  }
  function renderContacts() {
    var rows = visibleContacts();
    $('#cCount').textContent = '(' + rows.length + (rows.length === contactList.length ? '' : ' of ' + contactList.length) + ')';
    $('#contactRows').innerHTML = rows.length ? rows.map(function (c) {
      var tel = c.phoneE164 || c.phone;
      return '<tr><td class="nowrap">' + esc(c.name || '') + '</td>' +
        '<td><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></td>' +
        '<td class="nowrap">' + (c.phone ? '<a href="tel:' + esc(tel) + '">' + esc(c.phone) + '</a><a class="adm-sms" href="sms:' + esc(tel) + '">Text</a>' : '') + '</td>' +
        '<td>' + c.tags.map(function (t) { return '<span class="adm-tag">' + esc(t) + '</span>'; }).join('') + '</td>' +
        '<td class="nowrap" title="' + esc(fmtDate(c.last, true)) + '">' + esc(ago(c.last)) + '</td>' +
        '<td class="note">' + esc(c.notes.join('\n')) + '</td></tr>';
    }).join('') : empty(6, contactList.length ? 'Nobody matches that search.' : 'No contacts yet. They show up here as people use the forms.');
  }
  $('#cSearch').addEventListener('input', function () { if (data) { renderContacts(); } });
  $('#cFilter').addEventListener('change', function () { if (data) { renderContacts(); } });

  /* ---------- data ---------- */
  function load() {
    var btn = $('#refresh');
    btn.disabled = true;
    return fetch('/api/admin/data', { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) {
        if (r.status === 401) { show('out'); return null; }
        return r.json().then(function (j) { if (!j.ok) { throw new Error(j.error || 'HTTP ' + r.status); } return j; });
      })
      .then(function (j) {
        if (!j) { return; }
        data = j;
        $('#loadErr').hidden = true;
        show('in');
        render();
      })
      .catch(function (e) {
        show('in');
        $('#loadErr').textContent = 'Could not load the data (' + e.message + '). Try Refresh in a minute.';
        $('#loadErr').hidden = false;
      })
      .then(function () { btn.disabled = false; });
  }

  /* ---------- CSV ---------- */
  function cell(v) {
    var s = String(v == null ? '' : v);
    if (/^[=+\-@]/.test(s)) { s = "'" + s; } // keeps spreadsheets from running it as a formula
    return '"' + s.replace(/"/g, '""') + '"';
  }
  function csv(kind) {
    if (!data) { return; }
    var rows;
    if (kind === 'leads') {
      rows = [['Date', 'Name', 'Wants', 'Phone', 'Email', 'Note']].concat(data.leads.map(function (l) {
        return [l.createdAt, l.name, l.goal, l.phone, l.email, l.message];
      }));
    } else if (kind === 'signups') {
      rows = [['Date', 'First name', 'Email', 'Program']].concat(data.signups.map(function (s) {
        return [s.createdAt, s.firstName, s.email, s.trackLabel || trackName(s.track)];
      }));
    } else if (kind === 'contacts') {
      rows = [['Name', 'Email', 'Phone', 'Form', 'First sent', 'Latest', 'What they said']].concat(contactList.map(function (c) {
        return [c.name, c.email, c.phone, c.tags.join(' + '), c.first, c.last, c.notes.join(' | ')];
      }));
    } else if (kind === 'sales') {
      rows = [['Date', 'Name', 'Email', 'Track', 'Price', 'Paid', 'Access code']].concat((data.sales || []).map(function (s) {
        return [s.createdAt, s.name, s.email, s.trackLabel || trackName(s.track), TIER[s.tier] || s.tier, (s.amount || 0) / 100, s.code];
      }));
    } else {
      rows = [['Email', 'Tracks', 'Lessons done', 'Visits', 'Last active', 'Joined']].concat(data.members.map(function (m) {
        return [m.email, (m.tracks || []).map(trackName).join(' + '), Object.keys(m.progress || {}).length, m.visits || 0, m.lastSeen, m.firstSeen];
      }));
    }
    var blob = new Blob([rows.map(function (r) { return r.map(cell).join(','); }).join('\r\n')], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'hannah-' + kind + '-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ---------- wiring ---------- */
  $('#loginForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var btn = $('#loginBtn'), err = $('#loginErr');
    btn.disabled = true; err.hidden = true;
    fetch('/api/admin/login', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: $('#pw').value })
    })
      .then(function (r) {
        if (r.ok) { $('#pw').value = ''; return load(); }
        err.textContent = r.status === 503
          ? 'The dashboard password has not been set up yet.'
          : 'That password is not right.';
        err.hidden = false;
      })
      .catch(function () { err.textContent = 'Could not reach the server. Check your connection.'; err.hidden = false; })
      .then(function () { btn.disabled = false; });
  });
  $('#logout').addEventListener('click', function () {
    fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' }).then(function () { data = null; show('out'); });
  });
  $('#refresh').addEventListener('click', load);

  /* ---------- request a payment ---------- */
  var payMode = 'link';
  document.querySelectorAll('#payForm [data-mode]').forEach(function (b) {
    b.addEventListener('click', function () { payMode = b.getAttribute('data-mode'); });
  });
  $('#payForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var err = $('#payErr'), btns = document.querySelectorAll('#payForm [data-mode]');
    var body = {
      mode: payMode,
      clientName: $('#pName').value.trim(),
      clientEmail: $('#pEmail').value.trim(),
      description: $('#pDesc').value.trim(),
      amount: $('#pAmount').value
    };
    err.hidden = true;
    if (!body.description) { err.textContent = 'Add what the payment is for.'; err.hidden = false; return; }
    if (!(Number(body.amount) >= 1)) { err.textContent = 'Add the amount in dollars.'; err.hidden = false; return; }
    if (payMode === 'invoice' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.clientEmail)) {
      err.textContent = 'An invoice needs the client\'s email.'; err.hidden = false; return;
    }
    btns.forEach(function (b) { b.disabled = true; });
    fetch('/api/admin/payment', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (!r.ok) { throw new Error(r.error || 'Could not create it.'); }
        var p = r.payment;
        $('#payOutK').textContent = p.kind === 'invoice'
          ? 'Invoice emailed to ' + p.clientEmail + ' for ' + money(p.amount) + '. This is the same page they got:'
          : 'Pay link for ' + money(p.amount) + ' is ready. Send it to ' + (p.clientName || 'your client') + ':';
        $('#payOutUrl').value = p.url;
        $('#payText').href = 'sms:?&body=' + encodeURIComponent('Here is the link to pay for ' + p.description + ': ' + p.url);
        $('#payOut').hidden = false;
        $('#payForm').reset();
        return load();
      })
      .catch(function (e) { err.textContent = e.message; err.hidden = false; })
      .then(function () { btns.forEach(function (b) { b.disabled = false; }); });
  });
  function copyText(text, btn) {
    var done = function () { var t = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = t; }, 1500); };
    if (navigator.clipboard) { navigator.clipboard.writeText(text).then(done).catch(function () {}); }
  }
  $('#payCopy').addEventListener('click', function () { copyText($('#payOutUrl').value, $('#payCopy')); });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (b) { copyText(b.getAttribute('data-copy'), b); }
  });
  document.querySelectorAll('[data-csv]').forEach(function (b) {
    b.addEventListener('click', function () { csv(b.getAttribute('data-csv')); });
  });

  load();
})();
