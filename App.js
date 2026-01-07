import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  AppState,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Storage keys
const STORAGE_KEYS = {
  PROFILE: '@beo_profile',
  HISTORY: '@beo_history',
  SESSION_START: '@beo_session_start',
  HOURLY_START: '@beo_hourly_start',
  HOURLY_USED: '@beo_hourly_used',
};

// BSMAS Questions
const BSMAS_QUESTIONS = [
  'You spend a lot of time thinking about social media or planning how to use it',
  'You feel an urge to use social media more and more',
  'You use social media in order to forget about personal problems',
  'You have tried to cut down on the use of social media without success',
  'You become restless or troubled if you are prohibited from using social media',
  'You use social media so much that it has had a negative impact on your job/studies',
];

// Interventions
const INTERVENTIONS = [
  { id: 'breathing', name: 'Breathing Exercise', duration: 3, icon: '🌬️', description: 'Take slow, deep breaths. Inhale for 4 seconds, hold for 4, exhale for 4.' },
  { id: 'window', name: 'Window Fresh Air', duration: 2, icon: '🪟', description: 'Go to a window or step outside. Take in fresh air and observe your surroundings.' },
  { id: 'walk', name: 'Short Walk', duration: 10, icon: '🚶', description: 'Take a brief walk around your space. Move your body and clear your mind.' },
  { id: 'water', name: 'Cold Water Splash', duration: 1, icon: '💧', description: 'Splash cold water on your face. Feel refreshed and reset your focus.' },
  { id: 'stretch', name: 'Stretching', duration: 5, icon: '🧘', description: 'Stretch your arms, neck, and back. Release tension from your body.' },
];

// Theme
const theme = {
  bg: '#0D0D0F',
  card: '#1A1A1F',
  cardAlt: '#252530',
  primary: '#6366F1',
  primaryLight: '#818CF8',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  border: '#2D2D35',
};

// Get risk level from score
const getRiskLevel = (score) => {
  if (score <= 12) return { level: 'Low', color: theme.success, description: 'Your social media use appears healthy. Beo will help you maintain balance.' };
  if (score <= 18) return { level: 'Moderate', color: theme.warning, description: 'You show some signs of problematic use. Beo can help you build better habits.' };
  return { level: 'High', color: theme.danger, description: 'Your usage patterns suggest you could benefit significantly from mindful breaks.' };
};

