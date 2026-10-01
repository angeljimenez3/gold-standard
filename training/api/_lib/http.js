/* Small helpers shared by the API functions. */

'use strict';

// Sites allowed to post from another origin. hannahgoldy.com itself is same-origin.
const ALLOWED_ORIGINS = [
  'https://hannahgoldy.com',
  'https://www.hannahgoldy.com',
  'https://gold-standard-prelaunch.vercel.app',
  'https://gold-standard-beta.vercel.app'
];

// Sets CORS headers. Returns true when the request was a preflight and is already answered.
function cors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.indexOf(origin) !== -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  if (req.method === 'OPTIONS') { res.status(204).end(); return true; }
  return false;
}

// Accepts a parsed object or a JSON string (text/plain posts arrive as strings).
function body(req) {
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = null; } }
  return b && typeof b === 'object' ? b : null;
}

function oneLine(v, max) {
  return String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, max);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Sends one email through Resend. Resolves true on success, false when Resend
// is not set up or rejects it. Never throws.
async function sendEmail(msg) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !msg.to || !msg.to.length) { return false; }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ from: process.env.LEAD_FROM_EMAIL || 'Hannah Goldy Website <leads@hannahgoldy.com>' }, msg))
    });
    if (!r.ok) { console.error('[email] Resend rejected:', r.status, await r.text()); }
    return r.ok;
  } catch (err) {
    console.error('[email] Could not reach Resend:', err && err.message);
    return false;
  }
}

function listEnv(name) {
  return (process.env[name] || '').split(',').map((s) => s.trim()).filter(Boolean);
}

module.exports = { cors, body, oneLine, EMAIL_RE, sendEmail, listEnv };
