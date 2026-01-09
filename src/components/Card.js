import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';

/**
 * Reusable card component
 */
export const Card = ({ children, style, variant = 'default' }) => {
  return (
    <View style={[styles.card, variant === 'alt' && styles.cardAlt, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  cardAlt: {
    backgroundColor: theme.cardAlt,
  },
});
