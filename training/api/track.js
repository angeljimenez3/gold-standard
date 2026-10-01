/* ============================================================
   THE GOLDY STANDARD: member progress for the dashboard
   Served at /api/track. The members area posts a snapshot of a member's
   progress when they open it and after they finish a lesson:
     { email, tracks, progress: { "fat-loss:3": <time>, ... }, last, event }
   Each member has one record that is overwritten with the newest snapshot.
   ============================================================ */

'use strict';

const store = require('./_lib/store');
const http = require('./_lib/http');

const TRACK_IDS = ['fat-loss', 'lean-muscle', 'fighter'];
const KEY_RE = /^(fat-loss|lean-muscle|fighter):\d{1,2}$/;
const SESSION_GAP = 30 * 60000; // a new visit after 30 minutes away

async function handler(req, res) {
  if (http.cors(req, res)) { return; }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const b = http.body(req);
  const email = b ? http.oneLine(b.email, 200).toLowerCase() : '';
  if (!http.EMAIL_RE.test(email)) { return res.status(400).json({ ok: false, error: 'email_invalid' }); }
  if (!store.configured()) { return res.status(500).json({ ok: false, error: 'not_configured' }); }

  const tracks = Array.isArray(b.tracks) ? b.tracks.filter((t) => TRACK_IDS.indexOf(t) !== -1) : [];
  const progress = {};
  if (b.progress && typeof b.progress === 'object') {
    Object.keys(b.progress).slice(0, 200).forEach((k) => {
      const t = Number(b.progress[k]);
      if (KEY_RE.test(k) && t > 0) { progress[k] = t; }
    });
  }
  const last = b.last && TRACK_IDS.indexOf(b.last.cid) !== -1 ? { cid: b.last.cid, n: Number(b.last.n) || 1 } : null;

  const pathname = 'members/' + store.emailKey(email) + '.json';
  const now = Date.now();
  try {
    const prev = (await store.readJson(pathname)) || {};
    const lastSeen = prev.lastSeen ? Date.parse(prev.lastSeen) : 0;
    await store.writeJson(pathname, {
      email: email,
      tracks: tracks.length ? tracks : (prev.tracks || []),
      progress: progress,
      last: last || prev.last || null,
      visits: (prev.visits || 0) + (now - lastSeen > SESSION_GAP ? 1 : 0),
      firstSeen: prev.firstSeen || new Date(now).toISOString(),
      lastSeen: new Date(now).toISOString()
    });
  } catch (err) {
    console.error('[track] Could not save:', err && err.message);
    return res.status(500).json({ ok: false, error: 'save_failed' });
  }
  return res.status(200).json({ ok: true });
}

module.exports = handler;
