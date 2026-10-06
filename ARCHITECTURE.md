# Architecture

|             |                                                              |
| ----------- | ------------------------------------------------------------ |
| **Name**    | **rn-schema-ui**                                             |
| **Tagline** | Schema in. Typed RN screens, validated forms, and tests out. |
| **Repo**    | https://github.com/Monde123/rn-schema-ui                     |

## Packages

| Package                   | Role                                               |
| ------------------------- | -------------------------------------------------- |
| `rn-schema-ui` (CLI)      | `init` / `generate` (+ bundled `vendor/templates`) |
| `@rn-schema-ui/runtime`   | `useForm`, `useField`, screen states, a11y helpers |
| `@rn-schema-ui/templates` | IR → code (bundled into CLI)                       |
| `example/`                | Expo Router demo                                   |

## Flow

```
Zod (.ts via jiti) | JSON Schema (.json)
        → IR (fields + warnings)
        → templates (renderScreen / renderTest)
        → index.tsx + __tests__/*.test.tsx (+ schema.ts if JSON)
```

## Out of scope (v0.1)

Auth magic, backend sync, full Paper/NativeWind adapters, deep discriminated unions.

## Multiplatform

First-class targets: **iOS**, **Android**, and **web** via Expo + `react-native-web`.

- CLI output is shared JS/TS for all platforms.
- Runtime depends only on `react` / `react-native` / `zod` (works under RN Web).
- Example app is an Expo Router project with web export as a CI gate.
- Templates must not introduce platform-only native modules without `Platform` guards or web shims.
