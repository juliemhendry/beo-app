import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';

/**
 * Get today's date key for storage
 */
const getTodayKey = () => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  return `${STORAGE_KEYS.DAILY_CHECKIN}${dateStr}`;
};

/**
 * Custom hook for managing daily check-in data
 */
export const useDailyCheckIn = () => {
  const [todayCheckIn, setTodayCheckIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkInHistory, setCheckInHistory] = useState([]);

  // Load today's check-in on mount
  useEffect(() => {
    loadTodayCheckIn();
  }, []);

  /**
   * Load today's check-in from storage
   */
  const loadTodayCheckIn = async () => {
    try {
      setIsLoading(true);
      const key = getTodayKey();
      const data = await AsyncStorage.getItem(key);

      if (data) {
        setTodayCheckIn(JSON.parse(data));
      } else {
        setTodayCheckIn(null);
      }
    } catch (error) {
      console.error('Error loading daily check-in:', error);
      setTodayCheckIn(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save daily check-in data
   */
  const saveCheckIn = useCallback(async (checkInData) => {
    try {
      const key = getTodayKey();
      const now = new Date();

      const fullData = {
        ...checkInData,
        date: now.toISOString(),
        dateKey: now.toISOString().split('T')[0],
        timestamp: now.getTime(),
      };

      await AsyncStorage.setItem(key, JSON.stringify(fullData));
      setTodayCheckIn(fullData);

      return { success: true, data: fullData };
    } catch (error) {
      console.error('Error saving daily check-in:', error);
      return { success: false, error };
    }
  }, []);

  /**
   * Check if user has completed today's check-in
   */
  const hasCheckedInToday = todayCheckIn !== null;

  /**
   * Load check-in history (last N days)
   */
  const loadCheckInHistory = useCallback(async (days = 7) => {
    try {
      const keys = [];
      const today = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        keys.push(`${STORAGE_KEYS.DAILY_CHECKIN}${dateStr}`);
      }

      const results = await AsyncStorage.multiGet(keys);
      const history = results
        .map(([key, value]) => (value ? JSON.parse(value) : null))
        .filter(Boolean);

      setCheckInHistory(history);
      return history;
    } catch (error) {
      console.error('Error loading check-in history:', error);
      return [];
    }
  }, []);

  /**
   * Clear all check-in data
   */
  const clearAllCheckIns = useCallback(async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const checkInKeys = allKeys.filter(key =>
        key.startsWith(STORAGE_KEYS.DAILY_CHECKIN)
      );

      if (checkInKeys.length > 0) {
        await AsyncStorage.multiRemove(checkInKeys);
      }

      setTodayCheckIn(null);
      setCheckInHistory([]);
      return { success: true };
    } catch (error) {
      console.error('Error clearing check-ins:', error);
      return { success: false, error };
    }
  }, []);

  return {
    todayCheckIn,
    isLoading,
    hasCheckedInToday,
    checkInHistory,
    saveCheckIn,
    loadTodayCheckIn,
    loadCheckInHistory,
    clearAllCheckIns,
  };
};
