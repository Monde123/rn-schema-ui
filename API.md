# API — CLI & génération

## Installation (monorepo)

```bash
npm install
npm run build
node packages/cli/bin/rn-schema-ui.js --help
```

Peer runtime projet : `zod`, `react`, `react-native`.  
Runtime optionnel : `@rn-schema-ui/runtime` (hook custom — **pas** de RHF obligatoire).

## Commandes

### `rn-schema-ui init`

Crée `rn-schema-ui.config.json` et le dossier `schemas/` si besoin.

### `rn-schema-ui generate <schema> --out <dir>`

```bash
node packages/cli/bin/rn-schema-ui.js generate ./schemas/user.ts \
  --out ./app/\(auth\)/register \
  --name Register \
  --adapter plain \
  --router expo

node packages/cli/bin/rn-schema-ui.js generate ./schemas/user.json --out ./tmp/out --dry-run
```

| Flag | Défaut | Description |
|------|--------|-------------|
| `--out` | requis | Répertoire de sortie |
| `--adapter` | `plain` | `plain` \| `paper` (partiel) |
| `--router` | `expo` | `expo` \| `rn` |
| `--name` | basename(`--out`) | Nom du composant PascalCase |
| `--dry-run` | off | Affiche sans écrire |
| `--force` | — | (réservé) |

## Entrées schéma

1. **Zod `.ts`** : chargé via **jiti** ; premier export `*Schema` ou objet avec `_def`.  
2. **JSON Schema `.json`** : converti en IR + fichier `schema.ts` Zod miroir généré.

## Mapping champs

| Kind | UI | Clavier / extras |
|------|----|------------------|
| string | TextInput | default |
| email | TextInput | email-address, autoCapitalize none |
| password | TextInput | secureTextEntry (nom ou meta) |
| number | TextInput | numeric |
| boolean | Switch | role switch |
| enum | chips Pressable | — |
| date | TextInput | hint AAAA-MM-JJ |
| array (primitives) | liste + Ajouter | — |
| object 1 niveau | flatten `parent.child` + section | unflatten au submit |

Types non supportés → **warning** + skip.

## Fichiers générés

```
<out>/
├── index.tsx                 # écran + états via @rn-schema-ui/runtime
├── schema.ts                 # si entrée JSON (miroir Zod)
└── __tests__/<Name>.test.tsx
```
