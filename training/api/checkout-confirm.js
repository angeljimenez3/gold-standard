/* GET /api/checkout-confirm?session_id=cs_...
   Called by the members area when a buyer comes back from Stripe. Confirms the
   payment with Stripe, unlocks the track and returns { email, code, tracks }. */

'use strict';

const http = require('./_lib/http');
const pay = require('./_lib/pay');

module.exports = async function handler(req, res) {
  if (http.cors(req, res)) { return; }
  res.setHeader('Cache-Control', 'no-store');
  const id = String((req.query && req.query.session_id) || '');
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) { return res.status(400).json({ ok: false, error: 'session_invalid' }); }
  if (!pay.stripe()) { return res.status(503).json({ ok: false, error: 'payments_not_configured' }); }
  try {
    const r = await pay.fulfill(id);
    return res.status(r.ok ? 200 : 409).json(r);
  } catch (err) {
    console.error('[checkout-confirm]', err && err.message);
    return res.status(502).json({ ok: false, error: 'confirm_failed' });
  }
};
