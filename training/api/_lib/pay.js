/* ============================================================
   Payments: Stripe checkout for the program, member access, and the
   pay links / invoices Hannah sends for one-on-one work.

   Environment variables:
     STRIPE_SECRET_KEY    Hannah's Stripe secret or restricted key (test or live).
     MEMBER_CODE_SECRET   random string; personal access codes are derived from it.
     MEMBER_MASTER_CODE   optional all-access code for Hannah and Angel.
   ============================================================ */

'use strict';

const crypto = require('crypto');
const store = require('./store');
const http = require('./http');

const SITE = 'https://hannahgoldy.com';
const TRACKS = { 'fat-loss': 'Fat Loss', 'lean-muscle': 'Build Muscle', 'fighter': 'Fighter Conditioning' };
const PRICE = { founding: 19700, full: 29700, addon: 17800 }; // cents
const FOUNDING_LIMIT = 100;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I

let client = null;
function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) { return null; }
  if (!client) { client = require('stripe')(key); }
  return client;
}
// Which kind of Stripe key is set (prefix only, never the key), for setup checks.
function keyKind() {
  const k = process.env.STRIPE_SECRET_KEY || '';
  if (!k) { return 'missing'; }
  const m = k.match(/^(sk|rk|pk)_(live|test)_/);
  if (m) { return m[1] + '_' + m[2]; }
  return /^\s|\s$/.test(k) ? 'has_spaces' : /^["']/.test(k) ? 'has_quotes' : 'unrecognized';
}
const testMode = () => /^(sk|rk)_test_/.test(process.env.STRIPE_SECRET_KEY || '');

/* ---------- member access ---------- */

// A buyer's personal code is derived from their email, so it is the same
// everywhere it is shown (checkout return page, email, dashboard) and never stored.
function accessCode(email) {
  const secret = process.env.MEMBER_CODE_SECRET;
  if (!secret) { throw new Error('MEMBER_CODE_SECRET is not set'); }
  const h = crypto.createHmac('sha256', secret).update(String(email).trim().toLowerCase()).digest();
  let s = '';
  for (let i = 0; i < 8; i++) { s += CODE_CHARS[h[i] % CODE_CHARS.length]; }
  return 'GS-' + s.slice(0, 4) + '-' + s.slice(4);
}

function sameText(a, b) {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

const normCode = (c) => String(c || '').trim().toUpperCase().replace(/\s+/g, '');
const accessPath = (email) => 'access/' + store.emailKey(email) + '.json';

// Returns the tracks this email + code unlock, or null.
async function checkLogin(email, code) {
  const master = process.env.MEMBER_MASTER_CODE;
  if (master && sameText(normCode(code), normCode(master))) { return Object.keys(TRACKS); }
  if (!process.env.MEMBER_CODE_SECRET) { return null; }
  if (!sameText(normCode(code), accessCode(email))) { return null; }
  const rec = await store.readJson(accessPath(email));
  return rec && rec.tracks && rec.tracks.length ? rec.tracks : null;
}

async function grant(email, name, track) {
  const p = accessPath(email);
  const rec = (await store.readJson(p)) || { email: email, createdAt: new Date().toISOString(), tracks: [] };
  if (rec.tracks.indexOf(track) === -1) { rec.tracks.push(track); }
  if (name && !rec.name) { rec.name = name; }
  rec.updatedAt = new Date().toISOString();
  await store.writeJson(p, rec);
  return rec;
}

/* ---------- program checkout ---------- */

async function foundingSold() {
  return (await store.listPaths('sales/founding/')).length;
}

async function status() {
  const sold = await foundingSold();
  return {
    open: Boolean(stripe()) && !/^pk_/.test(process.env.STRIPE_SECRET_KEY || '') && Boolean(process.env.MEMBER_CODE_SECRET),
    testMode: testMode(),
    prices: { founding: PRICE.founding / 100, full: PRICE.full / 100, addon: PRICE.addon / 100 },
    foundingLimit: FOUNDING_LIMIT,
    foundingLeft: Math.max(0, FOUNDING_LIMIT - sold),
    keyKind: keyKind()
  };
}

// kind 'track': a new buyer. kind 'addon': a member adding another track at the member price.
async function createCheckout(opts) {
  const s = stripe();
  const track = opts.track;
  let tier, email = null;
  if (opts.kind === 'addon') {
    email = String(opts.email || '').trim().toLowerCase();
    const owned = await checkLogin(email, opts.code);
    if (!owned) { const e = new Error('login_invalid'); e.status = 401; throw e; }
    if (owned.indexOf(track) !== -1) { const e = new Error('already_owned'); e.status = 409; throw e; }
    tier = 'addon';
  } else {
    tier = (await foundingSold()) < FOUNDING_LIMIT ? 'founding' : 'full';
  }
  const meta = { kind: opts.kind === 'addon' ? 'addon' : 'track', track: track, tier: tier };
  const session = await s.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: PRICE[tier],
        product_data: {
          name: 'The Goldy Standard: ' + TRACKS[track],
          description: tier === 'founding' ? 'Founding member price. 12-week program, lifetime access.'
            : tier === 'addon' ? 'Member price for an extra track. 12-week program, lifetime access.'
            : '12-week program, lifetime access.'
        }
      }
    }],
    customer_email: email || undefined,
    metadata: meta,
    payment_intent_data: { metadata: meta, description: 'The Goldy Standard: ' + TRACKS[track] },
    success_url: SITE + '/members/?paid={CHECKOUT_SESSION_ID}',
    cancel_url: opts.kind === 'addon' ? SITE + '/members/#/course/' + track : SITE + '/program/?checkout=canceled'
  });
  return session.url;
}

