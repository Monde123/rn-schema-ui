# rn-schema-ui

CLI that turns a Zod (or JSON Schema) object into a React Native form screen, validation wiring, UI states, and React Native Testing Library tests. Works for iOS, Android, and web (Expo).

```bash
npx rn-schema-ui init
npx rn-schema-ui generate ./schemas/signup.ts --out ./app/signup --name Signup
npm i rn-schema-ui-runtime zod
```

Generated screens import [`rn-schema-ui-runtime`](https://www.npmjs.com/package/rn-schema-ui-runtime).

Full docs: https://github.com/Monde123/rn-schema-ui#readme
