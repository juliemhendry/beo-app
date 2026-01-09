import React, { useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Constants
import { theme } from './config/theme';
import { TOTAL_QUESTIONS } from './src/constants/questions';
import { CONFIG } from './src/constants/storage';
import { getRandomIntervention } from './src/constants/interventions';
import { calculateBSMASScore } from './src/utils/riskLevel';

// Hooks
import { useProfile } from './src/hooks/useProfile';
import { useHistory } from './src/hooks/useHistory';
import { useTimer } from './src/hooks/useTimer';
import { useStorage } from './src/hooks/useStorage';
import { useDailyCheckIn } from './src/hooks/useDailyCheckIn';

// Screens
import {
  LoadingScreen,
  WelcomeScreen,
  OnboardingScreen,
  SetupScreen,
  SettingsScreen,
  DashboardScreen,
  DailyCheckInScreen,
} from './src/screens';

/**
 * Main App Component
 * Manages screen navigation and coordinates between hooks
 */
export default function App() {
  // Screen navigation state
  const [screen, setScreen] = useState('loading');

  // Onboarding state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(TOTAL_QUESTIONS).fill(0));
  const [hourlyLimit, setHourlyLimit] = useState(CONFIG.HOURLY_LIMIT.DEFAULT);

  // Intervention state
  const [showIntervention, setShowIntervention] = useState(false);
  const [currentIntervention, setCurrentIntervention] = useState(null);

  // Hooks
  const {
    profile,
    isLoading: profileLoading,
    createProfile,
    updateHourlyLimit,
    clearProfile,
    hasProfile,
  } = useProfile();

  const {
    todayStats,
    getRecentHistory,
    addIntervention,
    clearHistory,
  } = useHistory();

  const { clearAllData } = useStorage();

  const {
    hasCheckedInToday,
    saveCheckIn,
    clearAllCheckIns,
  } = useDailyCheckIn();

  // Handle limit reached callback
  const handleLimitReached = useCallback(() => {
    if (!showIntervention) {
      const intervention = getRandomIntervention();
      setCurrentIntervention(intervention);
      setShowIntervention(true);
    }
  }, [showIntervention]);

  // Timer hook
  const {
    sessionSeconds,
    hourlyUsedSeconds,
    isOverLimit,
    remainingSeconds,
    progress,
    resetTimers,
    resetLimitReached,
  } = useTimer({
    isActive: screen === 'dashboard' && !showIntervention,
    hourlyLimit: profile?.hourlyLimit || hourlyLimit,
    onLimitReached: handleLimitReached,
  });

  // Initialize screen based on profile loading
  React.useEffect(() => {
    if (!profileLoading) {
      if (hasProfile) {
        setScreen('dashboard');
      } else {
        setScreen('welcome');
      }
    }
  }, [profileLoading, hasProfile]);

  // Handle BSMAS answer
  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < TOTAL_QUESTIONS - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score and move to setup
      setScreen('setup');
    }
  };

  // Handle going back in questionnaire
  const handleQuestionBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Handle setup completion
  const handleSetupComplete = async () => {
    const newProfile = await createProfile(answers, hourlyLimit);
    if (newProfile) {
      setScreen('dashboard');
    }
  };

  // Handle intervention completion
  const handleInterventionComplete = async (completed) => {
    await addIntervention(currentIntervention, completed);
    setShowIntervention(false);
    setCurrentIntervention(null);
    resetLimitReached();
  };

  // Handle app reset
  const handleReset = async () => {
    await clearAllData();
    await clearAllCheckIns();
    clearProfile();
    clearHistory();
    resetTimers();
    setCurrentQuestion(0);
    setAnswers(Array(TOTAL_QUESTIONS).fill(0));
    setHourlyLimit(CONFIG.HOURLY_LIMIT.DEFAULT);
    setShowIntervention(false);
    setCurrentIntervention(null);
    setScreen('welcome');
  };

  // Handle daily check-in submission
  const handleDailyCheckInSubmit = async (checkInData) => {
    await saveCheckIn(checkInData);
    setScreen('dashboard');
  };

  // Handle hourly limit update from settings
  const handleUpdateHourlyLimit = async (newLimit) => {
    const success = await updateHourlyLimit(newLimit);
    return success;
  };

  // Render current screen
  const renderContent = () => {
    // Loading screen
    if (screen === 'loading' || profileLoading) {
      return <LoadingScreen />;
    }

    // Welcome screen (new onboarding explanation)
    if (screen === 'welcome') {
      return <WelcomeScreen onContinue={() => setScreen('onboarding')} />;
    }

    // Onboarding (BSMAS questionnaire)
    if (screen === 'onboarding') {
      return (
        <OnboardingScreen
          currentQuestion={currentQuestion}
          answers={answers}
          onAnswer={handleAnswer}
          onBack={handleQuestionBack}
        />
      );
    }

    // Setup screen
    if (screen === 'setup') {
      const score = calculateBSMASScore(answers);
      return (
        <SetupScreen
          score={score}
          hourlyLimit={hourlyLimit}
          onHourlyLimitChange={setHourlyLimit}
          onComplete={handleSetupComplete}
        />
      );
    }

    // Settings screen
    if (screen === 'settings') {
      return (
        <SettingsScreen
          profile={profile}
          onUpdateHourlyLimit={handleUpdateHourlyLimit}
          onReset={handleReset}
          onBack={() => setScreen('dashboard')}
        />
      );
    }

    // Daily check-in screen
    if (screen === 'dailyCheckIn') {
      return (
        <DailyCheckInScreen
          onSubmit={handleDailyCheckInSubmit}
          onBack={() => setScreen('dashboard')}
        />
      );
    }

    // Dashboard screen
    if (screen === 'dashboard') {
      return (
        <DashboardScreen
          profile={profile}
          sessionSeconds={sessionSeconds}
          hourlyUsedSeconds={hourlyUsedSeconds}
          hourlyLimit={profile?.hourlyLimit || hourlyLimit}
          isOverLimit={isOverLimit}
          remainingSeconds={remainingSeconds}
          progress={progress}
          todayStats={todayStats}
          recentHistory={getRecentHistory(10)}
          showIntervention={showIntervention}
          currentIntervention={currentIntervention}
          onInterventionComplete={() => handleInterventionComplete(true)}
          onInterventionSkip={() => handleInterventionComplete(false)}
          onOpenSettings={() => setScreen('settings')}
          onOpenDailyCheckIn={() => setScreen('dailyCheckIn')}
          hasCheckedInToday={hasCheckedInToday}
          onReset={handleReset}
        />
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
});
