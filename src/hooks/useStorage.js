import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, CONFIG } from '../constants/storage';
import {
  validateProfile,
  validateHistory,
  validateHourlyUsed,
  validateStoredHour,
} from '../utils/validation';

/**
 * Custom hook for managing AsyncStorage operations with validation
 */
export const useStorage = () => {
  /**
   * Load profile from storage
   * @returns {Promise<Object|null>} Validated profile or null
   */
  const loadProfile = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return validateProfile(parsed);
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  }, []);

  /**
   * Save profile to storage
   * @param {Object} profile - Profile to save
   * @returns {Promise<boolean>} Success status
   */
  const saveProfile = useCallback(async (profile) => {
    try {
      const validated = validateProfile(profile);
      if (!validated) {
        console.error('Invalid profile data');
        return false;
      }
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(validated));
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  }, []);

  /**
   * Load history from storage
   * @returns {Promise<Array>} Validated history array
   */
  const loadHistory = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return validateHistory(parsed);
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }, []);

  /**
   * Save history to storage
   * @param {Array} history - History array to save
   * @returns {Promise<boolean>} Success status
   */
  const saveHistory = useCallback(async (history) => {
    try {
      const validated = validateHistory(history);
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(validated));
      return true;
    } catch (error) {
      console.error('Error saving history:', error);
      return false;
    }
  }, []);

  /**
   * Add entry to history
   * @param {Object} entry - History entry to add
   * @param {Array} currentHistory - Current history array
   * @returns {Promise<Array>} Updated history array
   */
  const addHistoryEntry = useCallback(async (entry, currentHistory) => {
    const newHistory = [entry, ...currentHistory].slice(0, CONFIG.MAX_HISTORY_ITEMS);
    await saveHistory(newHistory);
    return newHistory;
  }, [saveHistory]);

  /**
   * Load timer state from storage
   * @returns {Promise<Object>} Timer state
   */
  const loadTimerState = useCallback(async () => {
    try {
      const [hourlyUsed, hourlyStart] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.HOURLY_USED),
        AsyncStorage.getItem(STORAGE_KEYS.HOURLY_START),
      ]);

      return {
        hourlyUsedSeconds: validateHourlyUsed(hourlyUsed),
        savedHour: validateStoredHour(hourlyStart),
      };
    } catch (error) {
      console.error('Error loading timer state:', error);
      return { hourlyUsedSeconds: 0, savedHour: null };
    }
  }, []);

  /**
   * Save timer state to storage
   * @param {number} hourlyUsed - Seconds used this hour
   * @param {number} hour - Current hour
   * @returns {Promise<boolean>} Success status
   */
  const saveTimerState = useCallback(async (hourlyUsed, hour) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.HOURLY_USED, hourlyUsed.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.HOURLY_START, hour.toString()),
      ]);
      return true;
    } catch (error) {
      console.error('Error saving timer state:', error);
      return false;
    }
  }, []);

  /**
   * Reset all storage
   * @returns {Promise<boolean>} Success status
   */
  const clearAllData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }, []);

  return {
    loadProfile,
    saveProfile,
    loadHistory,
    saveHistory,
    addHistoryEntry,
    loadTimerState,
    saveTimerState,
    clearAllData,
  };
};
