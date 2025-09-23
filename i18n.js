import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import enCommon from './locales/en/common.json';
import enTutorial from './locales/en/tutorial.json';
import enNavigation from './locales/en/navigation.json';
import enAuth from './locales/en/auth.json';
import enProfile from './locales/en/profile.json';
import enCrop from './locales/en/crop.json';
import enCalendar from './locales/en/calendar.json';

import hiCommon from './locales/hi/common.json';
import hiTutorial from './locales/hi/tutorial.json';
import hiNavigation from './locales/hi/navigation.json';
import hiAuth from './locales/hi/auth.json';
import hiProfile from './locales/hi/profile.json';
import hiCrop from './locales/hi/crop.json';
import hiCalendar from './locales/hi/calendar.json';

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      // Get saved language from AsyncStorage
      const savedLanguage = await AsyncStorage.getItem('userLanguage');
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }
      
      // Fallback to device language
      const deviceLanguage = Localization.locale.split('-')[0];
      const supportedLanguages = ['hi', 'en', 'bn', 'ta', 'te', 'mr'];
      
      if (supportedLanguages.includes(deviceLanguage)) {
        callback(deviceLanguage);
      } else {
        callback('hi'); // Default to Hindi
      }
    } catch (error) {
      console.log('Language detection error:', error);
      callback('hi'); // Default to Hindi on error
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem('userLanguage', language);
    } catch (error) {
      console.log('Language caching error:', error);
    }
  },
};

const resources = {
  en: {
    common: enCommon,
    tutorial: enTutorial,
    navigation: enNavigation,
    auth: enAuth,
    profile: enProfile,
    crop: enCrop,
    calendar: enCalendar,
  },
  hi: {
    common: hiCommon,
    tutorial: hiTutorial,
    navigation: hiNavigation,
    auth: hiAuth,
    profile: hiProfile,
    crop: hiCrop,
    calendar: hiCalendar,
  },
  // Add other languages as they're created
  bn: {
    common: hiCommon, // Fallback to Hindi for now
    tutorial: hiTutorial,
    navigation: hiNavigation,
    auth: hiAuth,
    profile: hiProfile,
    crop: hiCrop,
    calendar: hiCalendar,
  },
  ta: {
    common: hiCommon, // Fallback to Hindi for now
    tutorial: hiTutorial,
    navigation: hiNavigation,
    auth: hiAuth,
    profile: hiProfile,
    crop: hiCrop,
    calendar: hiCalendar,
  },
  te: {
    common: hiCommon, // Fallback to Hindi for now
    tutorial: hiTutorial,
    navigation: hiNavigation,
    auth: hiAuth,
    profile: hiProfile,
    crop: hiCrop,
    calendar: hiCalendar,
  },
  mr: {
    common: hiCommon, // Fallback to Hindi for now
    tutorial: hiTutorial,
    navigation: hiNavigation,
    auth: hiAuth,
    profile: hiProfile,
    crop: hiCrop,
    calendar: hiCalendar,
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'hi',
    defaultNS: 'common',
    ns: ['common', 'tutorial', 'navigation', 'auth', 'profile', 'crop', 'calendar'],
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;