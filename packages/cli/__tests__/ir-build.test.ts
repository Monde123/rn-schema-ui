import { z } from 'zod';
import { createJiti } from 'jiti';
import path from 'node:path';

const jiti = createJiti(__filename);
const { zodObjectToIR, jsonSchemaToIR } = jiti(
  path.join(__dirname, '../src/ir-build.ts'),
) as typeof import('../src/ir-build');

describe('zodObjectToIR', () => {
  it('maps common field kinds', () => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      age: z.coerce.number(),
      accept: z.boolean(),
      country: z.enum(['BJ', 'FR']),
      born: z.date().optional(),
      tags: z.array(z.string()),
      profile: z.object({ city: z.string() }),
    });
    const ir = zodObjectToIR(schema, {
      name: 'User',
      exportName: 'userSchema',
      schemaImportPath: './user',
    });
    const kinds = Object.fromEntries(ir.fields.map((f) => [f.key, f.kind]));
    expect(kinds.email).toBe('email');
    expect(kinds.password).toBe('password');
    expect(kinds.age).toBe('number');
    expect(kinds.accept).toBe('boolean');
    expect(kinds.country).toBe('enum');
    expect(kinds.born).toBe('date');
    expect(kinds.tags).toBe('array');
    expect(kinds['profile.city']).toBe('string');
  });
});

describe('jsonSchemaToIR', () => {
  it('parses a simple JSON Schema', () => {
    const ir = jsonSchemaToIR(
      {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
          age: { type: 'integer' },
        },
      },
      { name: 'U', exportName: 'USchema', schemaImportPath: './schema' },
    );
    expect(ir.fields.find((f) => f.key === 'email')?.kind).toBe('email');
    expect(ir.fields.find((f) => f.key === 'age')?.kind).toBe('number');
  });
});

describe('zodObjectToIR edges', () => {
  it('skips object arrays with a warning', () => {
    const schema = z.object({
      items: z.array(z.object({ id: z.string() })),
    });
    const ir = zodObjectToIR(schema, {
      name: 'X',
      exportName: 'xSchema',
      schemaImportPath: './x',
    });
    expect(ir.fields.find((f) => f.key === 'items')).toBeUndefined();
    expect(ir.warnings.some((w) => /Non-primitive array/i.test(w))).toBe(true);
  });

  it('detects password by field name', () => {
    const schema = z.object({
      motDePasse: z.string().min(8),
    });
    const ir = zodObjectToIR(schema, {
      name: 'X',
      exportName: 'xSchema',
      schemaImportPath: './x',
    });
    expect(ir.fields.find((x) => x.key === 'motDePasse')?.kind).toBe('password');
  });
});
