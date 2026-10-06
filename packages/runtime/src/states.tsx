import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { FormStatus } from './types.js';

type BaseProps = {
  message?: string;
  testID?: string;
};

export function LoadingState({
  message = 'Loading…',
  testID = 'state-loading',
}: BaseProps): React.ReactElement {
  return (
    <View style={styles.center} testID={testID} accessibilityRole="progressbar">
      <ActivityIndicator />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

export function ErrorState({
  message = 'Something went wrong.',
  onRetry,
  testID = 'state-error',
}: BaseProps & { onRetry?: () => void }): React.ReactElement {
  return (
    <View style={styles.center} testID={testID}>
      <Text style={styles.error} accessibilityRole="alert">
        {message}
      </Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry"
          style={styles.button}
          testID={`${testID}-retry`}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyState({
  message = 'No data.',
  testID = 'state-empty',
}: BaseProps): React.ReactElement {
  return (
    <View style={styles.center} testID={testID}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

export function SuccessState({
  message = 'Success.',
  testID = 'state-success',
}: BaseProps): React.ReactElement {
  return (
    <View style={styles.center} testID={testID}>
      <Text style={styles.success} accessibilityRole="alert">
        {message}
      </Text>
    </View>
  );
}

/** Affiche l’état d’écran selon `status` ; `idle` → children. */
export function ScreenStates({
  status,
  children,
  loadingMessage,
  errorMessage,
  emptyMessage,
  successMessage,
  onRetry,
}: {
  status: FormStatus;
  children: React.ReactNode;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  successMessage?: string;
  onRetry?: () => void;
}): React.ReactElement {
  if (status === 'loading') return <LoadingState message={loadingMessage} />;
  if (status === 'empty') return <EmptyState message={emptyMessage} />;
  if (status === 'error' && !children) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }
  if (status === 'success' && successMessage) {
    return (
      <>
        <SuccessState message={successMessage} />
        {children as React.ReactElement}
      </>
    );
  }
  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { padding: 16, alignItems: 'center', gap: 8 },
  text: { fontSize: 16, color: '#111' },
  error: { fontSize: 16, color: '#B00020' },
  success: { fontSize: 16, color: '#15803d' },
  button: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
