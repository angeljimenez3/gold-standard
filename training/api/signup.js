/* ============================================================
   THE GOLDY STANDARD: founding-list signups from the program page
   Served at /api/signup. The pre-launch page (hannahgoldy.com/program)
   posts { firstName, email, track, trackLabel, source, submittedAt }.

   One record per email address, so signing up twice does not count twice
   toward the founding 100. Optional email alert to PROGRAM_TO_EMAIL
   (thegoldystandard@hannahgoldy.com) once Resend is set up.
   ============================================================ */

'use strict';

const store = require('./_lib/store');
const http = require('./_lib/http');

const TRACKS = { 'fat-loss': 'Fat Loss', 'lean-muscle': 'Build Muscle', 'fighter': 'Fighter Conditioning' };

async function handler(req, res) {
  if (http.cors(req, res)) { return; }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const b = http.body(req);
  if (!b) { return res.status(400).json({ ok: false, error: 'bad_request' }); }
  if (b.company) { return res.status(200).json({ ok: true }); } // honeypot

  const firstName = http.oneLine(b.firstName, 60);
  const email = http.oneLine(b.email, 200).toLowerCase();
  const track = Object.prototype.hasOwnProperty.call(TRACKS, b.track) ? b.track : null;
  if (!firstName) { return res.status(400).json({ ok: false, error: 'name_required' }); }
  if (!http.EMAIL_RE.test(email)) { return res.status(400).json({ ok: false, error: 'email_invalid' }); }
  if (!store.configured()) { return res.status(500).json({ ok: false, error: 'not_configured' }); }

  const pathname = 'signups/' + store.emailKey(email) + '.json';
  const now = new Date().toISOString();

  try {
    const existing = await store.readJson(pathname);
    if (existing) {
      // Same person again: keep their original signup date, update the track if they picked a new one.
      if (track && track !== existing.track) {
        await store.writeJson(pathname, Object.assign(existing, { track: track, trackLabel: TRACKS[track], updatedAt: now }));
      }
      return res.status(200).json({ ok: true, duplicate: true });
    }
    await store.writeJson(pathname, {
      firstName: firstName,
      email: email,
      track: track,
      trackLabel: track ? TRACKS[track] : null,
      source: http.oneLine(b.source, 40),
      createdAt: now
    });
  } catch (err) {
    console.error('[signup] Could not save:', err && err.message);
    return res.status(500).json({ ok: false, error: 'save_failed' });
  }

  await http.sendEmail({
    to: http.listEnv('PROGRAM_TO_EMAIL'),
    reply_to: email,
    subject: 'Founding list: ' + firstName + (track ? ' (' + TRACKS[track] + ')' : ''),
    text: firstName + ' joined the founding list for The Goldy Standard.\n\nEmail: ' + email +
          '\nTrack: ' + (track ? TRACKS[track] : 'not picked') + '\n\nSee everyone at hannahgoldy.com/admin'
  });

  return res.status(200).json({ ok: true });
}

module.exports = handler;
