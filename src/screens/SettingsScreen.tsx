// Purpose: Settings screen
// Reason: Allow users to configure parameters like offset

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, TextInput, Button, Paragraph } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { getSettings, saveSettings } from '../utils/storage';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [offset, setOffset] = useState<string>('0');

  // Purpose: Load saved settings
  // Reason: Display current configuration values
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await getSettings();
    if (settings?.offset !== undefined) {
      setOffset(settings.offset.toString());
    }
  };

  // Purpose: Save settings
  // Reason: Persist user configuration
  const handleSave = async () => {
    const offsetValue = parseFloat(offset) || 0;
    await saveSettings({ offset: offsetValue });
    // Can show success message
  };

  return (
    <ScrollView style={styles.container}>
      <LanguageSwitcher />
      <Card style={styles.card}>
        <Card.Title title={t('settings.title')} />
        <Card.Content>
          <Paragraph style={styles.description}>
            {t('settings.offsetDescription')}
          </Paragraph>
          <TextInput
            label={t('settings.offset')}
            value={offset}
            onChangeText={setOffset}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}>
            {t('common.save')}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
});

