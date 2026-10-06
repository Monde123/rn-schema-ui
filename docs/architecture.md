# Architecture

Voir aussi [ARCHITECTURE.md](../ARCHITECTURE.md) à la racine.

## Flux

```
Zod (.ts via jiti) | JSON Schema (.json)
        ↓
   IR (fields + warnings)
        ↓
  templates (renderScreen / renderTest)
        ↓
  index.tsx + __tests__/*.test.tsx (+ schema.ts si JSON)
```

## Packages

| Package                   | Rôle                                |
| ------------------------- | ----------------------------------- |
| `rn-schema-ui`            | CLI (+ templates vendor/bundled)    |
| `@rn-schema-ui/runtime`   | Hook form mince + états             |
| `@rn-schema-ui/templates` | Rendu IR → code (interne / bundled) |

## Runtime

Aucun React Hook Form obligatoire. `safeParse` au submit ; clés `a.b` unflattenées avant validation.
