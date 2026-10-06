import { cpSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templatesDist = path.resolve(root, '../templates/dist');
const vendor = path.join(root, 'vendor/templates');

if (!existsSync(templatesDist)) {
  console.error('templates dist missing — build @rn-schema-ui/templates first');
  process.exit(1);
}
rmSync(vendor, { recursive: true, force: true });
mkdirSync(vendor, { recursive: true });
cpSync(templatesDist, vendor, { recursive: true });

// package stub so Node can resolve as file: dependency alternative
writeFileSync(
  path.join(root, 'vendor/templates/package.json'),
  JSON.stringify(
    {
      name: '@rn-schema-ui/templates',
      version: '0.1.0',
      type: 'module',
      main: './index.js',
      types: './index.d.ts',
    },
    null,
    2,
  ) + '\n',
);
console.log('✔ bundled templates → packages/cli/vendor/templates');
