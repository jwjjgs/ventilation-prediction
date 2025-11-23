// Purpose: Location change prompt dialog
// Reason: Ask user if they want to switch to current location when location changes detected

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button, Portal, Dialog, Paragraph } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{t('location.locationChanged')}</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.locationText}>
            {t('location.lastLocation')}:
          </Paragraph>
          <Paragraph style={styles.coordinateText}>
            {t('location.longitude')}: {lastLocation.longitude}, {t('location.latitude')}: {lastLocation.latitude}
          </Paragraph>
          {lastLocation.address && (
            <Paragraph style={styles.addressText}>
              {lastLocation.address}
            </Paragraph>
          )}
          <Paragraph style={[styles.locationText, styles.marginTop]}>
            {t('location.currentLocation')}:
          </Paragraph>
          <Paragraph style={styles.coordinateText}>
            {t('location.longitude')}: {currentLocation.longitude}, {t('location.latitude')}:{' '}
            {currentLocation.latitude}
          </Paragraph>
          {currentLocation.address && (
            <Paragraph style={styles.addressText}>
              {currentLocation.address}
            </Paragraph>
          )}
          <Paragraph style={styles.questionText}>
            {t('location.switchToCurrent')}
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>{t('common.cancel')}</Button>
          <Button onPress={onConfirm}>{t('common.confirm')}</Button>
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

