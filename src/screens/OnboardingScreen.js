import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../config/theme';
import { BSMAS_QUESTIONS, TOTAL_QUESTIONS, LIKERT_SCALE } from '../constants/questions';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';

const { width } = Dimensions.get('window');

/**
 * BSMAS questionnaire screen
 */
export const OnboardingScreen = ({
  currentQuestion,
  answers,
  onAnswer,
  onBack,
}) => {
  const progress = ((currentQuestion + 1) / TOTAL_QUESTIONS) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>beo</Text>
        <Text style={styles.stepText}>
          Question {currentQuestion + 1} of {TOTAL_QUESTIONS}
        </Text>
      </View>

      <ProgressBar
        progress={progress}
        height={4}
        color={theme.primary}
        backgroundColor={theme.card}
        style={styles.progressBar}
      />

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {BSMAS_QUESTIONS[currentQuestion]}
        </Text>

        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>Strongly{'\n'}Disagree</Text>
          <Text style={styles.scaleLabel}>Strongly{'\n'}Agree</Text>
        </View>

        <View style={styles.answerButtons}>
          {LIKERT_SCALE.OPTIONS.map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.answerButton,
                answers[currentQuestion] === value && styles.answerButtonSelected,
              ]}
              onPress={() => onAnswer(value)}
            >
              <Text
                style={[
                  styles.answerButtonText,
                  answers[currentQuestion] === value && styles.answerButtonTextSelected,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {currentQuestion > 0 && (
        <Button
          title="Back"
          variant="ghost"
          onPress={onBack}
          style={styles.backButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  stepText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  progressBar: {
    marginBottom: 48,
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
    marginTop: 16,
  },
});
