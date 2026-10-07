# Manual protocol — Expo Go (real device)

Requirements: Node 18+, phone with **Expo Go**, same Wi‑Fi as the machine.

## 1. Prepare

```bash
cd rn-formkit
npm install && npm run build
cd example
```

## 2. Start

```bash
npx expo start
# if needed: npx expo start --tunnel
```

Scan the QR code with Expo Go (Android) or Camera (iOS).

## 3. Verify the form

1. Open “Open the Register form”.
2. Empty submit → validation errors (`alert` role).
3. Fill all fields (valid email, password ≥ 8, age ≥ 18, country, terms switch).
4. Submit → success alert.

## 4. Regenerate

```bash
npm run generate
node ../packages/cli/bin/rn-schema-ui.js generate ./schemas/user.ts \
  --out './app/(auth)/register' --name Register --watch
```

Reload in Expo Go.

## Troubleshooting

| Symptom                               | Action                                             |
| ------------------------------------- | -------------------------------------------------- |
| Cannot resolve `rn-schema-ui-runtime` | `npm run build` at repo root; check Metro → `dist` |
| QR unreachable                        | `--tunnel` or same VLAN                            |
| Stale Metro                           | `npx expo start -c`                                |
