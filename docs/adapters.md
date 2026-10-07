# UI adapters

| Adapter | Status              | Description                                                             |
| ------- | ------------------- | ----------------------------------------------------------------------- |
| `plain` | **complete (v0.1)** | `View` / `Text` / `TextInput` / `Switch` / `Pressable`                  |
| `paper` | **partial**         | Same structure; Paper comments only — no `react-native-paper` injection |

```bash
npx rn-schema-ui generate ./schemas/user.ts --out ./app/register --adapter plain
```

| `--router` | Effect                              |
| ---------- | ----------------------------------- |
| `expo`     | Expo Router file comment            |
| `rn`       | React Navigation stack stub comment |

## Multiplatform note

`plain` adapter output is intended for **iOS, Android, and web**. Prefer RN core components. If you branch on platform, use `Platform.select` / `Platform.OS` and keep a web-safe path.
