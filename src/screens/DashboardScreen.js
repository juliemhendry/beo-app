import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { formatTime } from '../utils/formatters';
import { getRiskLevel } from '../utils/riskLevel';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { HistoryItem } from '../components/HistoryItem';
import { InterventionModal } from '../components/InterventionModal';
import { ConfirmDialog } from '../components/ConfirmDialog';

/**
 * Main dashboard screen
 */
export const DashboardScreen = ({
  profile,
  sessionSeconds,
  hourlyUsedSeconds,
  hourlyLimit,
  isOverLimit,
  remainingSeconds,
  progress,
  todayStats,
  recentHistory,
  showIntervention,
  currentIntervention,
  onInterventionComplete,
  onInterventionSkip,
  onOpenSettings,
  onOpenDailyCheckIn,
  hasCheckedInToday,
  onReset,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    setShowResetConfirm(false);
    onReset();
  };

  return (
    <>
      <InterventionModal
        visible={showIntervention}
        intervention={currentIntervention}
        onComplete={onInterventionComplete}
        onSkip={onInterventionSkip}
      />

      <ConfirmDialog
        visible={showResetConfirm}
        title="Reset App?"
        message="This will permanently delete all your data. You'll need to complete the assessment again."
        confirmText="Reset"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleReset}
        onCancel={() => setShowResetConfirm(false)}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>beo</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={onOpenSettings} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowResetConfirm(true)} style={styles.headerButton}>
              <Text style={styles.resetButton}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Card style={styles.timerCard}>
          <Text style={styles.timerLabel}>Current Session</Text>
          <Text style={styles.timerValue}>{formatTime(sessionSeconds)}</Text>
        </Card>

        {/* Daily Check-In Card */}
        <Card style={styles.checkInCard}>
          <View style={styles.checkInContent}>
            <View>
              <Text style={styles.checkInTitle}>Daily Check-In</Text>
              <Text style={styles.checkInSubtitle}>
                {hasCheckedInToday
                  ? 'Completed for today'
                  : 'How are you feeling?'}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.checkInButton,
                hasCheckedInToday && styles.checkInButtonCompleted,
              ]}
              onPress={onOpenDailyCheckIn}
            >
              <Text
                style={[
                  styles.checkInButtonText,
                  hasCheckedInToday && styles.checkInButtonTextCompleted,
                ]}
              >
                {hasCheckedInToday ? 'View' : 'Start'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>This Hour</Text>
            <Text
              style={[
                styles.progressStatus,
                { color: isOverLimit ? theme.danger : theme.textSecondary },
              ]}
            >
              {isOverLimit
                ? 'Limit reached'
                : `${Math.floor(remainingSeconds / 60)}m remaining`}
            </Text>
          </View>

          <ProgressBar
            progress={progress}
            height={8}
            color={isOverLimit ? theme.danger : theme.primary}
            style={styles.hourlyProgressBar}
          />

          <View style={styles.progressStats}>
            <Text style={styles.progressStat}>
              {formatTime(hourlyUsedSeconds)} used
            </Text>
            <Text style={styles.progressStat}>{hourlyLimit}m limit</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Today's Breaks</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.success }]}>
                {todayStats.completed}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.textMuted }]}>
                {todayStats.skipped}
              </Text>
              <Text style={styles.statLabel}>Skipped</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          {recentHistory.length === 0 ? (
            <Text style={styles.emptyText}>
              No activity yet. Keep using the app to see your break history here.
            </Text>
          ) : (
            recentHistory.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))
          )}
        </Card>

        {profile && (
          <Card style={styles.profileCard}>
            <Text style={styles.cardTitle}>Your Profile</Text>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>BSMAS Score</Text>
              <Text
                style={[
                  styles.profileValue,
                  { color: getRiskLevel(profile.bsmasScore).color },
                ]}
              >
                {profile.bsmasScore} ({profile.riskLevel})
              </Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Hourly Limit</Text>
              <Text style={styles.profileValue}>{profile.hourlyLimit} minutes</Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </>
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
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.text,
    letterSpacing: -2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  headerButtonText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  resetButton: {
    fontSize: 14,
    color: theme.textMuted,
  },
  timerCard: {
    alignItems: 'center',
    padding: 32,
  },
  timerLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 56,
    fontWeight: '700',
    color: theme.text,
    fontVariant: ['tabular-nums'],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  progressStatus: {
    fontSize: 14,
  },
  hourlyProgressBar: {
    marginBottom: 12,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    fontSize: 12,
    color: theme.textMuted,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.border,
  },
  emptyText: {
    fontSize: 14,
    color: theme.textMuted,
    textAlign: 'center',
    paddingVertical: 16,
  },
  profileCard: {
    marginBottom: 32,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  profileLabel: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  profileValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
  checkInCard: {
    backgroundColor: theme.primary + '15',
    borderWidth: 1,
    borderColor: theme.primary + '30',
  },
  checkInContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkInTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  checkInSubtitle: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  checkInButton: {
    backgroundColor: theme.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  checkInButtonCompleted: {
    backgroundColor: theme.cardAlt,
  },
  checkInButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
  checkInButtonTextCompleted: {
    color: theme.textSecondary,
  },
});
