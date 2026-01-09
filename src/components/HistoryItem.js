import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { formatDate } from '../utils/formatters';

/**
 * History list item component
 */
export const HistoryItem = ({ item }) => {
  const { intervention, date, completed } = item;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View
          style={[
            styles.dot,
            { backgroundColor: completed ? theme.success : theme.textMuted },
          ]}
        />
        <View>
          <Text style={styles.name}>{intervention}</Text>
          <Text style={styles.date}>{formatDate(date)}</Text>
        </View>
      </View>
      <Text
        style={[
          styles.status,
          { color: completed ? theme.success : theme.textMuted },
        ]}
      >
        {completed ? 'Done' : 'Skipped'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  name: {
    fontSize: 14,
    color: theme.text,
  },
  date: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
});
