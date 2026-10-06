# Changelog

## 0.1.0 — 2026-10-06

### Added

- CLI `rn-schema-ui`: `init`, `generate` (Zod via jiti / JSON Schema), `--adapter`, `--router`, `--dry-run`, `--watch`
- Runtime `@rn-schema-ui/runtime`: `useForm`, `useField`, `FormProvider`, screen states, a11y helpers, `unflatten`
- TypeScript templates: plain screens (Paper partial), RNTL tests
- Expo Router example with generated Register screen
- Quality: Jest (golden + runtime), ESLint, Prettier, size-limit, cold/warm bench, CI

### Docs

- English product documentation; repo https://github.com/Monde123/rn-schema-ui

### Known limits

- Unions / discriminated unions, arrays of objects, nesting &gt; 1 level
- Paper adapter partial
- Not published to npm yet
