/* Generates branded QR codes for The Goldy Standard.
   Usage: node brand/qr/make-qr.mjs
   Requires: npm i qrcode   (installed to /tmp for this run) */
import QRCode from '/tmp/node_modules/qrcode/lib/index.js';
import { writeFileSync, mkdirSync } from 'node:fs';

const NAVY = '#1C2B3A';
const GOLD = '#E8C96A';
const WHITE = '#FFFFFF';

const targets = [
  { file: 'qr-program-dark',  url: 'https://hannahgoldy.com/program/',  fg: GOLD,  bg: NAVY  },
  { file: 'qr-program-light', url: 'https://hannahgoldy.com/program/',  fg: NAVY,  bg: WHITE },
  { file: 'qr-hannahgoldy-dark',    url: 'https://hannahgoldy.com/training',    fg: GOLD,  bg: NAVY  },
  { file: 'qr-hannahgoldy-light',   url: 'https://hannahgoldy.com/training',    fg: NAVY,  bg: WHITE },
];

mkdirSync(new URL('.', import.meta.url), { recursive: true });

for (const t of targets) {
  // High error correction so a logo can sit in the middle without breaking the scan.
  const svg = await QRCode.toString(t.url, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 1200,
    color: { dark: t.fg, light: t.bg }
  });
  const out = new URL(`${t.file}.svg`, import.meta.url);
  writeFileSync(out, svg);
  console.log(`${t.file}.svg  ->  ${t.url}`);
}