// Records a paid program purchase and unlocks the track. Safe to run twice
// (the return page and the webhook both call it).
async function fulfill(sessionOrId) {
  const s = typeof sessionOrId === 'string' ? await stripe().checkout.sessions.retrieve(sessionOrId) : sessionOrId;
  const meta = s.metadata || {};
  if (!TRACKS[meta.track] || (meta.kind !== 'track' && meta.kind !== 'addon')) { return { ok: false, error: 'not_a_program_sale' }; }
  if (s.payment_status !== 'paid') { return { ok: false, error: 'not_paid_yet' }; }
  const email = String((s.customer_details && s.customer_details.email) || s.customer_email || '').trim().toLowerCase();
  const name = (s.customer_details && s.customer_details.name) || '';
  if (!http.EMAIL_RE.test(email)) { return { ok: false, error: 'no_email' }; }

  const tier = ['founding', 'full', 'addon'].indexOf(meta.tier) !== -1 ? meta.tier : 'full';
  const salePath = 'sales/' + tier + '/' + s.id + '.json';
  const rec = await grant(email, name, meta.track);
  const code = accessCode(email);

  if (!(await store.readJson(salePath))) {
    await store.writeJson(salePath, {
      sessionId: s.id, email: email, name: name, track: meta.track, trackLabel: TRACKS[meta.track],
      tier: tier, amount: s.amount_total, currency: s.currency, live: s.livemode,
      createdAt: new Date((s.created || Date.now() / 1000) * 1000).toISOString()
    });
    const first = (name || '').split(' ')[0] || 'there';
    await http.sendEmail({
      to: [email],
      from: process.env.PROGRAM_FROM_EMAIL || 'Hannah Goldy <thegoldystandard@hannahgoldy.com>',
      reply_to: 'thegoldystandard@hannahgoldy.com',
      subject: 'Your access to The Goldy Standard',
      text: 'Hey ' + first + ',\n\nYou\'re in. Here is how to get into your ' + TRACKS[meta.track] + ' program:\n\n' +
        '1. Go to ' + SITE + '/members\n2. Log in with this email address and your access code: ' + code + '\n\n' +
        'Keep this email so you have your code on any device. If anything does not work, reply here and I will sort it out.\n\nHannah'
    });
  }
  return { ok: true, email: email, code: code, tracks: rec.tracks, track: meta.track };
}

