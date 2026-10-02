/* ============================================================
   THE GOLDY STANDARD: program checkout
   GET  /api/checkout  -> { open, prices, foundingLeft, ... } for the program page
   POST /api/checkout  { track, kind: 'track' }                 new buyer
                       { track, kind: 'addon', email, code }    member adding a track
                    -> { url } of Stripe's checkout page
   ============================================================ */

'use strict';

const http = require('./_lib/http');
const pay = require('./_lib/pay');

module.exports = async function handler(req, res) {
  if (http.cors(req, res)) { return; }
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      return res.status(200).json(Object.assign({ ok: true }, await pay.status()));
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ ok: false, error: 'method_not_allowed' });
    }
    const b = http.body(req) || {};
    if (!pay.TRACKS[b.track]) { return res.status(400).json({ ok: false, error: 'track_invalid' }); }
    if (!(await pay.status()).open) { return res.status(503).json({ ok: false, error: 'payments_not_configured' }); }
    const url = await pay.createCheckout({ track: b.track, kind: b.kind === 'addon' ? 'addon' : 'track', email: b.email, code: b.code });
    return res.status(200).json({ ok: true, url: url });
  } catch (err) {
    if (err.status) { return res.status(err.status).json({ ok: false, error: err.message }); }
    console.error('[checkout]', err && err.message);
    return res.status(502).json({ ok: false, error: 'checkout_failed' });
  }
};
