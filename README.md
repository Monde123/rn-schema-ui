# rn-schema-ui

**A CLI that turns a Zod (or JSON Schema) object into a React Native form screen, validation wiring, UI states, and RNTL tests.**

Repo: [github.com/Monde123/rn-schema-ui](https://github.com/Monde123/rn-schema-ui)

## The problem

In Expo / React Native you still hand-build every signup, settings, or profile form: `TextInput` + `value`/`onChangeText`, keyboard types, `secureTextEntry`, labels, a11y props, Zod/`safeParse` errors, loading/error/empty UI, and a Testing Library file. That boilerplate repeats for every screen.

**rn-schema-ui is codegen, not another form library.** You keep Zod as the source of truth; the tool writes the screen and tests. A small optional runtime (`useForm` + `zod.safeParse`) powers the generated code—no Formik/RHF required.

## What you get

```bash
rn-schema-ui generate ./schemas/user.ts --out ./app/(auth)/register --name Register
```

Writes:

| File                          | Contents                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| `index.tsx`                   | Screen: fields, submit, reset, loading/error/empty/success hooks via `rn-schema-ui-runtime` |
| `__tests__/Register.test.tsx` | RNTL tests: render, validation on empty submit, successful submit                           |
| `schema.ts`                   | **Only if** the input was `.json` — Zod mirror of that JSON Schema                          |

The screen imports your schema and exports e.g. `RegisterScreen` (name from `--name` / folder).

## Quickstart

```bash
git clone https://github.com/Monde123/rn-schema-ui.git
cd rn-schema-ui   # monorepo folder may still be named rn-formkit locally
npm install && npm run build
```

Minimal schema (`schemas/signup.ts`):

```ts
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  acceptTerms: z.boolean(),
});
```

Generate:

```bash
node packages/cli/bin/rn-schema-ui.js generate ./schemas/signup.ts \
  --out ./app/signup --name Signup --adapter plain --router expo
```

Use in an Expo Router / RN app (after depending on `rn-schema-ui-runtime` in the workspace):

```tsx
import { SignupScreen } from './app/signup';

export default function Page() {
  return (
    <SignupScreen
      onSuccess={(values) => {
        // typed-shaped object from zod.safeParse
        console.log(values);
      }}
    />
  );
}
```

Also: `init` (config + example schema), `--watch`, `--dry-run`, `--adapter plain|paper`, `--router expo|rn`.

## Supported field types (from the mapper)

What `packages/cli` actually maps today:

| Zod / shape                                       | UI                            | Behavior                                      |
| ------------------------------------------------- | ----------------------------- | --------------------------------------------- |
| `z.string()`                                      | `TextInput`                   | default keyboard                              |
| `z.string().email()`                              | `TextInput`                   | `keyboardType="email-address"`, no capitalize |
| field name ~ `password` / `passwd` / `motDePasse` | `TextInput`                   | `secureTextEntry`                             |
| `z.number()` / `z.coerce.number()` / bigint       | `TextInput`                   | `keyboardType="numeric"`                      |
| `z.boolean()`                                     | `Switch`                      |                                               |
| `z.enum` / string `nativeEnum` / string `literal` | chip `Pressable`s             |                                               |
| `z.date()`                                        | `TextInput`                   | text hint `YYYY-MM-DD` (no native picker)     |
| `.optional()` / `.nullable()` / `.default()`      | —                             | unwrapped; optional fields not required       |
| nested `z.object` **one level**                   | section + keys `parent.child` | unflattened before `safeParse`                |
| `z.array(z.string\|number\|boolean)`              | list + Add                    | object arrays **skipped** (warning)           |

**Skipped with a warning:** unions, discriminated unions, tuples, records, maps, sets, deep nesting (&gt;1 object level), arrays of objects.

JSON Schema (`.json`) supports the same practical subset (`string`/`email`/`integer`/`boolean`/`enum`/primitive arrays) and emits `schema.ts`.

`--adapter paper` is **partial** (same structure, not wired to `react-native-paper`).

## Multiplatform

Generated screens use core RN APIs and are meant for **iOS, Android, and web** (Expo + `react-native-web`). `KeyboardAvoidingView` uses `Platform.OS === 'ios'`. Example app: `cd example && npx expo start` or `npx expo export --platform web`. See [docs/testing-matrix.md](./docs/testing-matrix.md).

## Under the hood

1. Load schema — Zod `.ts` via **jiti**; or parse JSON Schema.
2. Build an IR of fields (kind, labels, a11y, keyboard flags).
3. Render TypeScript templates → `index.tsx` + test file.
4. At runtime, `useForm` from `rn-schema-ui-runtime` holds values/errors and runs **`schema.safeParse` on submit**.

## Packages

| Package                | Role                                                               | npm                                                                             |
| ---------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `rn-schema-ui`         | CLI (`init`, `generate`)                                           | **Not published yet** — use this repo / `node packages/cli/bin/rn-schema-ui.js` |
| `rn-schema-ui-runtime` | `useForm`, `useField`, `FormProvider`, Loading/Error/Empty/Success | **Not published yet** — workspace package                                       |

Peers for runtime: `react`, `react-native`, `zod`.

## Docs

- [docs/](./docs/) — architecture, schema dialect, adapters, Expo Go, testing matrix
- [ARCHITECTURE.md](./ARCHITECTURE.md) · [API.md](./API.md) · [QUALITY.md](./QUALITY.md) · [CHANGELOG.md](./CHANGELOG.md)

## License

MIT © 2026 Moïse Koudanko
