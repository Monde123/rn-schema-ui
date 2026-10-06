# Quality — rn-schema-ui v0.1.0

Measured: **2026-10-06** (WAT). Node 20, local monorepo.

## Phase 1 criteria

| Criterion                         | Target       | Result                          | Status |
| --------------------------------- | ------------ | ------------------------------- | ------ |
| Generate 8-field screen           | &lt; 2000 ms | cold ~5–6 ms / warm ~1–2 ms     | PASS   |
| Mandatory runtime deps beyond zod | 0            | custom hook                     | PASS   |
| Generated tests                   | pass         | example RNTL 3/3                | PASS   |
| Runtime gzip                      | &lt; 8 KB    | ~2.34 KB (size-limit ~2.89 KB)  | PASS   |
| TypeScript strict                 | yes          | `tsc --noEmit` OK               | PASS   |
| Expo web export                   | yes          | `expo export --platform web` OK | PASS   |

## Commands

```bash
npm run lint && npm run typecheck && npm test && npm run size && npm run bench:generate
```

Device protocol: [docs/expo-go.md](./docs/expo-go.md).

## Known gaps

Unions / object arrays / nesting &gt; 1; Paper adapter partial; npm not published yet.
