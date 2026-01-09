import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../config/theme';
import { Button } from '../components/Button';

/**
 * Welcome screen with app explanation before BSMAS assessment
 */
export const WelcomeScreen = ({ onContinue }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>beo</Text>
        <Text style={styles.tagline}>mindful moments</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Beo</Text>
        <Text style={styles.description}>
          Beo helps you build healthier digital habits by encouraging mindful breaks during your screen time.
        </Text>

        <View style={styles.featureList}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📊</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Personalized Assessment</Text>
              <Text style={styles.featureText}>
                We'll start with a brief questionnaire to understand your usage patterns.
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⏱️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Hourly Limits</Text>
              <Text style={styles.featureText}>
                Set how much screen time you want to allow each hour.
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🧘</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Science-Backed Breaks</Text>
              <Text style={styles.featureText}>
                When you reach your limit, we'll suggest quick wellness activities.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            The following assessment is based on the Bergen Social Media Addiction Scale (BSMAS), a validated research tool. Your answers help us personalize your experience.
          </Text>
        </View>
      </View>

      <Button
        title="Start Assessment"
        variant="primary"
        onPress={onContinue}
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: theme.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  featureList: {
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  notice: {
    backgroundColor: theme.cardAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  noticeText: {
    fontSize: 13,
    color: theme.textMuted,
    lineHeight: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 'auto',
  },
});
