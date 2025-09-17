import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const timer = setTimeout(() => {
        navigation.navigate('Language');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.logo}>🌾</Text>
      <Text style={styles.title}>Krishi Mitra</Text>
      <Text style={styles.subtitle}>Smart Farming, Sustainable Future</Text>
      <TouchableOpacity 
        style={styles.skipButton}
        onPress={() => navigation.navigate('Language')}
      >
        <Text style={styles.skipText}>Tap to continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  skipButton: {
    position: 'absolute',
    bottom: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  skipText: {
    color: '#2E7D32',
    fontSize: 16,
  },
});
