import type { ZodTypeAny } from 'zod';
import { ZodFirstPartyTypeKind } from 'zod';
import {
  hintFor,
  labelFor,
  type FieldIR,
  type FieldKind,
  type SchemaIR,
} from '../vendor/templates/index.js';

type AnyDef = { typeName?: string; innerType?: ZodTypeAny; schema?: ZodTypeAny; type?: ZodTypeAny };

function typeName(schema: ZodTypeAny): string {
  const def = schema._def as AnyDef;
  return def.typeName ?? '';
}

function unwrap(schema: ZodTypeAny): { inner: ZodTypeAny; required: boolean } {
  let current = schema;
  let required = true;
  for (let i = 0; i < 8; i++) {
    const tn = typeName(current);
    if (tn === ZodFirstPartyTypeKind.ZodOptional || tn === ZodFirstPartyTypeKind.ZodNullable) {
      required = false;
      current = (current._def as AnyDef).innerType as ZodTypeAny;
      continue;
    }
    if (tn === ZodFirstPartyTypeKind.ZodDefault) {
      required = false;
      current = (current._def as AnyDef).innerType as ZodTypeAny;
      continue;
    }
    if (tn === ZodFirstPartyTypeKind.ZodEffects) {
      current = (current._def as { schema: ZodTypeAny }).schema;
      continue;
    }
    if (tn === ZodFirstPartyTypeKind.ZodBranded) {
      current = (current._def as { type: ZodTypeAny }).type;
      continue;
    }
    break;
  }
  return { inner: current, required };
}

function isPasswordKey(key: string, meta: Record<string, unknown> | undefined): boolean {
  if (meta && (meta.ui === 'password' || meta.kind === 'password')) return true;
  return /password|motDePasse|mot_de_passe|passwd/i.test(key);
}

function stringKind(schema: ZodTypeAny, key: string): FieldKind {
  const meta = (schema as { meta?: () => Record<string, unknown> }).meta?.();
  if (isPasswordKey(key, meta)) return 'password';
  const checks = (schema._def as { checks?: { kind: string }[] }).checks ?? [];
  if (checks.some((c) => c.kind === 'email')) return 'email';
  if (meta?.ui === 'email') return 'email';
  return 'string';
}

function mapZodField(
  key: string,
  schema: ZodTypeAny,
  warnings: string[],
  section?: string,
): FieldIR | null {
  const { inner, required } = unwrap(schema);
  const tn = typeName(inner);

  if (tn === ZodFirstPartyTypeKind.ZodObject) {
    warnings.push(
      `Objet imbriqué profond ignoré pour "${key}" (flatten 1 niveau seulement côté parent).`,
    );
    return null;
  }

  let kind: FieldKind;
  let enumValues: string[] | undefined;
  let arrayItemKind: FieldIR['arrayItemKind'];

  switch (tn) {
    case ZodFirstPartyTypeKind.ZodString:
      kind = stringKind(inner, key);
      break;
    case ZodFirstPartyTypeKind.ZodNumber:
    case ZodFirstPartyTypeKind.ZodBigInt:
      kind = 'number';
      break;
    case ZodFirstPartyTypeKind.ZodBoolean:
      kind = 'boolean';
      break;
    case ZodFirstPartyTypeKind.ZodEnum:
      kind = 'enum';
      enumValues = (inner._def as { values: string[] }).values;
      break;
    case ZodFirstPartyTypeKind.ZodNativeEnum: {
      kind = 'enum';
      const e = (inner._def as { values: Record<string, string | number> }).values;
      enumValues = Object.values(e).filter((v) => typeof v === 'string') as string[];
      break;
    }
    case ZodFirstPartyTypeKind.ZodDate:
      kind = 'date';
      break;
    case ZodFirstPartyTypeKind.ZodArray: {
      const item = (inner._def as { type: ZodTypeAny }).type;
      const u = unwrap(item).inner;
      const itn = typeName(u);
      if (itn === ZodFirstPartyTypeKind.ZodString) arrayItemKind = 'string';
      else if (itn === ZodFirstPartyTypeKind.ZodNumber) arrayItemKind = 'number';
      else if (itn === ZodFirstPartyTypeKind.ZodBoolean) arrayItemKind = 'boolean';
      else {
        warnings.push(`Array non primitive ignorée: ${key}`);
        return null;
      }
      kind = 'array';
      break;
    }
    case ZodFirstPartyTypeKind.ZodLiteral: {
      const v = (inner._def as { value: unknown }).value;
      if (typeof v === 'string') {
        kind = 'enum';
        enumValues = [v];
        break;
      }
      warnings.push(`Literal non supporté: ${key}`);
      return null;
    }
    case ZodFirstPartyTypeKind.ZodUnion:
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
    case ZodFirstPartyTypeKind.ZodTuple:
    case ZodFirstPartyTypeKind.ZodRecord:
    case ZodFirstPartyTypeKind.ZodMap:
    case ZodFirstPartyTypeKind.ZodSet:
    case ZodFirstPartyTypeKind.ZodFunction:
    case ZodFirstPartyTypeKind.ZodPromise:
    case ZodFirstPartyTypeKind.ZodAny:
    case ZodFirstPartyTypeKind.ZodUnknown:
    case ZodFirstPartyTypeKind.ZodNever:
    case ZodFirstPartyTypeKind.ZodVoid:
      warnings.push(`Type non supporté (${tn}) pour "${key}" — ignoré.`);
      return null;
    default:
      // coerce wrappers sometimes appear as ZodNumber after unwrap effects
      if ((inner as { _def?: { typeName?: string } })._def?.typeName === 'ZodNumber') {
        kind = 'number';
        break;
      }
      warnings.push(`Type inconnu (${tn || '??'}) pour "${key}" — ignoré.`);
      return null;
  }

  const label = labelFor(key);
  return {
    key,
    kind,
    required,
    label,
    hint: hintFor(kind, label),
    section,
    enumValues,
    arrayItemKind,
  };
}

