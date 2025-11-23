// 用途：位置切换提示弹窗
// 原因：当检测到位置变化时，询问用户是否切换到当前位置

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button, Portal, Dialog, Paragraph } from 'react-native-paper';
import type { Location } from '../types';

interface LocationPromptProps {
  visible: boolean;
  currentLocation: Location;
  lastLocation: Location;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LocationPrompt: React.FC<LocationPromptProps> = ({
  visible,
  currentLocation,
  lastLocation,
  onConfirm,
  onCancel,
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>位置已变化</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.locationText}>
            上次位置：
          </Paragraph>
          <Paragraph style={styles.coordinateText}>
            经度: {lastLocation.longitude}, 纬度: {lastLocation.latitude}
          </Paragraph>
          {lastLocation.address && (
            <Paragraph style={styles.addressText}>
              {lastLocation.address}
            </Paragraph>
          )}
          <Paragraph style={[styles.locationText, styles.marginTop]}>
            当前位置：
          </Paragraph>
          <Paragraph style={styles.coordinateText}>
            经度: {currentLocation.longitude}, 纬度:{' '}
            {currentLocation.latitude}
          </Paragraph>
          {currentLocation.address && (
            <Paragraph style={styles.addressText}>
              {currentLocation.address}
            </Paragraph>
          )}
          <Paragraph style={styles.questionText}>
            是否切换到当前位置？
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>取消</Button>
          <Button onPress={onConfirm}>切换</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  locationText: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  coordinateText: {
    fontSize: 14,
    color: '#666',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  marginTop: {
    marginTop: 16,
  },
  questionText: {
    marginTop: 16,
    fontSize: 16,
  },
});

