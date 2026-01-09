import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';
import { CONFIG } from '../constants/storage';

/**
 * Hourly limit selector component
 */
export const LimitSelector = ({ value, onChange, disabled = false }) => {
  const { HOURLY_LIMIT } = CONFIG;

  const handleDecrease = () => {
    if (value > HOURLY_LIMIT.MIN) {
      onChange(value - HOURLY_LIMIT.STEP);
    }
  };

  const handleIncrease = () => {
    if (value < HOURLY_LIMIT.MAX) {
      onChange(value + HOURLY_LIMIT.STEP);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={handleDecrease}
        disabled={disabled || value <= HOURLY_LIMIT.MIN}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>min/hour</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={handleIncrease}
        disabled={disabled || value >= HOURLY_LIMIT.MAX}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 56,
    height: 56,
    backgroundColor: theme.cardAlt,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 28,
    color: theme.text,
    fontWeight: '300',
  },
  valueContainer: {
    alignItems: 'center',
    marginHorizontal: 32,
  },
  value: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.text,
  },
  unit: {
    fontSize: 14,
    color: theme.textSecondary,
  },
});
