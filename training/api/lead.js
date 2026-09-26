/* ============================================================
   HANNAH GOLDY: enquiry form to Hannah's inbox
   Vercel serverless function, served at /api/lead.

   Sends each enquiry to Hannah as a formatted email through Resend,
   with the lead's own address as Reply-To, so she just hits reply.

   Environment variables (Vercel > Project > Settings > Environment Variables):
     RESEND_API_KEY   required. From resend.com > API Keys.
     LEAD_TO_EMAIL    required. Where leads go. Comma-separate for more than one.
     LEAD_FROM_EMAIL  optional. Defaults to "Hannah Goldy Website <leads@hannahgoldy.com>".
                      The domain must be verified in Resend first.
   ============================================================ */

'use strict';

const GOALS = [
  'One-on-one training in Orlando',
  'One-on-one training in Dallas',
  'Online coaching',
  'Private jiu-jitsu or MMA',
  'Seminar or group training',
  'Not sure yet'
];

const DEFAULT_FROM = 'Hannah Goldy Website <leads@hannahgoldy.com>';

/* ---------- helpers ---------- */

function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function oneLine(v, max) {
  return String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, max);
}

// Returns { e164, display } or null. US numbers get (407) 555-0123 formatting.
function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return { e164: '+1' + digits, display: '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6) };
  }
  if (digits.length === 11 && digits[0] === '1') {
    const d = digits.slice(1);
    return { e164: '+' + digits, display: '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6) };
  }
  if (digits.length >= 11 && digits.length <= 15) {
    return { e164: '+' + digits, display: '+' + digits };
  }
  return null;
}

function orlandoTime(iso) {
  const d = iso ? new Date(iso) : new Date();
  const when = isNaN(d.getTime()) ? new Date() : d;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit'
  }).format(when);
}

/* ---------- validation ---------- */

