# Adapters UI

| Adapter | Statut             | Description                                                                           |
| ------- | ------------------ | ------------------------------------------------------------------------------------- |
| `plain` | **complet (v0.1)** | `View` / `Text` / `TextInput` / `Switch` / `Pressable`                                |
| `paper` | **partiel**        | Même structure ; commentaires Paper — pas de dépendance `react-native-paper` injectée |

```bash
node packages/cli/bin/rn-schema-ui.js generate ./schemas/user.ts --out ./app/register --adapter plain
node packages/cli/bin/rn-schema-ui.js generate ./schemas/user.ts --out ./app/register --adapter paper
```

## Navigation

| `--router` | Effet                                         |
| ---------- | --------------------------------------------- |
| `expo`     | Commentaire Expo Router (fichier sous `app/`) |
| `rn`       | Stub commentaire Stack.Navigator              |
