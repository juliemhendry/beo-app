import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../config/theme';
import { getRiskLevel } from '../utils/riskLevel';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LimitSelector } from '../components/LimitSelector';
import { ConfirmDialog } from '../components/ConfirmDialog';

/**
 * Settings screen for editing profile and app settings
 */
export const SettingsScreen = ({
  profile,
  onUpdateHourlyLimit,
  onReset,
  onBack,
}) => {
  const [hourlyLimit, setHourlyLimit] = useState(profile?.hourlyLimit || 45);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const risk = profile ? getRiskLevel(profile.bsmasScore) : null;

  const handleLimitChange = (newLimit) => {
    setHourlyLimit(newLimit);
    setHasChanges(newLimit !== profile?.hourlyLimit);
  };

  const handleSave = async () => {
    await onUpdateHourlyLimit(hourlyLimit);
    setHasChanges(false);
    onBack();
  };

  const handleReset = () => {
    setShowResetConfirm(false);
    onReset();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={handleSave} disabled={!hasChanges}>
          <Text style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      {profile && risk && (
        <Card style={styles.profileCard}>
          <Text style={styles.cardTitle}>Your Profile</Text>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>BSMAS Score</Text>
            <View style={styles.profileValueContainer}>
              <Text style={[styles.profileValue, { color: risk.color }]}>
                {profile.bsmasScore}
              </Text>
              <View style={[styles.riskBadge, { backgroundColor: risk.color + '20' }]}>
                <Text style={[styles.riskBadgeText, { color: risk.color }]}>
                  {risk.level}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.profileNote}>
            To retake the assessment, use the reset option below.
          </Text>
        </Card>
      )}

      <Card>
        <Text style={styles.cardTitle}>Hourly Limit</Text>
        <Text style={styles.cardDescription}>
          Adjust how many minutes per hour you want to allow before taking a break.
        </Text>
        <LimitSelector value={hourlyLimit} onChange={handleLimitChange} />
      </Card>

      <Card style={styles.dangerCard}>
        <Text style={styles.cardTitle}>Reset App</Text>
        <Text style={styles.cardDescription}>
          This will delete all your data including your BSMAS score, hourly limit settings, and activity history. You'll need to complete the assessment again.
        </Text>
        <Button
          title="Reset All Data"
          variant="danger"
          onPress={() => setShowResetConfirm(true)}
          style={styles.resetButton}
        />
      </Card>

      <ConfirmDialog
        visible={showResetConfirm}
        title="Reset App?"
        message="This will permanently delete all your data including your assessment results and activity history. This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleReset}
        onCancel={() => setShowResetConfirm(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
  saveButton: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    color: theme.textMuted,
  },
  profileCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  profileValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  profileNote: {
    fontSize: 12,
    color: theme.textMuted,
    fontStyle: 'italic',
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: theme.danger + '30',
  },
  resetButton: {
    marginTop: 8,
  },
});
