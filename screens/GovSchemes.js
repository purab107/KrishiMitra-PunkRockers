import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GovSchemes() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Government Schemes</Text>
      <Text style={styles.subtitle}>Placeholder screen — add content here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600' },
  subtitle: { marginTop: 8, color: '#666' },
});
