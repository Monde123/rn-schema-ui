import type { FieldIR, GenerateOptions, SchemaIR } from './ir.js';

function fieldBlock(f: FieldIR, adapter: 'plain' | 'paper'): string {
  const id = `field-${f.key.replace(/\./g, '-')}`;
  const errId = `error-${f.key.replace(/\./g, '-')}`;
  if (adapter === 'paper') {
    // Partial Paper stub — falls back to TextInput-like comments
    return `
      {/* Paper adapter (partial) */}
      ${sectionHeader(f)}
      <Text style={styles.label}>{${JSON.stringify(f.label)}}</Text>
      ${controlJsx(f, id, true)}
      {errors[${JSON.stringify(f.key)}] ? (
        <Text style={styles.error} accessibilityRole="alert" testID="${errId}">
          {errors[${JSON.stringify(f.key)}]}
        </Text>
      ) : null}`;
  }
  return `
      ${sectionHeader(f)}
      <Text style={styles.label} nativeID="label-${id}">{${JSON.stringify(f.label)}}</Text>
      ${controlJsx(f, id, false)}
      {errors[${JSON.stringify(f.key)}] ? (
        <Text style={styles.error} accessibilityRole="alert" testID="${errId}">
          {errors[${JSON.stringify(f.key)}]}
        </Text>
      ) : null}`;
}

function sectionHeader(f: FieldIR): string {
  if (!f.section) return '';
  return `<Text style={styles.section}>{${JSON.stringify(f.section)}}</Text>`;
}

function controlJsx(f: FieldIR, id: string, _paper: boolean): string {
  const label = JSON.stringify(f.label);
  const hint = JSON.stringify(f.hint);
  switch (f.kind) {
    case 'boolean':
      return `<View style={styles.row}>
        <Text>{${label}}</Text>
        <Switch
          value={Boolean(values[${JSON.stringify(f.key)}])}
          onValueChange={(v) => setValue(${JSON.stringify(f.key)}, v)}
          accessibilityLabel={${label}}
          accessibilityHint={${hint}}
          accessibilityRole="switch"
          testID="${id}"
        />
      </View>`;
    case 'enum': {
      const opts = (f.enumValues ?? []).map(
        (v) => `<Pressable
            key="${v}"
            onPress={() => setValue(${JSON.stringify(f.key)}, ${JSON.stringify(v)})}
            style={[styles.chip, values[${JSON.stringify(f.key)}] === ${JSON.stringify(v)} && styles.chipOn]}
            accessibilityRole="button"
            accessibilityLabel={${JSON.stringify(`${f.label}: ${v}`)}}
            testID="${id}-${v}"
          >
            <Text>{${JSON.stringify(v)}}</Text>
          </Pressable>`,
      );
      return `<View style={styles.chips} accessibilityLabel={${label}} testID="${id}">
        ${opts.join('\n        ')}
      </View>`;
    }
    case 'array':
      return `<View testID="${id}">
        {(Array.isArray(values[${JSON.stringify(f.key)}]) ? (values[${JSON.stringify(f.key)}] as string[]) : []).map((item, index) => (
          <TextInput
            key={String(index)}
            value={String(item ?? '')}
            onChangeText={(t) => {
              const arr = [...(Array.isArray(values[${JSON.stringify(f.key)}]) ? (values[${JSON.stringify(f.key)}] as string[]) : [])];
              arr[index] = t;
              setValue(${JSON.stringify(f.key)}, arr);
            }}
            accessibilityLabel={${JSON.stringify(f.label)} + ' ' + String(index + 1)}
            testID={"${id}-" + String(index)}
            style={styles.input}
          />
        ))}
        <Pressable
          onPress={() => {
            const arr = [...(Array.isArray(values[${JSON.stringify(f.key)}]) ? (values[${JSON.stringify(f.key)}] as unknown[]) : []), ''];
            setValue(${JSON.stringify(f.key)}, arr);
          }}
          accessibilityRole="button"
          accessibilityLabel={${JSON.stringify('Add ' + f.label)}}
          testID="${id}-add"
          style={styles.buttonSecondary}
        >
          <Text>Add</Text>
        </Pressable>
      </View>`;
    default: {
      const keyboard =
        f.kind === 'email' ? 'email-address' : f.kind === 'number' ? 'numeric' : 'default';
      const secure = f.kind === 'password';
      const autoCap = f.kind === 'email' || f.kind === 'password' ? 'none' : 'sentences';
      const contentType =
        f.kind === 'email'
          ? 'emailAddress'
          : f.kind === 'password'
            ? 'password'
            : f.kind === 'date'
              ? 'none'
              : 'none';
      return `<TextInput
        value={values[${JSON.stringify(f.key)}] == null ? '' : String(values[${JSON.stringify(f.key)}])}
        onChangeText={(t) => setValue(${JSON.stringify(f.key)}, ${
          f.kind === 'number' ? 't === "" ? undefined : Number(t)' : 't'
        })}
        accessibilityLabel={${label}}
        accessibilityHint={${hint}}
        accessibilityLabeledBy="label-${id}"
        testID="${id}"
        style={styles.input}
        keyboardType="${keyboard}"
        autoCapitalize="${autoCap}"
        secureTextEntry={${secure}}
        textContentType="${contentType}"
        autoComplete="${f.kind === 'email' ? 'email' : f.kind === 'password' ? 'password' : 'off'}"
      />`;
    }
  }
}

