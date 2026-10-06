# API — CLI & generation

```bash
npm install && npm run build
node packages/cli/bin/rn-schema-ui.js --help
```

## Commands

### `init`

Creates `rn-schema-ui.config.json` and `schemas/example.ts` if missing.

### `generate <schema> --out <dir>`

| Flag        | Default             | Description                 |
| ----------- | ------------------- | --------------------------- |
| `--out`     | required            | Output directory            |
| `--adapter` | `plain`             | `plain` \| `paper`          |
| `--router`  | `expo`              | `expo` \| `rn`              |
| `--name`    | basename of `--out` | Component PascalCase name   |
| `--dry-run` | off                 | Print paths only            |
| `--watch`   | off                 | Regenerate on schema change |

## Inputs

1. **Zod `.ts`** — jiti load; prefer exports ending in `Schema`.
2. **JSON Schema `.json`** — IR + generated `schema.ts` Zod mirror.

## Outputs

```
<out>/
├── index.tsx
├── schema.ts                 # JSON input only
└── __tests__/<Name>.test.tsx
```
