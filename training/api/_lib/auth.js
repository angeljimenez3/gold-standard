/* Dashboard login: one password (ADMIN_PASSWORD env var), signed session cookie.
   Changing ADMIN_PASSWORD logs every open session out. */

'use strict';

const crypto = require('crypto');

const COOKIE = 'hg_admin';
const DAYS = 30;

function secret() {
  const pw = process.env.ADMIN_PASSWORD || '';
  return pw ? crypto.createHash('sha256').update('hg-admin-v1|' + pw).digest() : null;
}

function sign(exp) {
  return crypto.createHmac('sha256', secret()).update(String(exp)).digest('hex');
}

function passwordMatches(given) {
  const pw = process.env.ADMIN_PASSWORD || '';
  if (!pw) { return false; }
  const a = crypto.createHash('sha256').update(String(given || '')).digest();
  const b = crypto.createHash('sha256').update(pw).digest();
  return crypto.timingSafeEqual(a, b);
}

function sessionCookie() {
  const exp = Date.now() + DAYS * 86400000;
  return COOKIE + '=' + exp + '.' + sign(exp) +
    '; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=' + (DAYS * 86400);
}

function clearCookie() {
  return COOKIE + '=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0';
}

function isLoggedIn(req) {
  if (!secret()) { return false; }
  const raw = String(req.headers.cookie || '').split(/;\s*/).find((c) => c.indexOf(COOKIE + '=') === 0);
  if (!raw) { return false; }
  const [exp, mac] = raw.slice(COOKIE.length + 1).split('.');
  if (!exp || !mac || Number(exp) < Date.now()) { return false; }
  const want = Buffer.from(sign(exp));
  const got = Buffer.from(mac);
  return want.length === got.length && crypto.timingSafeEqual(want, got);
}

module.exports = { passwordMatches, sessionCookie, clearCookie, isLoggedIn, configured: () => Boolean(secret()) };
