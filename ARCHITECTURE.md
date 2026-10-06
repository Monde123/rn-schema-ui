# ARCHITECTURE — rn-schema-ui

## Produit

| | |
|--|--|
| **Nom** | **rn-schema-ui** |
| **Tagline** | *Du schéma Zod à l’écran React Native — formulaires, états et tests générés.* |
| **Tagline EN** | *Schema in. Typed RN screens, validated forms, and tests out.* |

Monorepo local : `/workspace/rn-formkit` (git only, pas de push GitHub en v0).

## Vue d’ensemble

```
schéma Zod (.ts) ou JSON Schema (.json)
        │
        ▼
┌───────────────────┐
│  packages/cli     │  parse → IR (Intermediate Representation)
│  rn-schema-ui     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ packages/templates│  adapters: plain | paper* | nativewind*
└─────────┬─────────┘
          │
          ├─► Screen.tsx (+ Loading / Error / Empty)
          ├─► fields/* (ou inline)
          ├─► __tests__/*.test.tsx (RNTL)
          └─► types générés / réexport schema
          │
          ▼
┌───────────────────┐
│ packages/runtime  │  optionnel, mince (hooks, Field wrappers)
└───────────────────┘
```

\* adapters UI hors v0.1 (stubs seulement).

## Packages

| Package | Rôle | Publish |
|---------|------|---------|
| `@rn-schema-ui/cli` ou binaire `rn-schema-ui` | CLI `init` / `generate` | Oui |
| `@rn-schema-ui/runtime` | Hooks mince + composants Field plain | Oui (opt-in) |
| `@rn-schema-ui/templates` | Templates EJS/Handlebars | Interne / bundled dans CLI |
| `example/` | App Expo démontrant generate + run | Non |
| `docs/` | Doc FR | Non |

## Flux `generate`

1. Charger schéma (`./schemas/user.ts` ou `.json`).  
2. Construire **IR** : `{ name, fields: [{ key, kind, zodType, ui, validation, a11y }] }`.  
3. Résoudre adapter UI (`--ui plain` défaut).  
4. Rendre templates → `--out` (ex. `./app/(auth)/register`).  
5. Écrire fichiers + résumé stdout (durée ms, nb champs, chemins).

## Dialecte schéma

- **Primaire** : Zod (`z.object({...})`) — parse via TS AST (`ts-morph` ou `@babel/parser`) **ou** export runtime + `zod-to-json-schema` (voir `DECISIONS.md`).  
- **Secondaire** : JSON Schema draft-07 / 2020-12 → même IR.

## Couche UI adapter

Interface :

```ts
type UiAdapter = {
  id: 'plain' | 'paper' | 'nativewind';
  fieldComponent(kind: FieldKind): string; // snippet import + JSX
  screenWrapper(): string;
};
```

v0.1 : **`plain` only** (`View`, `Text`, `TextInput`, `Pressable`, `ActivityIndicator`).

## Navigation

- **Expo Router** : fichier `register.tsx` sous le path `--out`.  
- **React Navigation** : stub `RegisterScreen` + commentaire d’enregistrement stack.

## Runtime (optionnel)

- Peer optionnel : `react-hook-form` + `@hookform/resolvers/zod`.  
- Sinon : wrapper mince `useSchemaForm` maison (&lt; cible bundle).  
- **Décision v0.1** : s’appuyer sur **RHF en peer optionnel** ; runtime maison = fallback / helpers a11y uniquement (`DECISIONS.md`).

## Hors scope v0.1

- Auth magic (OAuth, SecureStore flows).  
- Sync backend / mutations API.  
- Adapters Paper / NativeWind complets.  
- Unions discriminées complexes / recursive schemas.  
- i18n multi-locale des messages (FR messages par défaut OK).

## Structure dépôt

```
rn-formkit/
├── ANALYSE.md
├── ARCHITECTURE.md
├── API.md
├── DESIGN.md
├── DECISIONS.md
├── README.md
├── package.json          # workspaces
├── packages/
│   ├── cli/
│   ├── runtime/
│   └── templates/
├── example/              # Expo app
├── schemas/              # schémas démo
└── docs/
```
