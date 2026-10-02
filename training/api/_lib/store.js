/* ============================================================
   Private storage for leads, founding-list signups and member progress.

   Production: a private Vercel Blob store (BLOB_READ_WRITE_TOKEN is set
   automatically because the store is connected to this project).
   Local testing: set HG_LOCAL_STORE to a folder and records are written
   there as JSON files instead.

   Layout:
     leads/training/<time>_<rand>.json   one file per training enquiry
     signups/<emailhash>.json            one file per founding-list email
     members/<emailhash>.json            latest progress snapshot per member
     access/<emailhash>.json             tracks a buyer owns (their code is derived, never stored)
     sales/<founding|full|addon>/<id>.json  one per paid program purchase
     payments/<stripe id>.json           pay links and invoices Hannah sends
   ============================================================ */

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const LOCAL_DIR = process.env.HG_LOCAL_STORE || '';
let sdk = null;
const blob = () => { if (!sdk) { sdk = require('@vercel/blob'); } return sdk; };

function emailKey(email) {
  return crypto.createHash('sha256').update(String(email).trim().toLowerCase()).digest('hex').slice(0, 32);
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-') + '_' + crypto.randomBytes(4).toString('hex');
}

async function readJson(pathname) {
  if (LOCAL_DIR) {
    const f = path.join(LOCAL_DIR, pathname);
    return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
  }
  const r = await blob().get(pathname, { access: 'private', useCache: false });
  if (!r || r.statusCode !== 200) { return null; }
  return JSON.parse(await new Response(r.stream).text());
}

async function writeJson(pathname, data) {
  const body = JSON.stringify(data);
  if (LOCAL_DIR) {
    const f = path.join(LOCAL_DIR, pathname);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, body);
    return;
  }
  await blob().put(pathname, body, {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60
  });
}

async function listPaths(prefix) {
  if (LOCAL_DIR) {
    const dir = path.join(LOCAL_DIR, prefix);
    if (!fs.existsSync(dir)) { return []; }
    return fs.readdirSync(dir, { recursive: true }).map(String).filter((n) => n.endsWith('.json')).map((n) => prefix + n.split(path.sep).join('/'));
  }
  const out = [];
  let cursor;
  do {
    const page = await blob().list({ prefix, cursor, limit: 1000 });
    page.blobs.forEach((b) => out.push(b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

// Reads every record under a prefix, 8 at a time.
async function readAll(prefix) {
  const paths = await listPaths(prefix);
  const out = [];
  for (let i = 0; i < paths.length; i += 8) {
    const chunk = await Promise.all(paths.slice(i, i + 8).map((p) => readJson(p).catch(() => null)));
    chunk.forEach((r) => { if (r) { out.push(r); } });
  }
  return out;
}

function configured() {
  return Boolean(LOCAL_DIR || process.env.BLOB_READ_WRITE_TOKEN);
}

module.exports = { emailKey, stamp, readJson, writeJson, readAll, listPaths, configured };
