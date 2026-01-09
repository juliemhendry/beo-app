import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';

/**
 * Loading screen shown during app initialization
 */
export const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>beo</Text>
      <Text style={styles.tagline}>mindful moments</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.bg,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.text,
    letterSpacing: -2,
  },
  tagline: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 8,
  },
});
