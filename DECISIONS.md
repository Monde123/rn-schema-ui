# Decisions (ADR log)

## ADR-001 — Package name

Publish as **`rn-schema-ui`**; monorepo folder `rn-formkit`. Repo: https://github.com/Monde123/rn-schema-ui

## ADR-002 — Codegen, not runtime-first

CLI emits code; optional thin runtime. Zero mandatory runtime deps beyond `zod`.

## ADR-003 — Custom hook (no mandatory RHF)

`useForm` / `useField` use `zod.safeParse` on submit. Revised Phase 3.

## ADR-004 — Zod via jiti

Load `.ts` with jiti; JSON Schema fallback. Limitations on complex refinements documented.

## ADR-005 — Plain UI first

`plain` complete; `paper` partial.

## ADR-006 — Docs language

**English** for product docs and CLI (Phase 5 cleanup / 2026-10-06).

## ADR-007 — Local git then GitHub

Conventional Commits; push to `Monde123/rn-schema-ui`.

## ADR-009 — TS template functions

No Handlebars runtime dependency in generated code.

## ADR-010 — Nested objects: flatten 1 level

`parent.child` + unflatten before parse; deeper nesting → warning.

## ADR-011 — No states file under Expo Router `app/`

Import states from `rn-schema-ui-runtime` only.

## ADR-012 — Runtime via `dist/` for Metro

Example Metro maps package to `packages/runtime/dist`.

## ADR-013 — `--watch`

`fs.watch` on the schema path.

## ADR-014 — Templates shipped with CLI

`vendor/templates` copied at CLI build time for `npm pack`.

## ADR-015 — GitHub hosting

Originally pushed under `Rn_motion` (token could not create/rename). Repo **renamed** to `rn-schema-ui`.

## ADR-016 — Runtime published as unscoped `rn-schema-ui-runtime`

- **Question:** Under which npm name do we publish the runtime? The planned `@rn-schema-ui/runtime` requires an npm org/scope `rn-schema-ui`, which does not exist (and the publishing account is `mo-dev`).
- **Choice:** Unscoped `rn-schema-ui-runtime` (verified free on the registry before publishing). Fallback would have been `@mo-dev/rn-schema-ui-runtime`.
- **Reason:** Publishable immediately without creating an org; the name stays visibly tied to the CLI `rn-schema-ui`; no personal scope leaking into every generated import.
- **Cost of change:** Moving to a scope later means a new package name: generated screens import the runtime by name, so users would need to re-generate (or find/replace one import) and swap the dependency. The old package would be deprecated with a pointer, not unpublished.
