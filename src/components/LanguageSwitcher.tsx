// Purpose: Language switcher component
// Reason: Allow users to switch between supported languages

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'fr', label: 'Français' },
  { code: 'ko', label: '한국어' },
  { code: 'ru', label: 'Русский' },
];

export const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode);
  };

  return (
    <Card style={styles.card}>
      <Card.Title title={t('language.title')} />
      <Card.Content>
        <View style={styles.chipContainer}>
          {LANGUAGES.map((lang) => (
            <Chip
              key={lang.code}
              selected={i18n.language === lang.code}
              onPress={() => handleLanguageChange(lang.code)}
              style={styles.chip}
              mode={i18n.language === lang.code ? 'flat' : 'outlined'}>
              {lang.label}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
});

