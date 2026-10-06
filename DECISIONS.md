# DECISIONS — journal d’architecture (ADR léger)

## ADR-001 — Nom du package

- **Statut** : accepté (2026-10-06)  
- **Décision** : publier sous **`rn-schema-ui`** ; monorepo `rn-formkit`.  
- **Alternatives libres** : `formkit-rn`, `zod-rn-forms` (404 npm au 2026-10-06).  
- **Pourquoi** : décrit schema→UI ; neutre vs « Formik-like runtime ».

## ADR-002 — Codegen, pas runtime-first

- **Statut** : accepté  
- **Décision** : le cœur est un CLI qui émet du code ; runtime optionnel mince.  
- **Conséquence** : 0 dépendance runtime obligatoire hors `zod` (peer projet).

## ADR-003 — Hook custom (pas RHF obligatoire) *(révisé Phase 3)*

- **Statut** : **accepté révisé** (2026-10-06, Phase 3)  
- **Décision** : `packages/runtime` fournit `useForm` / `useField` / `FormProvider` basés sur `zod.safeParse` (submit + erreurs champ). **Aucune** dépendance obligatoire à `react-hook-form`.  
- **Pourquoi** : critère « 0 runtime mandatory deps beyond zod » ; bundle cible &lt; 8 KB gzip.  
- **Supersède** : la décision v0.1 qui defaultait RHF en peer pour le code généré.

## ADR-004 — Parsing Zod via chargement runtime (jiti)

- **Statut** : accepté (Phase 3)  
- **Décision** : charger les `.ts` avec **jiti** (export nommé ou `default` ZodObject) ; fallback fichiers `.json` JSON Schema.  
- **Pourquoi** : pragmatique vs AST ; conserve checks email/min/max via introspection `_def`.  
- **Limite** : refinements complexes / transforms peuvent n’apparaître qu’au submit.

## ADR-005 — UI plain d’abord ; Paper partiel

- **Statut** : accepté  
- **Décision** : adapter `plain` complet ; `paper` = stubs / mapping partiel avec warning.  
- Flags CLI : `--adapter plain|paper`, `--router expo|rn`.

## ADR-006 — Docs en français

- **Statut** : accepté  
- **Décision** : docs + messages validation FR par défaut (`locale: "fr"`).

## ADR-007 — Git local only

- **Statut** : accepté  
- **Décision** : pas de `git push` ; Conventional Commits atomiques sur `main`.

## ADR-008 — Hors scope v0.1

Auth, backend sync, i18n multi-locale, unions discriminées profondes, Paper complet, publication npm.

## ADR-009 — Templates en fonctions TS (pas Handlebars runtime)

- **Statut** : accepté (Phase 3)  
- **Décision** : `@rn-schema-ui/templates` exporte des fonctions `render*` (template strings) ; zéro dépendance Handlebars dans le code généré.  
- **Pourquoi** : moins de deps CLI, typage IR direct.

## ADR-010 — Nested objects : flatten 1 niveau

- **Statut** : accepté (Phase 3)  
- **Décision** : `z.object` imbriqué → champs `parent.child` avec en-tête de section ; au-delà d’1 niveau → warning skip.  
- Arrays : primitives répétables seulement ; arrays d’objets → warning.

## ADR-011 — Pas de fichier states dans le dossier Expo Router

- **Statut** : accepté (Phase 3)  
- **Décision** : les états Loading/Error/Empty/Success sont importés depuis `@rn-schema-ui/runtime` dans l’écran généré ; **aucun** `states.ts` écrit sous `app/` (évite des routes parasites).

## ADR-012 — Runtime résolu via `dist/` pour Metro

- **Statut** : accepté (Phase 3)  
- **Décision** : imports `.js` ESM dans les sources TS ; Metro consomme `packages/runtime/dist`. Le monorepo example mappe `@rn-schema-ui/runtime` → `dist`.

## ADR-013 — `--watch` sur le fichier schéma

- **Statut** : accepté (Phase 4)  
- **Décision** : `fs.watch` sur le path schéma ; debounce simple via file d’attente. Suffisant pour DX locale v0.1.

## ADR-014 — Templates shippés avec le CLI

- **Statut** : accepté (Phase 5)  
- **Décision** : `bundledDependencies` + copie `vendor/templates` au build CLI pour que `npm pack` embarque les templates même hors monorepo.


## ADR-015 — Hébergement GitHub sous Rn_motion

- **Statut** : accepté (2026-10-06)  
- **Décision** : `repository` / `bugs` / `homepage` pointent vers `https://github.com/Monde123/Rn_motion` car le token ne peut pas créer ni renommer de dépôt (403). Le produit reste **rn-schema-ui** ; mismatch de nom documenté dans le README jusqu’au renommage manuel.