/* ---------- setup check for the dashboard ---------- */

const WEBHOOK_URL = SITE + '/api/stripe-webhook';
const WEBHOOK_EVENTS = ['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'invoice.paid'];

// Is the key a usable secret key, and does Stripe have our webhook with the right events?
async function setupCheck() {
  const key = process.env.STRIPE_SECRET_KEY || '';
  if (!key) { return { key: 'missing' }; }
  if (/^pk_/.test(key)) { return { key: 'publishable' }; }
  try {
    const list = await stripe().webhookEndpoints.list({ limit: 100 });
    const ep = list.data.find((w) => String(w.url).replace(/\/$/, '') === WEBHOOK_URL);
    if (!ep) { return { key: 'ok', webhook: 'missing' }; }
    const all = (ep.enabled_events || []).indexOf('*') !== -1;
    const missing = all ? [] : WEBHOOK_EVENTS.filter((e) => ep.enabled_events.indexOf(e) === -1);
    return { key: 'ok', webhook: ep.status === 'enabled' ? (missing.length ? 'missing_events' : 'ok') : 'disabled', missingEvents: missing };
  } catch (err) {
    return { key: 'error', message: err && err.message };
  }
}

/* ---------- pay links and invoices for one-on-one work ---------- */

async function createPaymentRequest(r) {
  const s = stripe();
  const amount = Math.round(Number(r.amount) * 100);
  const base = {
    clientName: r.clientName, clientEmail: r.clientEmail || '', description: r.description,
    amount: amount, currency: 'usd', status: 'open', live: !testMode(), createdAt: new Date().toISOString()
  };
  let rec;
  if (r.mode === 'invoice') {
    const found = await s.customers.list({ email: r.clientEmail, limit: 1 });
    const customer = found.data[0] || await s.customers.create({ email: r.clientEmail, name: r.clientName || undefined });
    const inv = await s.invoices.create({
      customer: customer.id, collection_method: 'send_invoice', days_until_due: 7,
      pending_invoice_items_behavior: 'exclude', metadata: { kind: 'one-on-one' }
    });
    await s.invoiceItems.create({ customer: customer.id, invoice: inv.id, amount: amount, currency: 'usd', description: r.description });
    await s.invoices.finalizeInvoice(inv.id);
    const sent = await s.invoices.sendInvoice(inv.id);
    rec = Object.assign(base, { id: inv.id, kind: 'invoice', url: sent.hosted_invoice_url, number: sent.number || '' });
  } else {
    const price = await s.prices.create({ currency: 'usd', unit_amount: amount, product_data: { name: r.description } });
    const link = await s.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      restrictions: { completed_sessions: { limit: 1 } }, // one client, one payment
      metadata: { kind: 'one-on-one' },
      after_completion: { type: 'hosted_confirmation', hosted_confirmation: { custom_message: 'Thank you! Your payment went through. Talk soon, Hannah' } }
    });
    rec = Object.assign(base, { id: link.id, kind: 'link', url: link.url });
  }
  await store.writeJson('payments/' + rec.id + '.json', rec);
  return rec;
}

async function markPaid(id, info) {
  const p = 'payments/' + id + '.json';
  const rec = await store.readJson(p);
  if (!rec || rec.status === 'paid') { return false; }
  await store.writeJson(p, Object.assign(rec, { status: 'paid', paidAt: new Date().toISOString() }, info));
  return true;
}

module.exports = { setupCheck, WEBHOOK_EVENTS, stripe, testMode, TRACKS, PRICE, FOUNDING_LIMIT, accessCode, checkLogin, status, createCheckout, fulfill, createPaymentRequest, markPaid };
