import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'example/dist');
const outDir = path.join(root, 'docs/assets');
const frames = path.join(outDir, '_frames');
mkdirSync(frames, { recursive: true });

function contentType(f) {
  if (f.endsWith('.html')) return 'text/html';
  if (f.endsWith('.js')) return 'application/javascript';
  if (f.endsWith('.css')) return 'text/css';
  return 'application/octet-stream';
}

const server = createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url.endsWith('/')) url += 'index.html';
  const file = path.join(dist, url);
  if (!existsSync(file) || statSync(file).isDirectory()) {
    // SPA-ish: try register
    const alt = path.join(dist, url, 'index.html');
    if (existsSync(alt)) {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(readFileSync(alt));
      return;
    }
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': contentType(file) });
  res.end(readFileSync(file));
});

await new Promise((r) => server.listen(4173, r));
const chrome =
  process.env.CHROME_PATH ||
  path.join(process.env.HOME, '.cache/ms-playwright/chromium-1243/chrome-linux/chrome');
const browser = await chromium.launch({
  executablePath: existsSync(chrome) ? chrome : undefined,
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://127.0.0.1:4173/register', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(frames, '01.png') });
// fill a bit
const email = page.getByLabel('E-mail');
if (await email.count()) {
  await email.fill('demo@example.com');
}
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(frames, '02.png') });
const submit = page.getByTestId('submit');
if (await submit.count()) await submit.click();
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(frames, '03.png') });
await browser.close();
server.close();

const gif = path.join(outDir, 'demo.gif');
execSync(
  `ffmpeg -y -framerate 1 -i ${frames}/0%d.png -vf "scale=390:-1:flags=lanczos,fps=1" -loop 0 ${gif}`,
  { stdio: 'inherit' },
);
console.log('Wrote', gif, 'bytes', statSync(gif).size);
