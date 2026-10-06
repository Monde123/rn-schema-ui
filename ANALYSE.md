# ANALYSE — rn-schema-ui / formkit-rn

> Date de rédaction : 6 octobre 2026 (WAT).  
> Toutes les métriques ci-dessous sont tirées de sources publiques citées ; **aucun chiffre n’est inventé**.

## 1. Douleur produit

Construire des formulaires React Native reste répétitif : câblage `TextInput` / `onChangeText` / `value`, validation, `keyboardType` / `secureTextEntry`, accessibilité (`accessibilityLabel`, rôles), états loading / error / empty, et tests RNTL. Les librairies runtime (Formik, React Hook Form) réduisent le state, **mais ne génèrent pas** l’écran, les props a11y, ni les tests.

### 1.1 Preuves communauté (citations datées)

| Observation | Source | Date / période |
|-------------|--------|----------------|
| State of React 2024 : **React Hook Form** cité par **4 275** répondants ; **Formik** par **2 795** (catégorie Form Libraries, 6 037 répondants à la question = 77 %). Commentaire officiel : « React Hook Form is by far the most common form library today. » | [2024.stateofreact.com — Component Libraries / Form Libraries](https://2024.stateofreact.com/en-US/libraries/component-libraries/) | Enquête State of React **2024** |
| State of React 2024 : **Zod** en tête des schémas de validation avec **3 893** répondants. | [2024.stateofreact.com — Other Tools / Validation](https://2024.stateofreact.com/en-US/other-tools/) | **2024** |
| State of JS 2024 : Zod listé parmi les libs utilitaires avec **4 117** répondants. | [2024.stateofjs.com — Other Tools](https://2024.stateofjs.com/en-US/other-tools/) | **2024** |
| Téléchargements npm (dernier mois mesuré) : `react-hook-form` **240 901 027** ; `formik` **18 700 677** ; `zod` **1 261 303 206**. | API npm `downloads/point/last-month` (fenêtre **2026-09-05 → 2026-10-04**) | Consulté **2026-10-06** |
| Reddit r/reactnative : développeur demande si Formik marche en RN ; réponses recommandent souvent **react-hook-form** pour le DX. | [reddit.com/r/reactnative/comments/19dywrm](https://www.reddit.com/r/reactnative/comments/19dywrm/i_always_use_formik_to_create_forms_in_my_react/) | **2024-01-23** |
| Issue RN ouverte : flash de caractères invalides avant filtrage `onChangeText` (limitation async connue) — « pretty common need ». | [facebook/react-native#47252](https://github.com/facebook/react-native/issues/47252) | Ouverte **2024-10-28**, toujours active en **2026** |
| `maxLength` TextInput cassé / contourné selon architecture et mises à jour state. | [facebook/react-native#47563](https://github.com/facebook/react-native/issues/47563) (**2024-11-12**), [#44965](https://github.com/facebook/react-native/issues/44965) | 2024–2025 |
| Stack Overflow : KeyboardAvoidingView + Formik wizard — bouton qui monte avec le clavier. | [SO 61107922](https://stackoverflow.com/questions/61107922/how-to-get-keyboardavoidingview-to-work-with-a-formik-wizard) | **2020** (toujours cité comme pattern douloureux) |
| Stack Overflow : tests TextInput RNTL — `fireEvent.changeText` exige `onChangeText` ; assertion via `props.value` ; a11y/`getByLabelText` recommandé. | [SO 68519431](https://stackoverflow.com/questions/68519431/no-handler-function-found-for-event-changetext) (**2021**), [SO 71975948](https://stackoverflow.com/questions/71975948/how-to-test-textinput-in-react-native-with-testing-library-reat-native) (**2022-04-23**) | 2021–2022 |
| Guides RN 2025 : clavier, focus, masking, perfs sur bas de gamme Android = différenciateurs vs web. | [reactnative.live guide Formik vs RHF](https://reactnative.live/react-native-forms-guide-formik-vs-react-hook-form-vs-native-solutions), [reactnative.xyz RHF vs Formik vs Zod](https://reactnative.xyz/react-native-forms-compared) | Guides contemporains (consultés **2026-10-06**) |

**Synthèse douleur (sans inventer de %)** : la communauté a massivement adopté RHF + Zod pour le *runtime* de validation/state, mais les artefacts RN récurrents (props clavier/a11y, écrans d’état, tests RNTL) restent manuels. Les bugs TextInput natifs (#47252, #47563) montrent que le câblage correct n’est pas trivial.

## 2. Inventaire concurrents

| Approche | Dépendances typiques | Génère vs runtime | Expo Go | Maintenance | Lacunes vs notre angle |
|----------|----------------------|-------------------|---------|-------------|------------------------|
| **Formik + Yup** | `formik`, `yup` | Runtime only | Oui | Formik mature mais usage en baisse vs RHF (State of React 2024 : 2 795 vs 4 275) | Pas de codegen écran/tests/a11y ; perfs contrôlées moins adaptées aux gros formulaires |
| **React Hook Form + zod** | `react-hook-form`, `@hookform/resolvers`, `zod` | Runtime only (+ Controller wrappers RN) | Oui | Très active ; standard de facto | Toujours boilerplate UI + états + tests à écrire à la main |
| **Formisch (+ Valibot)** | `@formisch/react-native`, Valibot | Runtime schema-first | Oui | Relativement nouveau | Valibot only ; pas de génération d’écrans/tests ; Paper = guide manuel ([formisch.dev](https://formisch.dev/react-native/guides/react-native-paper.md)) |
| **React Native Paper forms** | `react-native-paper` + form lib | Composants UI runtime | Oui | Active | Pas de schema→écran ; select/slider manuels |
| **NativeBase → Gluestack** | copy-paste NativeWind (v5 CLI) | Composants/patterns, pas forms schema | Oui (Expo Router first) | Gluestack v3/v5 actif ([gluestack.io](https://gluestack.io/blogs/gluestack-v3-release)) | Pas de codegen depuis Zod/JSON Schema vers form+tests |
| **Tamagui** | `tamagui` | UI system runtime | Oui (avec config) | Active | Pas générateur de formulaires schema-driven |
| **Expo Router form patterns** | `expo-router` | Conventions de routing | Oui | Active | Routes/stubs ; pas validation ni fields depuis schema |
| **Shopify Restyle** | `@shopify/restyle` | Theming/runtime | Oui | Stable | Aucun form codegen |
| **@nkzw/react-native-jsonschema-form** | JSON Schema + AJV | Runtime renderer | Dépend | Niche npm | Rend au runtime ; ne génère pas TS screens/tests |
| **orval / openapi-generator** | OpenAPI | Client API + parfois Zod ; **pas** UI form RN | N/A (CLI) | Actifs ([orval.dev](https://orval.dev)) | Schémas API ≠ écrans RN + a11y + RNTL |
| **Hygen / Plop** | templates locaux | Generators génériques | N/A | DIY | Pas de dialecte Zod/JSON Schema out-of-the-box |
| **Cursor / prompts AI only** | aucun paquet | Génération ad hoc | N/A | Non déterministe | Pas reproductible, pas CLI versionnée, pas tests garantis |

## 3. Angle d’originalité

**Pas un nouveau runtime de formulaires.** Un **codegen** qui, à partir d’un schéma (Zod prioritaire), émet :

1. Écran(s) typés RN (champs + submit)  
2. États **loading / error / empty** + stub toast succès  
3. Props a11y + clavier dérivés du type de champ  
4. Tests **React Native Testing Library**  
5. Runtime optionnel **mince** (peer) — zéro dépendance runtime obligatoire au-delà de `zod`

Différenciateur vs RHF/Formik/Formisch : ceux-ci orchestrent à l’exécution ; nous **émettons le code** (comme orval pour les clients API, mais pour l’UI form RN).

## 4. Décision d’architecture (résumé)

- **CLI binaire** + templates (Handlebars/EJS ou TS string templates).  
- **Peer deps** : `react`, `react-native`, `zod` ; optionnel `react-hook-form` + `@hookform/resolvers`.  
- **UI adapter** : plain `View`/`TextInput` d’abord ; Paper / NativeWind plus tard.  
- **Navigation stubs** : Expo Router + React Navigation.  
- Détails → `ARCHITECTURE.md`, `DECISIONS.md`.

## 5. Critères de succès mesurables (v0.1)

| Critère | Cible |
|---------|--------|
| Génération d’un écran formulaire **8 champs** | **&lt; 2 s** wall-clock sur machine développeur moyenne (CI/example) |
| Dépendances runtime **obligatoires** au-delà de `zod` | **0** (RHF = peer optionnel) |
| Tests générés | **passent** sous Jest + RNTL dans `example/` |
| Delta bundle du runtime optionnel | **&lt; 8 KB** gzip (cible agressive **&lt; 5 KB** si possible) — à mesurer via `npx bundle-phobia` / metro analyzer |
| TypeScript | `strict: true` sur packages + code généré |
| Expo Go | Écran généré plain RN **exécutable** sans native modules custom |

## 6. Risques

1. **Parsing Zod** : AST TypeScript vs `zod-to-json-schema` — perte de refinements / messages custom.  
2. **Dérive templates** : code généré qui diverge après édition manuelle (besoin de marqueurs / regen).  
3. **Adoption** : « encore un outil » alors que RHF+Zod suffit pour beaucoup d’équipes.  
4. **Compat Expo Router file-based** : chemins `(auth)/register` vs React Navigation stacks.  
5. **Couverture types** : arrays d’objets, unions, `z.discriminatedUnion` — complexité v0.1.  
6. **a11y iOS vs Android** : `testID` vs `accessibilityLabel` (patterns SO historiques).  
7. **Licence / noms npm** : réserver le nom avant publication (disponibles au 2026-10-06).

## 7. Noms npm proposés (disponibilité vérifiée)

Commande : `npm view <name>` → **404 = libre** (vérifié **2026-10-06**).

| Nom | Statut | Commentaire |
|-----|--------|-------------|
| **`rn-schema-ui`** | Libre (404) | **Recommandé** — clair, schema→UI |
| **`formkit-rn`** | Libre (404) | Court, orienté kit |
| **`zod-rn-forms`** | Libre (404) | Ancré Zod ; moins JSON Schema |

Autres libres (backup) : `rn-formkit`, `schema-form-rn`, `formgen-rn`, `schema2rn`.

**Choix produit documenté** : package publié = **`rn-schema-ui`** (CLI `rn-schema-ui`) ; monorepo dossier = `rn-formkit`.
