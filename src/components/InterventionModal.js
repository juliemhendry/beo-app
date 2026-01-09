import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { Button } from './Button';

/**
 * Intervention modal component
 */
export const InterventionModal = ({
  visible,
  intervention,
  onComplete,
  onSkip,
}) => {
  if (!intervention) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onSkip}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.icon}>{intervention.icon}</Text>
          <Text style={styles.title}>{intervention.name}</Text>
          <Text style={styles.duration}>{intervention.duration} minutes</Text>
          <Text style={styles.description}>{intervention.description}</Text>

          <View style={styles.buttons}>
            <Button
              title="I Completed This"
              variant="success"
              onPress={onComplete}
              style={styles.button}
            />
            <Button
              title="Skip This Time"
              variant="secondary"
              onPress={onSkip}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: theme.card,
    borderRadius: 32,
    padding: 32,
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  duration: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
  },
});
