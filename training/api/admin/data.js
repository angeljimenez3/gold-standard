/* GET /api/admin/data -> everything the dashboard shows. Login required. */

'use strict';

const auth = require('../_lib/auth');
const store = require('../_lib/store');

const newestFirst = (a, b) => String(b.createdAt || b.lastSeen || '').localeCompare(String(a.createdAt || a.lastSeen || ''));

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!auth.isLoggedIn(req)) {
    return res.status(401).json({ ok: false, error: auth.configured() ? 'login_required' : 'not_configured' });
  }
  if (!store.configured()) {
    return res.status(500).json({ ok: false, error: 'storage_not_configured' });
  }
  try {
    const [leads, signups, members] = await Promise.all([
      store.readAll('leads/training/'),
      store.readAll('signups/'),
      store.readAll('members/')
    ]);
    return res.status(200).json({
      ok: true,
      generatedAt: new Date().toISOString(),
      leads: leads.sort(newestFirst),
      signups: signups.sort(newestFirst),
      members: members.sort(newestFirst)
    });
  } catch (err) {
    console.error('[admin] Could not load data:', err && err.message);
    return res.status(500).json({ ok: false, error: 'load_failed' });
  }
};
