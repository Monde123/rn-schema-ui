/* eslint-disable */
// Généré par rn-schema-ui — ne pas éditer à la main si vous régénérez.
/** Écran Expo Router — placez ce fichier sous app/… */
import React, { useCallback } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SuccessState,
  useForm,
} from '@rn-schema-ui/runtime';
import { userSchema } from '../../../schemas/user';

export type RegisterProps = {
  onSuccess?: (values: Record<string, unknown>) => void;
};

export function RegisterScreen(props: RegisterProps = {}): React.ReactElement {
  const { onSuccess } = props;
  const form = useForm({
    schema: userSchema,
    defaultValues: {
    "firstName": '',
    "lastName": '',
    "email": '',
    "password": '',
    "age": undefined,
    "acceptTerms": false,
    "country": '',
    "bio": '',
    },
    onSubmit: async (values) => {
      onSuccess?.(values);
      Alert.alert('Succès', 'Formulaire envoyé.');
    },
  });

  const { values, errors, setValue, handleSubmit, status, isSubmitting, setStatus, reset } = form;

  const onRetry = useCallback(() => {
    setStatus('idle');
  }, [setStatus]);

  if (status === 'loading' && isSubmitting) {
    return <LoadingState />;
  }
  if (status === 'empty') {
    return <EmptyState />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      testID="screen-register"
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{"Register"}</Text>
        {status === 'error' && errors._form ? (
          <ErrorState message={errors._form} onRetry={onRetry} />
        ) : null}
        {status === 'success' ? <SuccessState message="Formulaire validé." /> : null}

      
      <Text style={styles.label} nativeID="label-field-firstName">{"Prénom"}</Text>
      <TextInput
        value={values["firstName"] == null ? '' : String(values["firstName"])}
        onChangeText={(t) => setValue("firstName", t)}
        accessibilityLabel={"Prénom"}
        accessibilityHint={"Saisissez prénom"}
        accessibilityLabeledBy="label-field-firstName"
        testID="field-firstName"
        style={styles.input}
        keyboardType="default"
        autoCapitalize="sentences"
        secureTextEntry={false}
        textContentType="none"
        autoComplete="off"
      />
      {errors["firstName"] ? (
        <Text style={styles.error} accessibilityRole="alert" testID="error-firstName">
          {errors["firstName"]}
        </Text>
      ) : null}

      
      <Text style={styles.label} nativeID="label-field-lastName">{"Nom"}</Text>
      <TextInput
        value={values["lastName"] == null ? '' : String(values["lastName"])}
        onChangeText={(t) => setValue("lastName", t)}
        accessibilityLabel={"Nom"}
        accessibilityHint={"Saisissez nom"}
        accessibilityLabeledBy="label-field-lastName"
        testID="field-lastName"
        style={styles.input}
        keyboardType="default"
        autoCapitalize="sentences"
        secureTextEntry={false}
        textContentType="none"
        autoComplete="off"
      />
      {errors["lastName"] ? (
        <Text style={styles.error} accessibilityRole="alert" testID="error-lastName">
          {errors["lastName"]}
        </Text>
      ) : null}

      
      <Text style={styles.label} nativeID="label-field-email">{"E-mail"}</Text>
      <TextInput
        value={values["email"] == null ? '' : String(values["email"])}
        onChangeText={(t) => setValue("email", t)}
        accessibilityLabel={"E-mail"}
        accessibilityHint={"Saisissez votre e-mail"}
        accessibilityLabeledBy="label-field-email"
        testID="field-email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        secureTextEntry={false}
        textContentType="emailAddress"
        autoComplete="email"
      />
      {errors["email"] ? (
        <Text style={styles.error} accessibilityRole="alert" testID="error-email">
          {errors["email"]}
        </Text>
      ) : null}

      
      <Text style={styles.label} nativeID="label-field-password">{"Mot de passe"}</Text>
      <TextInput
        value={values["password"] == null ? '' : String(values["password"])}
        onChangeText={(t) => setValue("password", t)}
        accessibilityLabel={"Mot de passe"}
        accessibilityHint={"Saisissez un mot de passe sécurisé"}
        accessibilityLabeledBy="label-field-password"
        testID="field-password"
        style={styles.input}
        keyboardType="default"
        autoCapitalize="none"
        secureTextEntry={true}
        textContentType="password"
        autoComplete="password"
      />
      {errors["password"] ? (
        <Text style={styles.error} accessibilityRole="alert" testID="error-password">
          {errors["password"]}
        </Text>
      ) : null}

      
      <Text style={styles.label} nativeID="label-field-age">{"Âge"}</Text>
      <TextInput
        value={values["age"] == null ? '' : String(values["age"])}
        onChangeText={(t) => setValue("age", t === "" ? undefined : Number(t))}
        accessibilityLabel={"Âge"}
        accessibilityHint={"Saisissez âge"}
        accessibilityLabeledBy="label-field-age"
        testID="field-age"
        style={styles.input}
        keyboardType="numeric"
        autoCapitalize="sentences"
        secureTextEntry={false}
        textContentType="none"
        autoComplete="off"
      />
      {errors["age"] ? (
        <Text style={styles.error} accessibilityRole="alert" testID="error-age">
          {errors["age"]}
        </Text>
      ) : null}

      
      <Text style={styles.label} nativeID="label-field-acceptTerms">{"Accepter les conditions"}</Text>
      <View style={styles.row}>
        <Text>{"Accepter les conditions"}</Text>
        <Switch
          value={Boolean(values["acceptTerms"])}
          onValueChange={(v) => setValue("acceptTerms", v)}
          accessibilityLabel={"Accepter les conditions"}
          accessibilityHint={"Activez si accepter les conditions"}
          accessibilityRole="switch"
          testID="field-acceptTerms"
        />
      </View>
      {errors["acceptTerms"] ? (
        <Text style={styles.error} accessibilityRole="alert" testID="error-acceptTerms">
          {errors["acceptTerms"]}
        </Text>
      ) : null}

      
      <Text style={styles.label} nativeID="label-field-country">{"Pays"}</Text>
      <View style={styles.chips} accessibilityLabel={"Pays"} testID="field-country">
        <Pressable
            key="BJ"
            onPress={() => setValue("country", "BJ")}
            style={[styles.chip, values["country"] === "BJ" && styles.chipOn]}
            accessibilityRole="button"
            accessibilityLabel={"Pays: BJ"}
            testID="field-country-BJ"
          >
            <Text>{"BJ"}</Text>
          </Pressable>
        <Pressable
            key="FR"
            onPress={() => setValue("country", "FR")}
            style={[styles.chip, values["country"] === "FR" && styles.chipOn]}
            accessibilityRole="button"
            accessibilityLabel={"Pays: FR"}
            testID="field-country-FR"
          >
            <Text>{"FR"}</Text>
          </Pressable>
        <Pressable
            key="SN"
            onPress={() => setValue("country", "SN")}
            style={[styles.chip, values["country"] === "SN" && styles.chipOn]}
            accessibilityRole="button"
            accessibilityLabel={"Pays: SN"}
            testID="field-country-SN"
          >
            <Text>{"SN"}</Text>
          </Pressable>
        <Pressable
            key="CI"
            onPress={() => setValue("country", "CI")}
            style={[styles.chip, values["country"] === "CI" && styles.chipOn]}
            accessibilityRole="button"
            accessibilityLabel={"Pays: CI"}
            testID="field-country-CI"
          >
            <Text>{"CI"}</Text>
          </Pressable>
      </View>
      {errors["country"] ? (
        <Text style={styles.error} accessibilityRole="alert" testID="error-country">
          {errors["country"]}
        </Text>
      ) : null}

      
      <Text style={styles.label} nativeID="label-field-bio">{"Bio"}</Text>
      <TextInput
        value={values["bio"] == null ? '' : String(values["bio"])}
        onChangeText={(t) => setValue("bio", t)}
        accessibilityLabel={"Bio"}
        accessibilityHint={"Saisissez bio"}
        accessibilityLabeledBy="label-field-bio"
        testID="field-bio"
        style={styles.input}
        keyboardType="default"
        autoCapitalize="sentences"
        secureTextEntry={false}
        textContentType="none"
        autoComplete="off"
      />
      {errors["bio"] ? (
        <Text style={styles.error} accessibilityRole="alert" testID="error-bio">
          {errors["bio"]}
        </Text>
      ) : null}
        <Pressable
          onPress={() => { void handleSubmit(); }}
          accessibilityRole="button"
          accessibilityLabel="Envoyer"
          testID="submit"
          style={styles.button}
        >
          <Text style={styles.buttonText}>Envoyer</Text>
        </Pressable>
        <Pressable onPress={() => reset()} testID="reset" accessibilityRole="button" accessibilityLabel="Réinitialiser">
          <Text style={styles.link}>Réinitialiser</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 8 },
  section: { fontSize: 16, fontWeight: '700', marginTop: 16, color: '#334155' },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  error: { color: '#B00020', fontSize: 13 },
  button: {
    marginTop: 16,
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  buttonSecondary: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  link: { marginTop: 12, textAlign: 'center', color: '#2563EB' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#cbd5e1' },
  chipOn: { backgroundColor: '#dbeafe', borderColor: '#2563EB' },
});

export default RegisterScreen;