export function zodObjectToIR(
  schema: ZodTypeAny,
  opts: { name: string; exportName: string; schemaImportPath: string },
): SchemaIR {
  const warnings: string[] = [];
  const { inner } = unwrap(schema);
  if (typeName(inner) !== ZodFirstPartyTypeKind.ZodObject) {
    throw new Error('Type racine invalide: attendu ZodObject (z.object), reçu autre type Zod.');
  }
  const shape: Record<string, ZodTypeAny> =
    typeof (inner as unknown as { shape?: unknown }).shape === 'object'
      ? (inner as unknown as { shape: Record<string, ZodTypeAny> }).shape
      : (inner._def as { shape: () => Record<string, ZodTypeAny> }).shape();

  const fields: FieldIR[] = [];
  for (const [key, fieldSchema] of Object.entries(shape)) {
    const { inner: fieldInner } = unwrap(fieldSchema);
    if (typeName(fieldInner) === ZodFirstPartyTypeKind.ZodObject) {
      const nestedShape: Record<string, ZodTypeAny> =
        typeof (fieldInner as unknown as { shape?: unknown }).shape === 'object'
          ? (fieldInner as unknown as { shape: Record<string, ZodTypeAny> }).shape
          : (fieldInner._def as { shape: () => Record<string, ZodTypeAny> }).shape();
      const section = labelFor(key);
      for (const [childKey, childSchema] of Object.entries(nestedShape)) {
        const flatKey = `${key}.${childKey}`;
        const { inner: childInner } = unwrap(childSchema);
        if (typeName(childInner) === ZodFirstPartyTypeKind.ZodObject) {
          warnings.push(`Nesting >1 niveau ignoré: ${flatKey}`);
          continue;
        }
        const ir = mapZodField(flatKey, childSchema, warnings, section);
        if (ir) fields.push(ir);
      }
      continue;
    }
    const ir = mapZodField(key, fieldSchema, warnings);
    if (ir) fields.push(ir);
  }

  return {
    name: opts.name,
    exportName: opts.exportName,
    schemaImportPath: opts.schemaImportPath,
    fields,
    warnings,
  };
}

export function jsonSchemaToIR(
  doc: Record<string, unknown>,
  opts: { name: string; exportName: string; schemaImportPath: string },
): SchemaIR {
  const warnings: string[] = [];
  const props = (doc.properties ?? {}) as Record<string, Record<string, unknown>>;
  const requiredList = new Set<string>((doc.required as string[]) ?? []);
  const fields: FieldIR[] = [];

  for (const [key, prop] of Object.entries(props)) {
    const required = requiredList.has(key);
    let kind: FieldKind = 'string';
    let enumValues: string[] | undefined;
    let arrayItemKind: FieldIR['arrayItemKind'];

    const typ = prop.type;
    const format = prop.format;

    if (Array.isArray(prop.enum)) {
      kind = 'enum';
      enumValues = prop.enum.map(String);
    } else if (typ === 'boolean') kind = 'boolean';
    else if (typ === 'number' || typ === 'integer') kind = 'number';
    else if (typ === 'string' && format === 'email') kind = 'email';
    else if (typ === 'string' && (format === 'date' || format === 'date-time')) kind = 'date';
    else if (typ === 'string' && isPasswordKey(key, undefined)) kind = 'password';
    else if (typ === 'string') kind = 'string';
    else if (typ === 'array') {
      const items = prop.items as Record<string, unknown> | undefined;
      const it = items?.type;
      if (it === 'string' || it === 'number' || it === 'boolean') {
        kind = 'array';
        arrayItemKind = it;
      } else {
        warnings.push(`JSON Schema array non primitive ignorée: ${key}`);
        continue;
      }
    } else if (typ === 'object') {
      warnings.push(`JSON Schema object imbriqué non flatten auto: ${key} — ignoré`);
      continue;
    } else {
      warnings.push(`JSON Schema type non supporté pour ${key}`);
      continue;
    }

    const label = labelFor(key);
    fields.push({
      key,
      kind,
      required,
      label,
      hint: hintFor(kind, label),
      enumValues,
      arrayItemKind,
    });
  }

  return {
    name: opts.name,
    exportName: opts.exportName,
    schemaImportPath: opts.schemaImportPath,
    fields,
    warnings,
  };
}
