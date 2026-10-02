/* ============================================================
   POST /api/stripe-webhook  (set up in Stripe > Developers > Webhooks)
   Events: checkout.session.completed, checkout.session.async_payment_succeeded, invoice.paid

   The event is never trusted as sent: we fetch it again from Stripe by its id
   with our own key, so a forged request cannot unlock anything.
   ============================================================ */

'use strict';

const http = require('./_lib/http');
const pay = require('./_lib/pay');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { return res.status(405).json({ ok: false }); }
  const b = http.body(req) || {};
  const s = pay.stripe();
  if (!s || !/^evt_[A-Za-z0-9]+$/.test(String(b.id || ''))) { return res.status(400).json({ ok: false }); }

  let ev;
  try { ev = await s.events.retrieve(b.id); } catch (err) { return res.status(400).json({ ok: false, error: 'unknown_event' }); }

  try {
    const obj = ev.data && ev.data.object;
    if (ev.type === 'checkout.session.completed' || ev.type === 'checkout.session.async_payment_succeeded') {
      if (obj.payment_link) {
        const linkId = typeof obj.payment_link === 'string' ? obj.payment_link : obj.payment_link.id;
        if (obj.payment_status === 'paid') {
          await pay.markPaid(linkId, { paidAmount: obj.amount_total, payerEmail: (obj.customer_details && obj.customer_details.email) || '' });
        }
      } else {
        await pay.fulfill(obj);
      }
    } else if (ev.type === 'invoice.paid') {
      await pay.markPaid(obj.id, { paidAmount: obj.amount_paid, payerEmail: obj.customer_email || '' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[stripe-webhook]', ev.type, err && err.message);
    return res.status(500).json({ ok: false }); // Stripe retries
  }
};
