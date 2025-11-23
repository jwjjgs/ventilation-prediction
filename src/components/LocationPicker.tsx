// 用途：地图位置选择器
// 原因：允许用户在地图上点击选择位置

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button } from 'react-native-paper';
import type { Location } from '../types';

interface LocationPickerProps {
  initialLocation: Location;
  onLocationSelect: (location: Location) => void;
  onCancel?: () => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLocation,
  onLocationSelect,
  onCancel,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location>(
    initialLocation,
  );

  const [region, setRegion] = useState<Region>({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // 用途：处理地图点击事件
  // 原因：用户点击地图时选择该位置
  const handleMapPress = (event: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => {
    const { coordinate } = event.nativeEvent;
    const newLocation: Location = {
      latitude: parseFloat(coordinate.latitude.toFixed(4)),
      longitude: parseFloat(coordinate.longitude.toFixed(4)),
    };
    setSelectedLocation(newLocation);
  };

  // 用途：确认选择的位置
  // 原因：用户确认后返回选择的位置
  const handleConfirm = () => {
    onLocationSelect(selectedLocation);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}>
        <Marker
          coordinate={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          }}
          title="选择的位置"
        />
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          经度: {selectedLocation.longitude.toFixed(4)}
        </Text>
        <Text style={styles.infoText}>
          纬度: {selectedLocation.latitude.toFixed(4)}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        {onCancel && (
          <Button mode="outlined" onPress={onCancel} style={styles.button}>
            取消
          </Button>
        )}
        <Button mode="contained" onPress={handleConfirm} style={styles.button}>
          确认
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

