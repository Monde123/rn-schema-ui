import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import {
  renderScreen,
  renderTest,
  type GenerateOptions,
  type SchemaIR,
} from '../vendor/templates/index.js';
import { loadSchemaFile, renderJsonSchemaZodMirror } from './load-schema.js';

export type GenerateCliOptions = {
  schemaPath: string;
  outDir: string;
  adapter: 'plain' | 'paper';
  router: 'expo' | 'rn';
  dryRun?: boolean;
  name?: string;
};

function pascalCase(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

export async function generate(opts: GenerateCliOptions): Promise<{
  ms: number;
  files: string[];
  ir: SchemaIR;
}> {
  const t0 = Date.now();
  const outDir = path.resolve(opts.outDir);
  const baseName = opts.name ?? path.basename(outDir);
  const componentName = pascalCase(baseName) || 'Form';

  const ir = await loadSchemaFile(opts.schemaPath, componentName, outDir);
  if (opts.adapter === 'paper') {
    ir.warnings.push('Paper adapter is partial — not wired to react-native-paper.');
  }

  const genOpts: GenerateOptions = {
    adapter: opts.adapter,
    router: opts.router,
    componentName,
    locale: 'en',
  };

  const files: { rel: string; content: string }[] = [];
  files.push({ rel: 'index.tsx', content: renderScreen(ir, genOpts) });
  files.push({
    rel: path.join('__tests__', `${componentName}.test.tsx`),
    content: renderTest(ir, genOpts),
  });

  if (path.extname(opts.schemaPath).toLowerCase() === '.json') {
    files.push({
      rel: 'schema.ts',
      content: renderJsonSchemaZodMirror(ir, opts.schemaPath),
    });
  }

  const written: string[] = [];
  if (!opts.dryRun) {
    mkdirSync(path.join(outDir, '__tests__'), { recursive: true });
    for (const f of files) {
      const abs = path.join(outDir, f.rel);
      mkdirSync(path.dirname(abs), { recursive: true });
      writeFileSync(abs, f.content, 'utf8');
      written.push(abs);
    }
  } else {
    for (const f of files) written.push(path.join(outDir, f.rel));
  }

  return { ms: Date.now() - t0, files: written, ir };
}
