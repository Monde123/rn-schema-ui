#!/usr/bin/env node
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist', 'cli.js');

if (existsSync(dist)) {
  const { run } = await import(pathToFileURL(dist).href);
  process.exit(await run());
} else {
  const { createJiti } = await import('jiti');
  const jiti = createJiti(import.meta.url);
  const mod = await jiti.import(path.join(root, 'src', 'cli.ts'));
  process.exit(await mod.run());
}
