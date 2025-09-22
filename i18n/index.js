import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './locales/en';
import hi from './locales/hi';
import bn from './locales/bn';
import ta from './locales/ta';
import te from './locales/te';
import mr from './locales/mr';

// Language detector
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      // Try to get saved language from AsyncStorage
      const savedLanguage = await AsyncStorage.getItem('user-language');
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }
      
      // Fallback to device language
      const deviceLanguage = RNLocalize.getLocales()[0]?.languageCode || 'hi';
      
      // Map device language to supported languages
      const supportedLanguages = ['hi', 'en', 'bn', 'ta', 'te', 'mr'];
      const selectedLanguage = supportedLanguages.includes(deviceLanguage) 
        ? deviceLanguage 
        : 'hi'; // Default to Hindi
      
      callback(selectedLanguage);
    } catch (error) {
      console.log('Language detection error:', error);
      callback('hi'); // Fallback to Hindi
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem('user-language', language);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  },
};

const resources = {
  en,
  hi,
  bn,
  ta,
  te,
  mr,
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'hi', // Default to Hindi
    debug: __DEV__, // Enable debug in development
    
    // Namespace settings
    defaultNS: 'common',
    fallbackNS: 'common',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
    
    // Cache settings
    cache: {
      enabled: true,
    },
  });

export default i18n;