# Analysis — rn-schema-ui

Written: 2026-10-06. Metrics below are from cited public sources; **no invented numbers**.

## Pain

Building RN forms repeats TextInput wiring, validation, keyboard/`secureTextEntry`, a11y, loading/error/empty states, and RNTL tests. Runtime libraries (Formik, React Hook Form) help with state—they do **not** generate screens, a11y props, or tests.

### Community evidence (dated)

| Observation                                                                         | Source                                                                                                                                                                                                                                         | When                  |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| State of React 2024: RHF **4,275** respondents; Formik **2,795**                    | [stateofreact.com](https://2024.stateofreact.com/en-US/libraries/component-libraries/)                                                                                                                                                         | 2024                  |
| Zod leading validation (**3,893** in State of React 2024)                           | [Other Tools](https://2024.stateofreact.com/en-US/other-tools/)                                                                                                                                                                                | 2024                  |
| npm last-month downloads (sampled 2026-10-06): RHF ~241M; Formik ~18.7M; Zod ~1.26B | npm downloads API                                                                                                                                                                                                                              | 2026-09-05→2026-10-04 |
| RN TextInput validation flash (`onChangeText` async)                                | [facebook/react-native#47252](https://github.com/facebook/react-native/issues/47252)                                                                                                                                                           | opened 2024-10-28     |
| KeyboardAvoidingView + Formik wizard pain                                           | [SO 61107922](https://stackoverflow.com/questions/61107922/how-to-get-keyboardavoidingview-to-work-with-a-formik-wizard)                                                                                                                       | 2020                  |
| RNTL TextInput testing / `accessibilityLabel`                                       | [SO 68519431](https://stackoverflow.com/questions/68519431/no-handler-function-found-for-event-changetext), [SO 71975948](https://stackoverflow.com/questions/71975948/how-to-test-textinput-in-react-native-with-testing-library-reat-native) | 2021–2022             |

## Competitors (gist)

| Approach                                     | Generate vs runtime     | Gap vs rn-schema-ui                  |
| -------------------------------------------- | ----------------------- | ------------------------------------ |
| Formik / RHF + Zod                           | Runtime only            | No screen/a11y/test codegen          |
| Formisch, Paper, Gluestack, Tamagui, Restyle | UI / form runtime       | Not schema→typed RN screen+tests     |
| orval / openapi-generator                    | API clients / types     | Not RN form UI                       |
| Hygen / Plop / AI prompts                    | DIY / non-deterministic | No Zod dialect + RNTL out of the box |

## Originality

**Codegen**, not a form runtime: emit typed RN screens + states + tests from Zod (preferred) or JSON Schema, with an optional thin runtime.

## Success criteria (v0.1)

| Criterion                         | Target                 |
| --------------------------------- | ---------------------- |
| Generate 8-field screen           | &lt; 2s                |
| Mandatory runtime deps beyond zod | 0                      |
| Generated tests                   | pass under Jest + RNTL |
| Optional runtime gzip             | &lt; 8 KB (aim &lt; 5) |
| TypeScript                        | `strict: true`         |

## Risks

Zod refinement loss via IR, template drift after hand-edits, adoption (“yet another tool”), Expo Router vs RN Navigation paths, deep unions/arrays, iOS/Android a11y id patterns.
