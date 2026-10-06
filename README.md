# rn-schema-ui

> **Schema in → typed React Native screens, validated forms, and tests out.**

Codegen (not another Formik-like runtime): Zod or JSON Schema → typed screen, validation wiring, loading/error/empty/success states, and React Native Testing Library tests.

**Repository:** [github.com/Monde123/rn-schema-ui](https://github.com/Monde123/rn-schema-ui)

## Install

```bash
# After npm publish:
npx rn-schema-ui generate ./schemas/user.ts --out ./app/register

# Local monorepo (today):
cd rn-formkit && npm install && npm run build
node packages/cli/bin/rn-schema-ui.js --help
```

Optional runtime peer package: `@rn-schema-ui/runtime` (`react`, `react-native`, `zod`).

## Quickstart

```bash
node packages/cli/bin/rn-schema-ui.js init
node packages/cli/bin/rn-schema-ui.js generate ./schemas/example.ts \
  --out ./app/example --name Example --adapter plain --router expo
```

Real schema (`schemas/user.ts`):

```ts
import { z } from 'zod';

export const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  age: z.coerce.number().int().min(18),
  acceptTerms: z.boolean(),
  country: z.enum(['BJ', 'FR', 'SN', 'CI']),
  bio: z.string().max(280).optional(),
});
```

### Before / after

**Before** — hand-wire every `TextInput`, error text, keyboard type, a11y props, and RNTL tests.

**After**:

```bash
node packages/cli/bin/rn-schema-ui.js generate ./schemas/user.ts \
  --out ./example/app/\(auth\)/register --name Register
```

→ `index.tsx` + `__tests__/Register.test.tsx` ready for Expo.

## How it works under the hood

1. **Schema load** — For `.ts` Zod files, the CLI loads the module with **jiti** and picks a `*Schema` / Zod export. For `.json`, it reads JSON Schema and builds the same intermediate model (plus a small Zod mirror file when needed).
2. **Field mapping** — Each Zod/JSON field becomes an IR entry: kind (`email`, `password`, `number`, `boolean`, `enum`, …), label/hint, keyboard/`secureTextEntry`, a11y props, optional/nullable unwrap. Nested objects are flattened one level (`profile.city`); unsupported shapes emit a warning and are skipped.
3. **Template render** — Pure TypeScript template functions turn the IR into screen JSX, submit wiring, and an RNTL test file (`--adapter plain|paper`, `--router expo|rn`).
4. **Emitted artifacts** — A screen component, default values, submit handler, and tests. No mandatory Formik/RHF in the output.
5. **Thin runtime** — Generated screens call `@rn-schema-ui/runtime` `useForm`: controlled values, field errors, and **`zod.safeParse` on submit** (dotted keys are unflattened first). Presentational Loading/Error/Empty/Success helpers ship in the same package (~2–3 KB gzip).
6. **Adapters** — `plain` is the default (core RN primitives). `paper` is a partial stub for later React Native Paper styling—same structure, not a full Paper dependency injection.

## Multiplatform (iOS, Android, Web)

rn-schema-ui targets **Expo** apps that run on **iOS**, **Android**, and **web** (`react-native-web`)—not mobile-only.

| Target        | How                                                   |
| ------------- | ----------------------------------------------------- |
| iOS / Android | Expo Go or dev builds                                 |
| Web           | `npx expo export --platform web` / `expo start --web` |

Generated UI uses core React Native primitives (`View`, `Text`, `TextInput`, `Switch`, `Pressable`, `ScrollView`, `KeyboardAvoidingView`). Platform-specific behavior is gated with `Platform.OS` (e.g. keyboard avoiding on iOS). Avoid adding native-only modules in templates without a web fallback.

**Testing matrix (v0.1):**

| Check                       | iOS | Android | Web              |
| --------------------------- | --- | ------- | ---------------- |
| Generate + TypeScript       | ✓   | ✓       | ✓                |
| Jest + RNTL (logic/UI tree) | ✓   | ✓       | ✓                |
| Expo export / static web    | —   | —       | ✓ (CI)           |
| Expo Go manual smoke        | ✓   | ✓       | optional browser |

## Supported field types

| Kind                | UI                       | Notes                                  |
| ------------------- | ------------------------ | -------------------------------------- |
| string              | TextInput                |                                        |
| email               | TextInput                | `keyboardType=email-address`           |
| password            | TextInput                | name `password` / `motDePasse` or meta |
| number              | TextInput                | `numeric`                              |
| boolean             | Switch                   |                                        |
| enum                | Pressable chips          |                                        |
| date                | TextInput                | hint YYYY-MM-DD                        |
| optional / nullable | —                        | unwrap                                 |
| object (1 level)    | section + `parent.child` | unflatten on submit                    |
| array of primitives | list + Add               |                                        |

## Adapters & router

- `--adapter plain|paper` (paper partial)
- `--router expo|rn`
- `--watch` regenerates on schema save
- `--dry-run`

## Example app

```bash
cd example && npx expo start
# device: docs/expo-go.md
npx expo export --platform web
```

![Register form (Expo web)](./docs/assets/demo.gif)

## Quality

```bash
npm run lint && npm run typecheck && npm test && npm run size && npm run bench:generate
```

See [QUALITY.md](./QUALITY.md), [CHANGELOG.md](./CHANGELOG.md), [docs/](./docs/).

## License

MIT © 2026 Moïse Koudanko
