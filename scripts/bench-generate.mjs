import { performance } from 'node:perf_hooks';
import { createJiti } from 'jiti';
import path from 'node:path';
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'tmp-bench-out');
rmSync(out, { recursive: true, force: true });

const jiti = createJiti(import.meta.url);
const { generate } = await jiti.import(path.join(root, 'packages/cli/src/generate.ts'));

const opts = {
  schemaPath: path.join(root, 'schemas/user.ts'),
  outDir: out,
  adapter: 'plain',
  router: 'expo',
  name: 'Register',
};

const coldStart = performance.now();
const cold = await generate(opts);
const coldWall = Math.round(performance.now() - coldStart);

const warmStart = performance.now();
const warm = await generate(opts);
const warmWall = Math.round(performance.now() - warmStart);

const report = {
  fields: cold.ir.fields.length,
  coldMs: cold.ms,
  coldWallMs: coldWall,
  warmMs: warm.ms,
  warmWallMs: warmWall,
  pass: cold.ms < 2000 && warm.ms < 2000,
};
console.log(JSON.stringify(report, null, 2));
if (!report.pass) {
  console.error('FAIL: generate >= 2000ms');
  process.exit(1);
}
