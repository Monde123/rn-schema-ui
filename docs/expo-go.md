# Protocole manuel — Expo Go (appareil réel)

Prérequis : Node 18+, téléphone avec **Expo Go**, même réseau Wi‑Fi que la machine.

## 1. Préparer

```bash
cd /workspace/rn-formkit   # ou clone local
npm install
npm run build
cd example
```

## 2. Lancer le serveur

```bash
npx expo start
```

- Scanner le QR code avec Expo Go (Android) ou l’appareil photo (iOS).
- Si tunnel nécessaire : `npx expo start --tunnel`.

## 3. Vérifier le formulaire

1. Ouvrir le lien « Ouvrir le formulaire Register ».
2. Submit vide → messages d’erreur (role alert).
3. Remplir les 8 champs (e-mail valide, password ≥ 8, âge ≥ 18, pays, switch conditions).
4. Submit → alerte « Succès ».

## 4. Régénérer

```bash
npm run generate
# ou watch :
node ../packages/cli/bin/rn-schema-ui.js generate ./schemas/user.ts --out './app/(auth)/register' --name Register --watch
```

Recharger l’app dans Expo Go (secouer → Reload).

## Dépannage

| Symptôme                       | Action                                                                    |
| ------------------------------ | ------------------------------------------------------------------------- |
| Module `@rn-schema-ui/runtime` | `npm run build` à la racine ; vérifier `example/metro.config.js` → `dist` |
| QR inaccessible                | `--tunnel` ou même VLAN                                                   |
| Cache Metro                    | `npx expo start -c`                                                       |
