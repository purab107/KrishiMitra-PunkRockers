import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Remove automatic navigation: require user to tap "Tap to continue".
    // Previously we auto-navigated to Language after 2s on native.
    // Keeping the effect empty so splash remains until user action.
  }, []);

  return (
    <Pressable onPress={() => navigation.navigate('Language')} style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>🌾</Text>
        <Text style={styles.title}>Krishi Mitra</Text>
        <Text style={styles.subtitle}>Smart Farming, Sustainable Future</Text>
        <Pressable 
          style={styles.skipButton}
          onPress={() => navigation.navigate('Language')}
          accessibilityLabel="Continue to language selection"
        >
          <Text style={styles.skipText}>Tap to continue</Text>
        </Pressable>
      </ScrollView>
    </Pressable>
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
