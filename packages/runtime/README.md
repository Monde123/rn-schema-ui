# rn-schema-ui-runtime

Thin runtime used by screens generated with [`rn-schema-ui`](https://www.npmjs.com/package/rn-schema-ui).

- `useForm({ schema, defaultValues, onSubmit })` — controlled values, field errors, `zod.safeParse` on submit
- `useField`, `FormProvider`
- `LoadingState`, `ErrorState`, `EmptyState`, `SuccessState`, `ScreenStates`

```bash
npm i rn-schema-ui-runtime zod
```

Peers: `react`, `react-native`, `zod`. Works on iOS, Android, and web (react-native-web). ~3 KB gzip.

Full docs: https://github.com/Monde123/rn-schema-ui#readme
