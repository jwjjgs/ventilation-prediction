// 用途：设置页面
// 原因：允许用户配置offset等参数

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, TextInput, Button, Paragraph } from 'react-native-paper';
import { getSettings, saveSettings } from '../utils/storage';

export const SettingsScreen: React.FC = () => {
  const [offset, setOffset] = useState<string>('0');

  // 用途：加载保存的设置
  // 原因：显示当前的配置值
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await getSettings();
    if (settings?.offset !== undefined) {
      setOffset(settings.offset.toString());
    }
  };

  // 用途：保存设置
  // 原因：持久化用户的配置
  const handleSave = async () => {
    const offsetValue = parseFloat(offset) || 0;
    await saveSettings({ offset: offsetValue });
    // 可以显示成功提示
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="计算参数" />
        <Card.Content>
          <Paragraph style={styles.description}>
            Offset（偏移量）用于调整计算结果的基准值，默认为0。
          </Paragraph>
          <TextInput
            label="Offset"
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
            保存
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

