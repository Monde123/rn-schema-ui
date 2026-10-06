# QUALITÉ — rn-schema-ui v0.1.0

Date des mesures : **2026-10-06** (WAT). Environnement : Node 20, monorepo local.

## Tableau vs critères Phase 1

| Critère Phase 1 | Cible | Mesure | Statut |
|-----------------|-------|--------|--------|
| Generate écran 8 champs | &lt; 2000 ms | cold **5 ms** / warm **2 ms** (wall 5 / 1) | ✅ PASS |
| Runtime deps obligatoires hors `zod` | 0 | Hook custom ; pas de RHF | ✅ PASS |
| Tests générés passent | oui | example RNTL **3/3** verts | ✅ PASS |
| Delta bundle runtime gzip | &lt; 8 KB (aspire &lt; 5) | script **2,34 KB** ; size-limit **2,89 KB** | ✅ PASS |
| TypeScript strict | oui | `tsc --noEmit` packages OK | ✅ PASS |
| Expo Go / export web | exécutable plain | `expo export --platform web` OK | ✅ PASS |

## Suite de tests

| Suite | Résultat |
|-------|----------|
| Monorepo Jest | **31** tests, **8** suites, **5** snapshots golden |
| Couverture runtime | stmts **99 %**, lines **99 %**, funcs **96 %**, branches **85 %** |
| Lint ESLint | PASS |
| Prettier (fichiers clés) | appliqué |
| size-limit runtime | PASS (&lt; 8 kB) |
| Bench cold/warm | PASS |

## `npm pack --dry-run` (2026-10-06)

| Package | Tarball | Size pack | Unpacked | Fichiers |
|---------|---------|-----------|----------|----------|
| `rn-schema-ui` (CLI) | `rn-schema-ui-0.1.0.tgz` | **11,2 KB** | 39,8 KB | 22 (incl. `vendor/templates`) |
| `@rn-schema-ui/runtime` | `rn-schema-ui-runtime-0.1.0.tgz` | **7,8 KB** | 29,1 KB | 25 |

Templates shippés dans le CLI via `packages/cli/vendor/templates` (build bundle).

## Benchmark generate

```bash
npm run bench:generate
```

Exemple de sortie :

```json
{
  "fields": 8,
  "coldMs": 5,
  "coldWallMs": 5,
  "warmMs": 2,
  "warmWallMs": 1,
  "pass": true
}
```

## Protocole manuel Expo Go

Voir [docs/expo-go.md](./docs/expo-go.md).

## Écarts restants (non bloquants v0.1)

- Unions / discriminated unions, arrays d’objets, nesting &gt; 1
- Adapter Paper partiel
- Publication npm non effectuée (pack dry-run seulement)
- Demo GIF optionnelle : voir `docs/assets/` si présente
