/* POST /api/member-login { email, code } -> { ok, tracks }
   Checks a member's personal access code (or the master code) on the server,
   so no codes sit in the public members-area files. */

'use strict';

const http = require('./_lib/http');
const pay = require('./_lib/pay');

module.exports = async function handler(req, res) {
  if (http.cors(req, res)) { return; }
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  const b = http.body(req) || {};
  const email = http.oneLine(b.email, 200).toLowerCase();
  if (!http.EMAIL_RE.test(email) || !b.code) { return res.status(400).json({ ok: false, error: 'missing_fields' }); }
  try {
    const tracks = await pay.checkLogin(email, b.code);
    if (!tracks) {
      await new Promise((r) => setTimeout(r, 600)); // slows down guessing
      return res.status(401).json({ ok: false, error: 'code_invalid' });
    }
    return res.status(200).json({ ok: true, tracks: tracks });
  } catch (err) {
    console.error('[member-login]', err && err.message);
    return res.status(500).json({ ok: false, error: 'login_failed' });
  }
};
