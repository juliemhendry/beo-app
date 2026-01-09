import { CONFIG, STORAGE_KEYS } from '../constants/storage';
import { TOTAL_QUESTIONS, LIKERT_SCALE } from '../constants/questions';

/**
 * Validate profile data from storage
 * @param {Object|null} profile - Profile data to validate
 * @returns {Object|null} Validated profile or null
 */
export const validateProfile = (profile) => {
  if (!profile || typeof profile !== 'object') {
    return null;
  }

  const { bsmasScore, riskLevel, hourlyLimit, createdAt } = profile;

  // Validate BSMAS score (6-30 range)
  const minScore = TOTAL_QUESTIONS * LIKERT_SCALE.MIN;
  const maxScore = TOTAL_QUESTIONS * LIKERT_SCALE.MAX;
  if (typeof bsmasScore !== 'number' || bsmasScore < minScore || bsmasScore > maxScore) {
    return null;
  }

  // Validate risk level
  const validRiskLevels = ['Low', 'Moderate', 'High'];
  if (!validRiskLevels.includes(riskLevel)) {
    return null;
  }

  // Validate hourly limit
  const { HOURLY_LIMIT } = CONFIG;
  const validatedHourlyLimit = typeof hourlyLimit === 'number'
    ? Math.max(HOURLY_LIMIT.MIN, Math.min(HOURLY_LIMIT.MAX, hourlyLimit))
    : HOURLY_LIMIT.DEFAULT;

  return {
    bsmasScore,
    riskLevel,
    hourlyLimit: validatedHourlyLimit,
    createdAt: createdAt || new Date().toISOString(),
  };
};

/**
 * Validate history entry
 * @param {Object} entry - History entry to validate
 * @returns {boolean} Whether the entry is valid
 */
export const validateHistoryEntry = (entry) => {
  if (!entry || typeof entry !== 'object') {
    return false;
  }

  const { id, date, intervention, duration, completed } = entry;

  return (
    typeof id === 'string' &&
    typeof date === 'string' &&
    typeof intervention === 'string' &&
    typeof duration === 'number' &&
    typeof completed === 'boolean'
  );
};

/**
 * Validate and sanitize history array
 * @param {Array|null} history - History array to validate
 * @returns {Array} Validated history array
 */
export const validateHistory = (history) => {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(validateHistoryEntry)
    .slice(0, CONFIG.MAX_HISTORY_ITEMS);
};

/**
 * Validate hourly used seconds from storage
 * @param {string|null} value - Value from storage
 * @returns {number} Validated seconds (0-3600)
 */
export const validateHourlyUsed = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }

  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0) {
    return 0;
  }

  // Cap at 1 hour (3600 seconds)
  return Math.min(parsed, 3600);
};

/**
 * Validate hour value from storage
 * @param {string|null} value - Value from storage
 * @returns {number|null} Validated hour (0-23) or null
 */
export const validateStoredHour = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0 || parsed > 23) {
    return null;
  }

  return parsed;
};