export function renderScreen(ir: SchemaIR, opts: GenerateOptions): string {
  const fields = ir.fields.map((f) => fieldBlock(f, opts.adapter)).join('\n');
  const routerComment =
    opts.router === 'expo'
      ? `/** Expo Router screen — place this file under app/… */`
      : `/** React Navigation stub — register in your Stack.Navigator:
 * <Stack.Screen name="${opts.componentName}" component={${opts.componentName}Screen} />
 */`;

  const defaultValues = ir.fields
    .map((f) => {
      if (f.kind === 'boolean') return `    ${JSON.stringify(f.key)}: false,`;
      if (f.kind === 'array') return `    ${JSON.stringify(f.key)}: [],`;
      if (f.kind === 'number') return `    ${JSON.stringify(f.key)}: undefined,`;
      return `    ${JSON.stringify(f.key)}: '',`;
    })
    .join('\n');

  return `/* eslint-disable */
// Generated by rn-schema-ui — avoid hand-edits if you plan to regenerate.
// Targets: iOS, Android, and web (Expo / react-native-web).
${routerComment}
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
import { ${ir.exportName} } from '${ir.schemaImportPath}';

export type ${opts.componentName}Props = {
  onSuccess?: (values: Record<string, unknown>) => void;
};

export function ${opts.componentName}Screen(props: ${opts.componentName}Props = {}): React.ReactElement {
  const { onSuccess } = props;
  const form = useForm({
    schema: ${ir.exportName},
    defaultValues: {
${defaultValues}
    },
    onSubmit: async (values) => {
      onSuccess?.(values);
      Alert.alert('Success', 'Form submitted.');
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
      testID="screen-${opts.componentName.toLowerCase()}"
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{${JSON.stringify(opts.componentName)}}</Text>
        {status === 'error' && errors._form ? (
          <ErrorState message={errors._form} onRetry={onRetry} />
        ) : null}
        {status === 'success' ? <SuccessState message="Form validated." /> : null}
${fields}
        <Pressable
          onPress={() => { void handleSubmit(); }}
          accessibilityRole="button"
          accessibilityLabel="Submit"
          testID="submit"
          style={styles.button}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
        <Pressable onPress={() => reset()} testID="reset" accessibilityRole="button" accessibilityLabel="Reset">
          <Text style={styles.link}>Reset</Text>
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

export default ${opts.componentName}Screen;
`;
}

export function renderTest(ir: SchemaIR, opts: GenerateOptions): string {
  const firstText = ir.fields.find((f) =>
    ['string', 'email', 'password', 'number', 'date'].includes(f.kind),
  );
  const fillBlocks = ir.fields
    .map((f) => {
      const id = `field-${f.key.replace(/\./g, '-')}`;
      switch (f.kind) {
        case 'boolean':
          return `  fireEvent(getByTestId('${id}'), 'valueChange', true);`;
        case 'enum': {
          const v = f.enumValues?.[0] ?? 'A';
          return `  fireEvent.press(getByTestId('${id}-${v}'));`;
        }
        case 'number':
          return `  fireEvent.changeText(getByTestId('${id}'), '21');`;
        case 'array':
          return `  fireEvent.press(getByTestId('${id}-add'));
  fireEvent.changeText(getByTestId('${id}-0'), 'item');`;
        case 'email':
          return `  fireEvent.changeText(getByTestId('${id}'), 'user@example.com');`;
        case 'password':
          return `  fireEvent.changeText(getByTestId('${id}'), 'password1');`;
        default:
          return `  fireEvent.changeText(getByTestId('${id}'), 'value');`;
      }
    })
    .join('\n');

  const labelAssert = firstText
    ? `  expect(getByLabelText(${JSON.stringify(firstText.label)})).toBeTruthy();`
    : `  expect(getByTestId('submit')).toBeTruthy();`;

  return `import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ${opts.componentName}Screen } from '../index';

describe('${opts.componentName}Screen', () => {
  it('rend les champs', () => {
    const { getByLabelText, getByTestId } = render(<${opts.componentName}Screen />);
${labelAssert}
    expect(getByTestId('submit')).toBeTruthy();
  });

  it('affiche des erreurs de validation au submit vide', async () => {
    const { getByTestId, findAllByRole } = render(<${opts.componentName}Screen />);
    fireEvent.press(getByTestId('submit'));
    const alerts = await findAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
  });

  it('soumet avec succès quand valide', async () => {
    const onSuccess = jest.fn();
    const { getByTestId } = render(<${opts.componentName}Screen onSuccess={onSuccess} />);
${fillBlocks}
    fireEvent.press(getByTestId('submit'));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });
});
`;
}

export function renderStatesBarrel(): string {
  return `export {
  LoadingState,
  ErrorState,
  EmptyState,
  SuccessState,
  ScreenStates,
} from '@rn-schema-ui/runtime';
`;
}
