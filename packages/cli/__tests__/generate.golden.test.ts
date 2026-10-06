import path from 'node:path';
import { readFileSync, rmSync, existsSync, writeFileSync, unlinkSync } from 'node:fs';
import { createJiti } from 'jiti';

const root = path.resolve(__dirname, '../../..');
const jiti = createJiti(__filename);
// Load TS generate via jiti to avoid Jest/import.meta issues
const { generate } = jiti('../src/generate.ts') as {
  generate: (opts: {
    schemaPath: string;
    outDir: string;
    adapter: 'plain' | 'paper';
    router: 'expo' | 'rn';
    dryRun?: boolean;
    name?: string;
  }) => Promise<{
    ms: number;
    files: string[];
    ir: { fields: unknown[]; warnings: string[] };
  }>;
};

function normalize(content: string, outDir: string): string {
  return content
    .replaceAll(outDir.replace(/\\/g, '/'), '<OUT>')
    .replaceAll(root.replace(/\\/g, '/'), '<ROOT>')
    .replace(/\r\n/g, '\n');
}

describe('generate golden', () => {
  const zodOut = path.join(root, 'tmp-golden-zod');
  const jsonOut = path.join(root, 'tmp-golden-json');

  afterAll(() => {
    rmSync(zodOut, { recursive: true, force: true });
    rmSync(jsonOut, { recursive: true, force: true });
  });

  it('snapshot écran + test depuis schemas/user.ts', async () => {
    rmSync(zodOut, { recursive: true, force: true });
    const result = await generate({
      schemaPath: path.join(root, 'schemas/user.ts'),
      outDir: zodOut,
      adapter: 'plain',
      router: 'expo',
      name: 'Register',
    });
    expect(result.ir.fields).toHaveLength(8);
    const screen = readFileSync(path.join(zodOut, 'index.tsx'), 'utf8');
    const test = readFileSync(path.join(zodOut, '__tests__/Register.test.tsx'), 'utf8');
    expect(normalize(screen, zodOut)).toMatchSnapshot('register-screen-zod');
    expect(normalize(test, zodOut)).toMatchSnapshot('register-test-zod');

    expect(screen).toContain('accessibilityLabel={"E-mail"}');
    expect(screen).toContain('accessibilityRole="switch"');
    expect(screen).toContain('accessibilityRole="alert"');
    expect(screen).toContain('accessibilityLabel="Envoyer"');
    expect(screen).toContain('secureTextEntry={true}');
    expect(screen).toContain('keyboardType="email-address"');
    expect(screen).toContain('keyboardType="numeric"');
  });

  it('snapshot depuis schemas/user.json', async () => {
    rmSync(jsonOut, { recursive: true, force: true });
    const result = await generate({
      schemaPath: path.join(root, 'schemas/user.json'),
      outDir: jsonOut,
      adapter: 'plain',
      router: 'expo',
      name: 'RegisterJson',
    });
    expect(result.ir.fields.length).toBeGreaterThanOrEqual(7);
    expect(existsSync(path.join(jsonOut, 'schema.ts'))).toBe(true);
    const screen = readFileSync(path.join(jsonOut, 'index.tsx'), 'utf8');
    const test = readFileSync(path.join(jsonOut, '__tests__/RegisterJson.test.tsx'), 'utf8');
    const schema = readFileSync(path.join(jsonOut, 'schema.ts'), 'utf8');
    expect(normalize(screen, jsonOut)).toMatchSnapshot('register-screen-json');
    expect(normalize(test, jsonOut)).toMatchSnapshot('register-test-json');
    expect(normalize(schema, jsonOut)).toMatchSnapshot('register-schema-mirror');
    expect(screen).toContain('accessibilityLabel={"E-mail"}');
  });

  it('erreur claire si export non ZodObject', async () => {
    const bad = path.join(root, 'tmp-bad-schema.ts');
    writeFileSync(bad, `export const notASchema = { hello: true };\n`);
    await expect(
      generate({
        schemaPath: bad,
        outDir: path.join(root, 'tmp-bad-out'),
        adapter: 'plain',
        router: 'expo',
        name: 'Bad',
      }),
    ).rejects.toThrow(/ZodObject|Aucun export/);
    unlinkSync(bad);
    rmSync(path.join(root, 'tmp-bad-out'), { recursive: true, force: true });
  });
});
