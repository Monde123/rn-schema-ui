# Changelog

## 0.1.0 — 2026-10-06

### Ajouté

- CLI `rn-schema-ui` : `init`, `generate` (Zod via jiti / JSON Schema), `--adapter`, `--router`, `--dry-run`, `--watch`
- Runtime `@rn-schema-ui/runtime` : `useForm`, `useField`, `FormProvider`, états d’écran, `unflatten`, helpers a11y
- Templates TypeScript : écrans plain (Paper partiel), tests RNTL
- Example Expo Router avec écran Register généré
- Qualité : Jest (golden + runtime), ESLint, Prettier, size-limit, bench cold/warm, CI

### Limites connues

- Unions / discriminated unions, arrays d’objets, nesting &gt; 1 niveau non supportés
- Adapter Paper partiel
- Pas encore publié sur npm (pack dry-run uniquement)
