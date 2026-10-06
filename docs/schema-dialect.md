# Dialecte schéma

## Zod (prioritaire)

```ts
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8), // détecté password par le nom
  age: z.coerce.number().int().min(18),
  acceptTerms: z.boolean(),
  country: z.enum(['BJ', 'FR']),
  bio: z.string().optional(),
  profile: z.object({ city: z.string() }), // flatten → profile.city
  tags: z.array(z.string()),
});
```

Chargement : **jiti** sur le fichier `.ts`. Export préféré : nom finissant par `Schema`.

### Non supporté (warning + skip)

- `z.union` / `z.discriminatedUnion`
- `z.array(z.object(...))`
- nesting d’objets &gt; 1 niveau
- `z.record`, `z.tuple`, fonctions, promises

## JSON Schema

Draft pragmatique : `type`, `properties`, `required`, `enum`, `format: email|date|date-time`, arrays de primitives.

Un miroir Zod `schema.ts` est généré à côté de l’écran.
