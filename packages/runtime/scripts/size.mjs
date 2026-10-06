import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.js')) out.push(p);
  }
  return out;
}

const files = walk(dist);
let raw = 0;
const parts = [];
for (const f of files) {
  const buf = readFileSync(f);
  raw += buf.length;
  parts.push(buf);
}
const concat = Buffer.concat(parts);
const gz = gzipSync(concat, { level: 9 });
const kb = (gz.length / 1024).toFixed(2);
console.log(
  JSON.stringify(
    { files: files.length, rawBytes: raw, gzipBytes: gz.length, gzipKB: Number(kb) },
    null,
    2,
  ),
);
if (gz.length > 8 * 1024) {
  console.error(`FAIL: gzip ${gz.length} > 8192`);
  process.exit(1);
}
console.log(`OK: runtime gzip ${kb} KB (< 8 KB)`);
