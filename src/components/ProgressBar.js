import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';

/**
 * Reusable progress bar component
 */
export const ProgressBar = ({
  progress,
  height = 8,
  color = theme.primary,
  backgroundColor = theme.cardAlt,
  style,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={[styles.container, { height, backgroundColor }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
