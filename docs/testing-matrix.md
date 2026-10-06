# Testing matrix

| Layer                        | iOS | Android | Web              |
| ---------------------------- | --- | ------- | ---------------- |
| Unit (Jest + RNTL)           | ✓   | ✓       | ✓ (same JS)      |
| Generate golden snapshots    | ✓   | ✓       | ✓                |
| `expo export --platform web` | —   | —       | ✓ (CI)           |
| Expo Go manual               | ✓   | ✓       | browser optional |

Run locally:

```bash
npm test
cd example && npx expo export --platform web
cd example && npx expo start   # then open iOS / Android / web
```
