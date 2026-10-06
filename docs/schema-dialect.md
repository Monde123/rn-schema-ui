# Schema dialect

## Zod (preferred)

```ts
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  age: z.coerce.number().int().min(18),
  acceptTerms: z.boolean(),
  country: z.enum(['BJ', 'FR']),
  bio: z.string().optional(),
  profile: z.object({ city: z.string() }), // → profile.city
  tags: z.array(z.string()),
});
```

Loaded with **jiti**. Prefer export names ending in `Schema`.

### Unsupported (warning + skip)

`z.union` / `z.discriminatedUnion`, `z.array(z.object(...))`, nesting &gt; 1 level, `z.record`, `z.tuple`, functions, promises.

## JSON Schema

Pragmatic: `type`, `properties`, `required`, `enum`, `format: email|date|date-time`, arrays of primitives. A Zod mirror `schema.ts` is emitted next to the screen.
