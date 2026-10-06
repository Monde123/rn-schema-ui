import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout(): React.ReactElement {
  return <Stack screenOptions={{ headerShown: true }} />;
}
