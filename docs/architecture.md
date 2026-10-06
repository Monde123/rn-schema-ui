# Architecture (short)

See also [ARCHITECTURE.md](../ARCHITECTURE.md).

```
Zod (.ts via jiti) | JSON Schema (.json)
        ↓
   IR (fields + warnings)
        ↓
  templates (renderScreen / renderTest)
        ↓
  index.tsx + __tests__/*.test.tsx
```

| Package                   | Role                         |
| ------------------------- | ---------------------------- |
| `rn-schema-ui`            | CLI (+ `vendor/templates`)   |
| `@rn-schema-ui/runtime`   | Thin form hook + states      |
| `@rn-schema-ui/templates` | IR → code (bundled into CLI) |

Runtime: no mandatory React Hook Form. `safeParse` on submit; dotted keys unflattened first.
