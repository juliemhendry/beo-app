import { theme } from '../constants/theme';
import { CONFIG } from '../constants/storage';

/**
 * Get risk level information based on BSMAS score
 * @param {number} score - BSMAS score (6-30)
 * @returns {Object} Risk level object with level, color, and description
 */
export const getRiskLevel = (score) => {
  const validScore = Math.max(6, Math.min(30, score || 6));
  const { RISK_THRESHOLDS } = CONFIG;

  if (validScore <= RISK_THRESHOLDS.LOW_MAX) {
    return {
      level: 'Low',
      color: theme.success,
      description: 'Your social media use appears healthy. beò will help you maintain balance.',
    };
  }

  if (validScore <= RISK_THRESHOLDS.MODERATE_MAX) {
    return {
      level: 'Moderate',
      color: theme.warning,
      description: 'You show some signs of problematic use. beò can help you build better habits.',
    };
  }

  return {
    level: 'High',
    color: theme.danger,
    description: 'Your usage patterns suggest you could benefit significantly from mindful breaks.',
  };
};

/**
 * Calculate BSMAS score from answers
 * @param {number[]} answers - Array of answers (1-5 for each question)
 * @returns {number} Total score
 */
export const calculateBSMASScore = (answers) => {
  if (!Array.isArray(answers)) return 0;
  return answers.reduce((sum, answer) => sum + (answer || 0), 0);
};
