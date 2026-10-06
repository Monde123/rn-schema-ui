import { createRequire } from 'node:module';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { createJiti } from 'jiti';
import type { ZodTypeAny } from 'zod';
import { z } from 'zod';
import { jsonSchemaToIR, zodObjectToIR } from './ir-build.js';
import type { SchemaIR } from '../vendor/templates/index.js';

function pickZodExport(mod: Record<string, unknown>): { schema: ZodTypeAny; exportName: string } {
  if (mod.default && typeof mod.default === 'object' && '_def' in (mod.default as object)) {
    return { schema: mod.default as ZodTypeAny, exportName: 'default' };
  }
  for (const [name, val] of Object.entries(mod)) {
    if (val && typeof val === 'object' && '_def' in (val as object)) {
      // Prefer names ending with Schema
      if (/schema$/i.test(name)) return { schema: val as ZodTypeAny, exportName: name };
    }
  }
  for (const [name, val] of Object.entries(mod)) {
    if (val && typeof val === 'object' && '_def' in (val as object)) {
      return { schema: val as ZodTypeAny, exportName: name };
    }
  }
  const exports = Object.keys(mod).filter((k) => k !== '__esModule');
  throw new Error(
    `No ZodObject export found in the schema module.\n` +
      `Exports seen: ${exports.length ? exports.join(', ') : '(none)'}\n` +
      `Tip: export a z.object(...), e.g. export const userSchema = z.object({ ... })`,
  );
}

export async function loadSchemaFile(
  schemaPath: string,
  componentName: string,
  outDir: string,
): Promise<SchemaIR> {
  const abs = path.resolve(schemaPath);
  const ext = path.extname(abs).toLowerCase();
  const name = componentName;

  // Relative import from generated screen to schema file
  let schemaImportPath = path
    .relative(outDir, abs)
    .replace(/\\/g, '/')
    .replace(/\.(ts|tsx|js|mjs|cjs|json)$/, '');
  if (!schemaImportPath.startsWith('.')) schemaImportPath = `./${schemaImportPath}`;

  if (ext === '.json') {
    const doc = JSON.parse(readFileSync(abs, 'utf8')) as Record<string, unknown>;
    // For JSON we generate a local zod mirror path expectation — import the json via assert
    // Screens import a generated schema.ts instead
    return jsonSchemaToIR(doc, {
      name,
      exportName: `${name}Schema`,
      schemaImportPath: './schema',
    });
  }

  const jiti = createJiti(import.meta.url, {
    interopDefault: true,
    // ensure zod resolves from cli package
  });
  // Pre-register zod for the loaded file
  const require = createRequire(import.meta.url);
  void require.resolve('zod');

  const mod = (await jiti.import(abs)) as Record<string, unknown>;
  const { schema, exportName } = pickZodExport(mod);
  // Validate it's parseable
  if (typeof (schema as { safeParse?: unknown }).safeParse !== 'function') {
    throw new Error('Export found but it is not a Zod schema');
  }
  // Touch z to keep dependency
  void z;

  try {
    return zodObjectToIR(schema, {
      name,
      exportName: exportName === 'default' ? 'default' : exportName,
      schemaImportPath,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Schema "${exportName}" is not a usable ZodObject.\n${msg}\n` +
        `rn-schema-ui expects export const x = z.object({ ... }) (optionally wrapped with .optional/.refine).`,
    );
  }
}

export function renderJsonSchemaZodMirror(ir: SchemaIR, jsonPath: string): string {
  // Minimal zod mirror for JSON Schema inputs so runtime has a Zod schema
  const lines = ir.fields.map((f) => {
    let zexpr = 'z.string()';
    switch (f.kind) {
      case 'email':
        zexpr = 'z.string().email()';
        break;
      case 'password':
        zexpr = 'z.string().min(1)';
        break;
      case 'number':
        zexpr = 'z.coerce.number()';
        break;
      case 'boolean':
        zexpr = 'z.boolean()';
        break;
      case 'enum':
        zexpr = `z.enum([${(f.enumValues ?? []).map((v) => JSON.stringify(v)).join(', ')}])`;
        break;
      case 'date':
        zexpr = 'z.string()';
        break;
      case 'array':
        zexpr =
          f.arrayItemKind === 'number'
            ? 'z.array(z.coerce.number())'
            : f.arrayItemKind === 'boolean'
              ? 'z.array(z.boolean())'
              : 'z.array(z.string())';
        break;
      default:
        zexpr = 'z.string()';
    }
    if (!f.required) zexpr += '.optional()';
    // nested keys not expected from our json flatten
    return `  ${JSON.stringify(f.key)}: ${zexpr},`;
  });
  return `/* Generated from ${jsonPath} */
import { z } from 'zod';

export const ${ir.exportName} = z.object({
${lines.join('\n')}
});

export type ${ir.name} = z.infer<typeof ${ir.exportName}>;
`;
}
