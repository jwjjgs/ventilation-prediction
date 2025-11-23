// 用途：粮食品种选择器
// 原因：让用户选择要计算的粮食品种

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip } from 'react-native-paper';
import type { GrainType } from '../types';

const GRAIN_TYPES: GrainType[] = [
  '大麦',
  '油菜',
  '玉米',
  '燕麦',
  '爆米花',
  '大米',
  '高粱',
  '大豆',
  '向日葵',
  '小麦',
];

interface GrainTypeSelectorProps {
  selectedType: GrainType | null;
  onSelect: (type: GrainType) => void;
}

export const GrainTypeSelector: React.FC<GrainTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {GRAIN_TYPES.map((type) => (
          <Chip
            key={type}
            selected={selectedType === type}
            onPress={() => onSelect(type)}
            style={styles.chip}
            mode={selectedType === type ? 'flat' : 'outlined'}>
            {type}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
});