// Format time
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Format date
const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Main App Component
export default function App() {
  const [screen, setScreen] = useState('loading');
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(6).fill(0));
  const [hourlyLimit, setHourlyLimit] = useState(45);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [hourlyUsedSeconds, setHourlyUsedSeconds] = useState(0);
  const [showIntervention, setShowIntervention] = useState(false);
  const [currentIntervention, setCurrentIntervention] = useState(null);
  const [interventionTriggered, setInterventionTriggered] = useState(false);

  const appState = useRef(AppState.currentState);
  const timerRef = useRef(null);
  const sessionStartRef = useRef(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // App state listener for background/foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [hourlyUsedSeconds]);

  // Timer effect
  useEffect(() => {
    if (screen === 'dashboard' && !showIntervention) {
      startTimers();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, showIntervention, interventionTriggered]);

  // Check if limit exceeded
  useEffect(() => {
    const limitSeconds = hourlyLimit * 60;
    if (hourlyUsedSeconds >= limitSeconds && !interventionTriggered && !showIntervention) {
      triggerIntervention();
    }
  }, [hourlyUsedSeconds, hourlyLimit, interventionTriggered, showIntervention]);

  const handleAppStateChange = async (nextAppState) => {
    if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
      await saveTimerState();
    } else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      await restoreTimerState();
    }
    appState.current = nextAppState;
  };

  const saveTimerState = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION_START, sessionStartRef.current?.toString() || Date.now().toString());
      await AsyncStorage.setItem(STORAGE_KEYS.HOURLY_USED, hourlyUsedSeconds.toString());
    } catch (e) {
      console.error('Error saving timer state:', e);
    }
  };

  const restoreTimerState = async () => {
    try {
      const hourlyUsed = await AsyncStorage.getItem(STORAGE_KEYS.HOURLY_USED);
      if (hourlyUsed) {
        setHourlyUsedSeconds(parseInt(hourlyUsed, 10));
      }
    } catch (e) {
      console.error('Error restoring timer state:', e);
    }
  };

  const loadData = async () => {
    try {
      const [profileData, historyData, hourlyUsed, hourlyStart] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
        AsyncStorage.getItem(STORAGE_KEYS.HOURLY_USED),
        AsyncStorage.getItem(STORAGE_KEYS.HOURLY_START),
      ]);

      if (profileData) {
        setProfile(JSON.parse(profileData));
        setHourlyLimit(JSON.parse(profileData).hourlyLimit || 45);
      }
      if (historyData) {
        setHistory(JSON.parse(historyData));
      }

      const now = new Date();
      const currentHour = now.getHours();
      if (hourlyStart) {
        const savedHour = parseInt(hourlyStart, 10);
        if (savedHour !== currentHour) {
          setHourlyUsedSeconds(0);
          setInterventionTriggered(false);
          await AsyncStorage.setItem(STORAGE_KEYS.HOURLY_START, currentHour.toString());
          await AsyncStorage.setItem(STORAGE_KEYS.HOURLY_USED, '0');
        } else if (hourlyUsed) {
          setHourlyUsedSeconds(parseInt(hourlyUsed, 10));
        }
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.HOURLY_START, currentHour.toString());
      }

      setScreen(profileData ? 'dashboard' : 'onboarding');
    } catch (e) {
      console.error('Error loading data:', e);
      setScreen('onboarding');
    }
  };

  const startTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    sessionStartRef.current = Date.now();

    timerRef.current = setInterval(async () => {
      setSessionSeconds(prev => prev + 1);
      setHourlyUsedSeconds(prev => {
        const newVal = prev + 1;
        if (newVal % 10 === 0) {
          AsyncStorage.setItem(STORAGE_KEYS.HOURLY_USED, newVal.toString());
        }
        return newVal;
      });

      const now = new Date();
      const currentHour = now.getHours();
      const savedHour = await AsyncStorage.getItem(STORAGE_KEYS.HOURLY_START);
      if (savedHour && parseInt(savedHour, 10) !== currentHour) {
        setHourlyUsedSeconds(0);
        setInterventionTriggered(false);
        await AsyncStorage.setItem(STORAGE_KEYS.HOURLY_START, currentHour.toString());
        await AsyncStorage.setItem(STORAGE_KEYS.HOURLY_USED, '0');
      }
    }, 1000);
  };

  const triggerIntervention = () => {
    const randomIndex = Math.floor(Math.random() * INTERVENTIONS.length);
    setCurrentIntervention(INTERVENTIONS[randomIndex]);
    setShowIntervention(true);
    setInterventionTriggered(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleInterventionComplete = async (completed) => {
    const historyEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      intervention: currentIntervention.name,
      duration: currentIntervention.duration,
      completed,
    };

    const newHistory = [historyEntry, ...history].slice(0, 100);
    setHistory(newHistory);
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));

    setShowIntervention(false);
    setCurrentIntervention(null);
  };

  const saveProfile = async (score) => {
    const newProfile = {
      bsmasScore: score,
      riskLevel: getRiskLevel(score).level,
      hourlyLimit,
      createdAt: new Date().toISOString(),
    };
    setProfile(newProfile);
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
  };

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < 5) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = newAnswers.reduce((a, b) => a + b, 0);
      saveProfile(score);
      setScreen('setup');
    }
  };

  const handleSetupComplete = async () => {
    const updatedProfile = { ...profile, hourlyLimit };
    setProfile(updatedProfile);
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));
    await AsyncStorage.setItem(STORAGE_KEYS.HOURLY_START, new Date().getHours().toString());
    setScreen('dashboard');
  };

  const resetApp = async () => {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    setProfile(null);
    setHistory([]);
    setCurrentQuestion(0);
    setAnswers(Array(6).fill(0));
    setHourlyLimit(45);
    setSessionSeconds(0);
    setHourlyUsedSeconds(0);
    setInterventionTriggered(false);
    setScreen('onboarding');
  };

  // Render screens
  const renderContent = () => {
    // Loading Screen
    if (screen === 'loading') {
      return (
        <View style={styles.centered}>
          <Text style={styles.logo}>beo</Text>
          <Text style={styles.tagline}>mindful moments</Text>
        </View>
      );
    }

    // Onboarding Screen
    if (screen === 'onboarding') {
      const progress = ((currentQuestion + 1) / 6) * 100;
      return (
        <View style={styles.onboardingContainer}>
          <View style={styles.header}>
            <Text style={styles.logo}>beo</Text>
            <Text style={styles.stepText}>Question {currentQuestion + 1} of 6</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{BSMAS_QUESTIONS[currentQuestion]}</Text>

            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>Strongly{'\n'}Disagree</Text>
              <Text style={styles.scaleLabel}>Strongly{'\n'}Agree</Text>
            </View>

            <View style={styles.answerButtons}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.answerButton,
                    answers[currentQuestion] === value && styles.answerButtonSelected,
                  ]}
                  onPress={() => handleAnswer(value)}
                >
                  <Text style={[
                    styles.answerButtonText,
                    answers[currentQuestion] === value && styles.answerButtonTextSelected,
                  ]}>
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {currentQuestion > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentQuestion(currentQuestion - 1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    // Setup Screen
    if (screen === 'setup') {
      const score = answers.reduce((a, b) => a + b, 0);
      const risk = getRiskLevel(score);
      return (
        <ScrollView contentContainerStyle={styles.setupContainer}>
          <Text style={styles.logo}>beo</Text>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Your BSMAS Score</Text>
            <Text style={[styles.scoreValue, { color: risk.color }]}>{score}</Text>
            <View style={[styles.riskBadge, { backgroundColor: risk.color + '20' }]}>
              <Text style={[styles.riskBadgeText, { color: risk.color }]}>{risk.level} Risk</Text>
            </View>
            <Text style={styles.scoreDescription}>{risk.description}</Text>
          </View>

          <View style={styles.limitCard}>
            <Text style={styles.limitTitle}>Set Your Hourly Limit</Text>
            <Text style={styles.limitDescription}>
              How many minutes per hour do you want to allow before taking a break?
            </Text>

            <View style={styles.limitInputContainer}>
              <TouchableOpacity
                style={styles.limitButton}
                onPress={() => setHourlyLimit(Math.max(5, hourlyLimit - 5))}
              >
                <Text style={styles.limitButtonText}>-</Text>
              </TouchableOpacity>

              <View style={styles.limitValueContainer}>
                <Text style={styles.limitValue}>{hourlyLimit}</Text>
                <Text style={styles.limitUnit}>min/hour</Text>
              </View>

              <TouchableOpacity
                style={styles.limitButton}
                onPress={() => setHourlyLimit(Math.min(55, hourlyLimit + 5))}
              >
                <Text style={styles.limitButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSetupComplete}>
            <Text style={styles.primaryButtonText}>Start Using Beo</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    // Dashboard Screen
    if (screen === 'dashboard') {
      const limitSeconds = hourlyLimit * 60;
      const progress = Math.min((hourlyUsedSeconds / limitSeconds) * 100, 100);
      const remaining = Math.max(limitSeconds - hourlyUsedSeconds, 0);
      const isOverLimit = hourlyUsedSeconds >= limitSeconds;

      const todayHistory = history.filter(h => {
        const d = new Date(h.date);
        return d.toDateString() === new Date().toDateString();
      });
      const completedToday = todayHistory.filter(h => h.completed).length;
      const skippedToday = todayHistory.filter(h => !h.completed).length;

      return (
        <>
          <Modal visible={showIntervention} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {currentIntervention && (
                  <>
                    <Text style={styles.modalIcon}>{currentIntervention.icon}</Text>
                    <Text style={styles.modalTitle}>{currentIntervention.name}</Text>
                    <Text style={styles.modalDuration}>{currentIntervention.duration} minutes</Text>
                    <Text style={styles.modalDescription}>{currentIntervention.description}</Text>

                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.modalButtonPrimary]}
                        onPress={() => handleInterventionComplete(true)}
                      >
                        <Text style={styles.modalButtonPrimaryText}>I Completed This</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.modalButton, styles.modalButtonSecondary]}
                        onPress={() => handleInterventionComplete(false)}
                      >
                        <Text style={styles.modalButtonSecondaryText}>Skip This Time</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>

          <ScrollView contentContainerStyle={styles.dashboardContainer}>
            <View style={styles.dashboardHeader}>
              <Text style={styles.logo}>beo</Text>
              <TouchableOpacity onPress={resetApp}>
                <Text style={styles.resetButton}>Reset</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timerCard}>
              <Text style={styles.timerLabel}>Current Session</Text>
              <Text style={styles.timerValue}>{formatTime(sessionSeconds)}</Text>
            </View>

            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>This Hour</Text>
                <Text style={[styles.progressStatus, { color: isOverLimit ? theme.danger : theme.textSecondary }]}>
                  {isOverLimit ? 'Limit reached' : `${Math.floor(remaining / 60)}m remaining`}
                </Text>
              </View>

              <View style={styles.hourlyProgressBar}>
                <View
                  style={[
                    styles.hourlyProgressFill,
                    {
                      width: `${progress}%`,
                      backgroundColor: isOverLimit ? theme.danger : theme.primary,
                    }
                  ]}
                />
              </View>

              <View style={styles.progressStats}>
                <Text style={styles.progressStat}>{formatTime(hourlyUsedSeconds)} used</Text>
                <Text style={styles.progressStat}>{hourlyLimit}m limit</Text>
              </View>
            </View>

            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Today's Breaks</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.success }]}>{completedToday}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.textMuted }]}>{skippedToday}</Text>
                  <Text style={styles.statLabel}>Skipped</Text>
                </View>
              </View>
            </View>

            <View style={styles.historyCard}>
              <Text style={styles.historyTitle}>Recent Activity</Text>
              {history.length === 0 ? (
                <Text style={styles.historyEmpty}>No activity yet. Keep using the app to see your break history here.</Text>
              ) : (
                history.slice(0, 10).map((item) => (
                  <View key={item.id} style={styles.historyItem}>
                    <View style={styles.historyItemLeft}>
                      <View style={[
                        styles.historyDot,
                        { backgroundColor: item.completed ? theme.success : theme.textMuted }
                      ]} />
                      <View>
                        <Text style={styles.historyItemText}>{item.intervention}</Text>
                        <Text style={styles.historyItemDate}>{formatDate(item.date)}</Text>
                      </View>
                    </View>
                    <Text style={[
                      styles.historyItemStatus,
                      { color: item.completed ? theme.success : theme.textMuted }
                    ]}>
                      {item.completed ? 'Done' : 'Skipped'}
                    </Text>
                  </View>
                ))
              )}
            </View>

            {profile && (
              <View style={styles.profileCard}>
                <Text style={styles.profileTitle}>Your Profile</Text>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>BSMAS Score</Text>
                  <Text style={[styles.profileValue, { color: getRiskLevel(profile.bsmasScore).color }]}>
                    {profile.bsmasScore} ({profile.riskLevel})
                  </Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Hourly Limit</Text>
                  <Text style={styles.profileValue}>{profile.hourlyLimit} minutes</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </>
      );
    }

    return null;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar style="light" />
        {renderContent()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  onboardingContainer: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.card,
    borderRadius: 2,
    marginBottom: 48,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 2,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.text,
    lineHeight: 34,
    marginBottom: 48,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  scaleLabel: {
    fontSize: 12,
    color: theme.textMuted,
    textAlign: 'center',
  },
  answerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  answerButton: {
    width: (width - 80) / 5,
    aspectRatio: 1,
    backgroundColor: theme.card,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  answerButtonSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primaryLight,
  },
  answerButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  answerButtonTextSelected: {
    color: theme.text,
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  setupContainer: {
    padding: 24,
    alignItems: 'center',
  },
  scoreCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    marginTop: 32,
    marginBottom: 24,
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
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    marginBottom: 32,
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
  limitInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitButton: {
    width: 56,
    height: 56,
    backgroundColor: theme.cardAlt,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  limitButtonText: {
    fontSize: 28,
    color: theme.text,
    fontWeight: '300',
  },
  limitValueContainer: {
    alignItems: 'center',
    marginHorizontal: 32,
  },
  limitValue: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.text,
  },
  limitUnit: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  primaryButton: {
    backgroundColor: theme.primary,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    width: '100%',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    textAlign: 'center',
  },
  dashboardContainer: {
    padding: 24,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  resetButton: {
    fontSize: 14,
    color: theme.textMuted,
  },
  timerCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
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
  progressCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
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
    height: 8,
    backgroundColor: theme.cardAlt,
    borderRadius: 4,
    marginBottom: 12,
  },
  hourlyProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    fontSize: 12,
    color: theme.textMuted,
  },
  statsCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  statsTitle: {
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
  historyCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
  },
  historyEmpty: {
    fontSize: 14,
    color: theme.textMuted,
    textAlign: 'center',
    paddingVertical: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  historyItemText: {
    fontSize: 14,
    color: theme.text,
  },
  historyItemDate: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 2,
  },
  historyItemStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: theme.card,
    borderRadius: 32,
    padding: 32,
    width: '100%',
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  modalDuration: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  modalButtons: {
    width: '100%',
  },
  modalButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalButtonPrimary: {
    backgroundColor: theme.success,
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    textAlign: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: theme.cardAlt,
  },
  modalButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textSecondary,
    textAlign: 'center',
  },
});
