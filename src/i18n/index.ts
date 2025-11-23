// Purpose: i18n configuration
// Reason: Initialize i18next for multi-language support

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import fr from './locales/fr.json';
import ko from './locales/ko.json';
import ru from './locales/ru.json';

const LANGUAGE_KEY = '@app_language';

// Purpose: Get saved language preference
// Reason: Restore user's language choice
const getSavedLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    return savedLanguage || 'en';
  } catch {
    return 'en';
  }
};

// Purpose: Initialize i18n with saved language
// Reason: Set up translation system with user preference
export const initI18n = async (): Promise<void> => {
  const savedLanguage = await getSavedLanguage();

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      ja: { translation: ja },
      fr: { translation: fr },
      ko: { translation: ko },
      ru: { translation: ru },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

// Purpose: Change language and save preference
// Reason: Allow users to switch languages and persist choice
export const changeLanguage = async (language: string): Promise<void> => {
  await i18n.changeLanguage(language);
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
};

export default i18n;

