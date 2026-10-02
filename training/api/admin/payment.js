/* POST /api/admin/payment  (dashboard login required)
   { mode: 'link' | 'invoice', clientName, clientEmail, description, amount }
   -> a Stripe pay link to text the client, or an invoice Stripe emails them. */

'use strict';

const auth = require('../_lib/auth');
const http = require('../_lib/http');
const pay = require('../_lib/pay');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!auth.isLoggedIn(req)) { return res.status(401).json({ ok: false, error: 'login_required' }); }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  if (!pay.stripe()) { return res.status(503).json({ ok: false, error: 'Stripe is not connected yet.' }); }

  const b = http.body(req) || {};
  const r = {
    mode: b.mode === 'invoice' ? 'invoice' : 'link',
    clientName: http.oneLine(b.clientName, 80),
    clientEmail: http.oneLine(b.clientEmail, 200).toLowerCase(),
    description: http.oneLine(b.description, 120),
    amount: Number(b.amount)
  };
  if (!r.description) { return res.status(400).json({ ok: false, error: 'Add what the payment is for.' }); }
  if (!(r.amount >= 1 && r.amount <= 20000)) { return res.status(400).json({ ok: false, error: 'Amount must be between $1 and $20,000.' }); }
  if (r.mode === 'invoice' && !http.EMAIL_RE.test(r.clientEmail)) { return res.status(400).json({ ok: false, error: 'An invoice needs the client\'s email.' }); }

  try {
    return res.status(200).json({ ok: true, payment: await pay.createPaymentRequest(r) });
  } catch (err) {
    console.error('[admin/payment]', err && err.message);
    // Stripe's message says what went wrong (for example a missing permission on a restricted key)
    return res.status(502).json({ ok: false, error: 'Stripe said: ' + ((err && err.message) || 'unknown error') });
  }
};
