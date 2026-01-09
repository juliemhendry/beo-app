import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '../../config/theme';

const LOCATIONS = ['Home', 'Work', 'Transit', 'Other'];
const ACTIVITIES = ['Working', 'Socializing', 'Relaxing', 'Other'];

/**
 * Dot selector component for mood/stress rating
 */
const DotSelector = ({ value, onChange, label, lowLabel, highLabel }) => {
  return (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorLabel}>{label}</Text>
      <View style={styles.scaleLabels}>
        <Text style={styles.scaleLabel}>{lowLabel}</Text>
        <Text style={styles.scaleLabel}>{highLabel}</Text>
      </View>
      <View style={styles.dotsContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.dot,
              value === num && styles.dotSelected,
            ]}
            onPress={() => onChange(num)}
          >
            <Text
              style={[
                styles.dotText,
                value === num && styles.dotTextSelected,
              ]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

/**
 * Button group selector component
 */
const ButtonGroup = ({ options, value, onChange, label }) => {
  return (
    <View style={styles.buttonGroupContainer}>
      <Text style={styles.selectorLabel}>{label}</Text>
      <View style={styles.buttonGroup}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              value === option && styles.optionButtonSelected,
            ]}
            onPress={() => onChange(option)}
          >
            <Text
              style={[
                styles.optionButtonText,
                value === option && styles.optionButtonTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

/**
 * Daily Check-In Screen
 */
export const DailyCheckInScreen = ({ onSubmit, onBack }) => {
  const [mood, setMood] = useState(5);
  const [stress, setStress] = useState(5);
  const [location, setLocation] = useState('');
  const [activity, setActivity] = useState('');
  const [perceivedHours, setPerceivedHours] = useState('');

  const handleSubmit = () => {
    const checkInData = {
      mood,
      stress,
      location,
      activity,
      perceivedHours: perceivedHours ? parseFloat(perceivedHours) : null,
    };

    onSubmit(checkInData);
  };

  const isValid = mood && stress && location && activity;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Daily Check-In</Text>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.subtitle}>
          Take a moment to reflect on how you're feeling today.
        </Text>

        {/* Mood Selector */}
        <View style={styles.card}>
          <DotSelector
            value={mood}
            onChange={setMood}
            label="How's your mood?"
            lowLabel="Low"
            highLabel="Great"
          />
        </View>

        {/* Stress Selector */}
        <View style={styles.card}>
          <DotSelector
            value={stress}
            onChange={setStress}
            label="Stress level?"
            lowLabel="Calm"
            highLabel="Stressed"
          />
        </View>

        {/* Location Selector */}
        <View style={styles.card}>
          <ButtonGroup
            options={LOCATIONS}
            value={location}
            onChange={setLocation}
            label="Where are you?"
          />
        </View>

        {/* Activity Selector */}
        <View style={styles.card}>
          <ButtonGroup
            options={ACTIVITIES}
            value={activity}
            onChange={setActivity}
            label="What are you doing?"
          />
        </View>

        {/* Perceived Hours Input */}
        <View style={styles.card}>
          <Text style={styles.selectorLabel}>
            How many hours do you think you've used your phone today?
          </Text>
          <TextInput
            style={styles.textInput}
            value={perceivedHours}
            onChangeText={setPerceivedHours}
            placeholder="e.g., 2.5"
            placeholderTextColor={theme.textMuted}
            keyboardType="decimal-pad"
            returnKeyType="done"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isValid && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={styles.submitButtonText}>Complete Check-In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: theme.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
  },
  placeholder: {
    width: 50,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  selectorContainer: {
    width: '100%',
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scaleLabel: {
    fontSize: 12,
    color: theme.textMuted,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.cardAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotSelected: {
    backgroundColor: theme.primary,
  },
  dotText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textMuted,
  },
  dotTextSelected: {
    color: theme.text,
  },
  buttonGroupContainer: {
    width: '100%',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: theme.cardAlt,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: theme.primary,
  },
  optionButtonText: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  optionButtonTextSelected: {
    color: theme.text,
  },
  textInput: {
    backgroundColor: theme.cardAlt,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.text,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: theme.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: theme.cardAlt,
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
});
