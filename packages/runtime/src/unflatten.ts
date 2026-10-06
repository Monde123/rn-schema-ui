/** Transforme { "a.b": 1, c: 2 } → { a: { b: 1 }, c: 2 } */
export function unflatten(values: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (!key.includes('.')) {
      out[key] = value;
      continue;
    }
    const parts = key.split('.');
    let cursor: Record<string, unknown> = out;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]!;
      if (i === parts.length - 1) {
        cursor[p] = value;
      } else {
        if (cursor[p] == null || typeof cursor[p] !== 'object') cursor[p] = {};
        cursor = cursor[p] as Record<string, unknown>;
      }
    }
  }
  return out;
}

export function needsUnflatten(values: Record<string, unknown>): boolean {
  return Object.keys(values).some((k) => k.includes('.'));
}
