/**
 * 通风预测应用
 * 根据GPS位置获取天气数据，计算粮食水分和凝结温度，辅助判断是否需要通风
 */

import React, { useState } from 'react';
import { StatusBar, useColorScheme, View, TouchableOpacity, Text } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { MainScreen } from './src/screens/MainScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showSettings, setShowSettings] = useState(false);

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
            <Text style={{ color: '#fff' }}>返回</Text>
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
            <Text style={{ color: '#fff' }}>设置</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaProvider>
  );
}

export default App;
