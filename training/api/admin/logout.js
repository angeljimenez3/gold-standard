/* POST /api/admin/logout -> clears the dashboard session. */

'use strict';

const auth = require('../_lib/auth');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Set-Cookie', auth.clearCookie());
  return res.status(200).json({ ok: true });
};
