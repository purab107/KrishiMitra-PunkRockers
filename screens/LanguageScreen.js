import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

const languages = [
  { code: 'hi', name: 'हिन्दी' },
  { code: 'en', name: 'English' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'mr', name: 'मराठी' },
];

export default function LanguageScreen({ navigation }) {
  const [selected, setSelected] = useState('hi');

  const selectLanguage = (langCode) => {
    setSelected(langCode);
    setTimeout(() => {
      navigation.navigate('Login');
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌾</Text>
      <Text style={styles.title}>Krishi Mitra</Text>
      <Text style={styles.subtitle}>Choose your preferred language</Text>
      <Text style={styles.chooseText}>Choose/चुने</Text>
      
      <ScrollView style={styles.languageContainer}>
        {languages.map((lang) => (
          <Pressable
            key={lang.code}
            style={[
              styles.languageButton,
              selected === lang.code && styles.selectedButton
            ]}
            onPress={() => selectLanguage(lang.code)}
          >
            <Text style={[
              styles.languageText,
              selected === lang.code && styles.selectedText
            ]}>
              {lang.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  chooseText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 30,
  },
  languageContainer: {
    width: '100%',
  },
  languageButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  languageText: {
    fontSize: 16,
    color: '#333333',
  },
  selectedText: {
    color: '#ffffff',
  },
});
