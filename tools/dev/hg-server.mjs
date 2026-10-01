// Local stand-in for hannahgoldy.com: serves training/ (clean URLs), /program from
// prelaunch/, /members from site/members/, and runs the real /api functions with
// records written to a local folder instead of the Blob store.
//
//   node tools/dev/hg-server.mjs        -> http://localhost:4610
//
// Reads ADMIN_PASSWORD (a local test value) from tools/dev/.env.dev, which is gitignored.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PORT = Number(process.env.PORT || 4610);
const require = createRequire(import.meta.url);

const envFile = path.join(ROOT, 'tools/dev/.env.dev');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach((l) => {
    const m = l.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) { process.env[m[1]] = m[2]; }
  });
}
process.env.HG_LOCAL_STORE = process.env.HG_LOCAL_STORE || path.join(os.tmpdir(), 'hg-local-store');
delete process.env.BLOB_READ_WRITE_TOKEN;
delete process.env.RESEND_API_KEY;

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.pdf': 'application/pdf', '.txt': 'text/plain', '.xml': 'application/xml' };

function staticFile(base, rel) {
  const tries = [rel, rel + '.html', path.join(rel, 'index.html')];
  for (const t of tries) {
    const f = path.join(base, t);
    if (f.startsWith(base) && fs.existsSync(f) && fs.statSync(f).isFile()) { return f; }
  }
  return null;
}

async function runApi(name, req, res, raw) {
  const file = path.join(ROOT, 'training/api', name + '.js');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end('no such function'); }
  delete require.cache[file];
  const handler = require(file);
  const ct = String(req.headers['content-type'] || '');
  req.body = ct.includes('application/json') ? (raw ? JSON.parse(raw) : {}) : raw;
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); return res; };
  res.send = (b) => { res.end(b); return res; };
  await handler(req, res);
}

http.createServer((req, res) => {
  let raw = '';
  req.on('data', (c) => { raw += c; });
  req.on('end', async () => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const p = decodeURIComponent(url.pathname);
      if (p.startsWith('/api/')) { return await runApi(p.slice(5).replace(/\/$/, ''), req, res, raw); }

      let base = path.join(ROOT, 'training'), rel = p;
      if (p === '/program' || p === '/members') { res.writeHead(308, { Location: p + '/' }); return res.end(); }
      if (p.startsWith('/program/')) { base = path.join(ROOT, 'prelaunch'); rel = p.slice('/program'.length); }
      else if (p.startsWith('/members/')) { base = path.join(ROOT, 'site/members'); rel = p.slice('/members'.length); }
      const f = staticFile(base, rel);
      if (!f) { res.writeHead(404); return res.end('not found'); }
      let out = fs.readFileSync(f);
      // the live program page posts to hannahgoldy.com; point it at this server instead
      if (f === path.join(ROOT, 'prelaunch/config.js')) {
        out = Buffer.from(out.toString().replace('https://hannahgoldy.com/api/signup', '/api/signup'));
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(out);
    } catch (err) {
      console.error(err);
      res.writeHead(500); res.end('server error');
    }
  });
}).listen(PORT, () => console.log('hannahgoldy.com (local) on http://localhost:' + PORT + '  store: ' + process.env.HG_LOCAL_STORE));