function validateLead(body) {
  const name = oneLine(body.name, 100);
  const email = oneLine(body.email, 200).toLowerCase();
  const phone = normalizePhone(body.phone);
  const goal = oneLine(body.goal, 80);
  const message = String(body.message == null ? '' : body.message).trim().slice(0, 2000);

  if (!name) { return { ok: false, error: 'name_required' }; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { return { ok: false, error: 'email_invalid' }; }
  if (!phone) { return { ok: false, error: 'phone_invalid' }; }
  if (GOALS.indexOf(goal) === -1) { return { ok: false, error: 'goal_invalid' }; }

  return {
    ok: true,
    lead: {
      name: name,
      firstName: name.split(' ')[0],
      email: email,
      phone: phone,
      goal: goal,
      message: message,
      sentAt: orlandoTime(body.submittedAt)
    }
  };
}

/* ---------- the email Hannah receives ---------- */

// "wants online coaching", but "isn't sure yet which option fits" for the undecided.
function goalPhrase(goal) {
  if (goal === 'Not sure yet') { return "isn't sure yet which option fits"; }
  if (goal === 'Seminar or group training') { return 'wants a seminar or group training'; }
  return 'wants ' + goal.charAt(0).toLowerCase() + goal.slice(1);
}

function renderLeadEmail(lead) {
  const first = esc(lead.firstName);
  const phrase = goalPhrase(lead.goal);
  const rows = [
    ['Phone', '<a href="tel:' + esc(lead.phone.e164) + '" style="color:#1C2B3A;font-weight:600;text-decoration:none;">' + esc(lead.phone.display) + '</a>'],
    ['Email', '<a href="mailto:' + esc(lead.email) + '" style="color:#1C2B3A;text-decoration:underline;">' + esc(lead.email) + '</a>'],
    ['Wants', esc(lead.goal)],
    ['Sent', esc(lead.sentAt) + ' (Orlando time)']
  ];
  if (lead.message) {
    rows.push(['Their note', esc(lead.message).replace(/\n/g, '<br>')]);
  }

  const rowHtml = rows.map(function (r) {
    return '<tr>' +
      '<td style="padding:12px 0;border-bottom:1px solid #E6E2D6;width:96px;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#7A8594;">' + r[0] + '</td>' +
      '<td style="padding:12px 0;border-bottom:1px solid #E6E2D6;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#1C2B3A;">' + r[1] + '</td>' +
      '</tr>';
  }).join('');

  const button = function (href, label, primary) {
    return '<td style="padding:0 6px 0 0;">' +
      '<a href="' + href + '" style="display:inline-block;padding:14px 22px;border-radius:4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;letter-spacing:.04em;text-decoration:none;' +
      (primary ? 'background:#E8C96A;color:#1C2B3A;border:2px solid #E8C96A;' : 'background:#ffffff;color:#1C2B3A;border:2px solid #1C2B3A;') +
      '">' + label + '</a></td>';
  };

  const html =
'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
'<title>New lead</title></head>' +
'<body style="margin:0;padding:0;background:#F5F4F0;">' +
'<div style="display:none;max-height:0;overflow:hidden;opacity:0;">' + esc(lead.phone.display) + ' &middot; ' + esc(lead.goal) + '</div>' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F4F0;"><tr><td align="center" style="padding:24px 12px;">' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;">' +

  // header bar
  '<tr><td style="background:#1C2B3A;padding:18px 24px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#E8C96A;">' +
  'New training lead</td></tr>' +

  // name + goal
  '<tr><td style="padding:26px 24px 6px;font-family:Arial,Helvetica,sans-serif;">' +
    '<div style="font-size:26px;font-weight:700;line-height:1.2;color:#1C2B3A;">' + esc(lead.name) + '</div>' +
    '<div style="margin-top:6px;font-size:16px;color:#1C2B3A;">' + esc(phrase) + '</div>' +
  '</td></tr>' +

  // action buttons
  '<tr><td style="padding:18px 24px 4px;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
      button('tel:' + esc(lead.phone.e164), 'Call ' + first, true) +
      button('sms:' + esc(lead.phone.e164), 'Text ' + first, false) +
    '</tr></table>' +
  '</td></tr>' +
  '<tr><td style="padding:10px 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#7A8594;">' +
    'Or just hit reply. It goes straight to ' + first + '.' +
  '</td></tr>' +

  // details
  '<tr><td style="padding:14px 24px 26px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + rowHtml + '</table>' +
  '</td></tr>' +

  // footer
  '<tr><td style="background:#F5F4F0;padding:14px 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#7A8594;">' +
    'From the enquiry form on hannahgoldy.com' +
  '</td></tr>' +

'</table></td></tr></table></body></html>';

  const text = [
    'New training lead',
    '',
    lead.name + ' ' + phrase + '.',
    '',
    'Phone: ' + lead.phone.display,
    'Email: ' + lead.email,
    'Sent:  ' + lead.sentAt + ' (Orlando time)',
    lead.message ? '\nTheir note:\n' + lead.message : '',
    '',
    'Hit reply to answer ' + lead.firstName + ' directly.',
    '',
    'From the enquiry form on hannahgoldy.com'
  ].join('\n');

  const subject = oneLine('New lead: ' + lead.name + ' (' + lead.goal + ')', 150);

  return { subject: subject, html: html, text: text };
}

/* ---------- handler ---------- */

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'bad_request' });
  }

  // Honeypot: real people never see this field. Bots fill it. Pretend it worked.
  if (body.company) {
    return res.status(200).json({ ok: true });
  }

  const v = validateLead(body);
  if (!v.ok) {
    return res.status(400).json({ ok: false, error: v.error });
  }

  const key = process.env.RESEND_API_KEY;
  const to = (process.env.LEAD_TO_EMAIL || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  if (!key || !to.length) {
    console.error('[lead] RESEND_API_KEY or LEAD_TO_EMAIL is not set');
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const mail = renderLeadEmail(v.lead);

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || DEFAULT_FROM,
        to: to,
        reply_to: v.lead.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text
      })
    });
    if (!r.ok) {
      console.error('[lead] Resend rejected the email:', r.status, await r.text());
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[lead] Could not reach Resend:', err && err.message);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
}

module.exports = handler;
module.exports.renderLeadEmail = renderLeadEmail;
module.exports.validateLead = validateLead;
module.exports.normalizePhone = normalizePhone;
module.exports.GOALS = GOALS;
