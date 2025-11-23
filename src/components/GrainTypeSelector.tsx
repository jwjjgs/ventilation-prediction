// Purpose: Grain type selector component
// Reason: Allow users to select grain type for calculation

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
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

// Purpose: Map grain type to translation key
// Reason: Convert Chinese grain type names to translation keys
const GRAIN_TYPE_TO_KEY: Record<GrainType, string> = {
  '大麦': 'grain.barley',
  '油菜': 'grain.rapeseed',
  '玉米': 'grain.corn',
  '燕麦': 'grain.oats',
  '爆米花': 'grain.popcorn',
  '大米': 'grain.rice',
  '高粱': 'grain.sorghum',
  '大豆': 'grain.soybean',
  '向日葵': 'grain.sunflower',
  '小麦': 'grain.wheat',
};

interface GrainTypeSelectorProps {
  selectedType: GrainType | null;
  onSelect: (type: GrainType) => void;
}

export const GrainTypeSelector: React.FC<GrainTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  const { t } = useTranslation();

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
            {t(GRAIN_TYPE_TO_KEY[type])}
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

