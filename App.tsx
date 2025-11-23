/**
 * Ventilation Prediction App
 * Get weather data based on GPS location, calculate grain moisture and dew point to help determine if ventilation is needed
 */

import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme, View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { initI18n } from './src/i18n';
import { MainScreen } from './src/screens/MainScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showSettings, setShowSettings] = useState(false);
  const [i18nReady, setI18nReady] = useState(false);
  const { t } = useTranslation();

  // Purpose: Initialize i18n on app start
  // Reason: Load translations before rendering UI
  useEffect(() => {
    const initialize = async () => {
      await initI18n();
      setI18nReady(true);
    };
    initialize();
  }, []);

  if (!i18nReady) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {showSettings ? (
        <View style={{ flex: 1 }}>
          <SettingsScreen />
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              padding: 12,
              backgroundColor: '#6200ee',
              borderRadius: 8,
            }}
            onPress={() => setShowSettings(false)}>
            <Text style={{ color: '#fff' }}>{t('common.back')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <MainScreen />
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              padding: 12,
              backgroundColor: '#6200ee',
              borderRadius: 8,
            }}
            onPress={() => setShowSettings(true)}>
            <Text style={{ color: '#fff' }}>{t('common.settings')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaProvider>
  );
}

export default App;
