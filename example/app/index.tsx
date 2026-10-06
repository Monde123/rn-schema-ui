import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Home(): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>rn-schema-ui example</Text>
      <Link href="/(auth)/register" style={styles.link}>
        Open the Register form
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  link: { color: '#2563EB', fontSize: 16 },
});
