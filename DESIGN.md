# DESIGN — écrans, états, tests

## Principes UX développeur

1. **Schéma = source de vérité** — types, validation, labels dérivés.  
2. **Code généré lisible** — pas de magie opaque ; le développeur peut éditer après coup.  
3. **États de premier ordre** — loading / error / empty ne sont pas des afterthoughts.  
4. **a11y by default** — chaque champ a label + hint ; tests interrogent via `getByLabelText`.  
5. **FR d’abord** — messages de validation et docs en français (locale config).

## Template écran (plain)

Structure mentale :

```
SafeAreaView / KeyboardAvoidingView
  ScrollView (keyboardShouldPersistTaps="handled")
    Header (titre dérivé du schema name)
    [si loading] → <Loading />
    [si error réseau] → <Error onRetry />
    [si empty initial optionnel] → <Empty />
    sinon → Form fields…
      Submit Pressable
    Toast succès (stub : Alert.alert ou console)
```

### Hook formulaire

**Décision** : code généré utilise `useForm` de **react-hook-form** + `zodResolver` lorsque `--rhf` (défaut).  
Sinon : `useState` + `schema.safeParse` (fallback sans peer RHF).

### Champ type (exemple email)

```tsx
<Text nativeID="label-email">E-mail</Text>
<TextInput
  accessibilityLabel="E-mail"
  accessibilityHint="Saisissez votre adresse e-mail"
  accessibilityLabeledBy="label-email"
  keyboardType="email-address"
  autoCapitalize="none"
  autoComplete="email"
  value={value}
  onChangeText={onChange}
  onBlur={onBlur}
  testID="field-email"
/>
{error ? <Text accessibilityRole="alert">{error.message}</Text> : null}
```

## États

| État | Quand | Contenu |
|------|-------|---------|
| **Loading** | `isSubmitting` ou prop `status==='loading'` | `ActivityIndicator` + texte « Chargement… » |
| **Error** | prop `status==='error'` ou erreur submit | Message + bouton « Réessayer » |
| **Empty** | liste/données absentes (opt-in schema meta) | Illustration texte + CTA |
| **Success** | après submit OK | Stub `Alert.alert('Succès')` ou callback `onSuccess` |

## Tests RNTL générés

Scénarios minimaux :

1. Rendu : tous les labels de champs visibles.  
2. Validation : submit vide → messages d’erreur (`findByRole('alert')` ou texte).  
3. Remplissage heureux : `fireEvent.changeText` + submit → `onSubmit` appelé avec payload parsé.  
4. a11y : `getByLabelText` pour chaque champ.

Dépendances de test (example) : `@testing-library/react-native`, `jest`, `react-test-renderer`.

## Tokens visuels (plain v0.1)

Pas de design system lourd : `StyleSheet` local, espacements 8/16, contrast erreur `#B00020`, focus border `#2563EB`. Adapters futurs injectent tokens Paper/NativeWind.

## Accessibilité iOS / Android

Helper généré :

```ts
export function testProps(id: string) {
  return { testID: id, accessibilityLabel: id };
}
```

Documenter dans docs que les labels humains FR sont préférés pour `accessibilityLabel` (pas seulement l’id).
