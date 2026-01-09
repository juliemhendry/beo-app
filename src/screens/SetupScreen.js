import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { getRiskLevel } from '../utils/riskLevel';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LimitSelector } from '../components/LimitSelector';

/**
 * Setup screen for configuring hourly limit after BSMAS assessment
 */
export const SetupScreen = ({
  score,
  hourlyLimit,
  onHourlyLimitChange,
  onComplete,
}) => {
  const risk = getRiskLevel(score);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>beò</Text>

      <Card style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Your BSMAS Score</Text>
        <Text style={[styles.scoreValue, { color: risk.color }]}>{score}</Text>
        <View style={[styles.riskBadge, { backgroundColor: risk.color + '20' }]}>
          <Text style={[styles.riskBadgeText, { color: risk.color }]}>
            {risk.level} Risk
          </Text>
        </View>
        <Text style={styles.scoreDescription}>{risk.description}</Text>
      </Card>

      <Card style={styles.limitCard}>
        <Text style={styles.limitTitle}>Set Your Hourly Limit</Text>
        <Text style={styles.limitDescription}>
          How many minutes per hour do you want to allow before taking a break?
        </Text>
        <LimitSelector value={hourlyLimit} onChange={onHourlyLimitChange} />
      </Card>

      <Button
        title="Start Using beò"
        variant="primary"
        onPress={onComplete}
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.text,
    letterSpacing: -2,
    marginBottom: 8,
  },
  scoreCard: {
    width: '100%',
    marginTop: 24,
    alignItems: 'center',
    padding: 32,
  },
  scoreLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 72,
    fontWeight: '700',
  },
  riskBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  riskBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scoreDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  limitCard: {
    width: '100%',
  },
  limitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  limitDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 24,
  },
  button: {
    width: '100%',
    paddingVertical: 18,
  },
});
