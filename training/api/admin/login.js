/* POST /api/admin/login { password } -> session cookie for the dashboard. */

'use strict';

const auth = require('../_lib/auth');
const http = require('../_lib/http');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  if (!auth.configured()) {
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }
  const b = http.body(req) || {};
  if (!auth.passwordMatches(b.password)) {
    await new Promise((r) => setTimeout(r, 800)); // slows down guessing
    return res.status(401).json({ ok: false, error: 'wrong_password' });
  }
  res.setHeader('Set-Cookie', auth.sessionCookie());
  return res.status(200).json({ ok: true });
};
