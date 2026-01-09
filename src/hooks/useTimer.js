import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import { CONFIG } from '../constants/storage';
import { useStorage } from './useStorage';

/**
 * Custom hook for managing session and hourly timers
 * Fixes: Async operation in setInterval by using refs and batched updates
 */
export const useTimer = ({ isActive, hourlyLimit, onLimitReached }) => {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [hourlyUsedSeconds, setHourlyUsedSeconds] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const timerRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const currentHourRef = useRef(new Date().getHours());
  const saveCounterRef = useRef(0);
  const limitReachedRef = useRef(false);

  const { loadTimerState, saveTimerState } = useStorage();

  const limitSeconds = hourlyLimit * 60;

  /**
   * Initialize timer state from storage
   */
  const initializeTimer = useCallback(async () => {
    const { hourlyUsedSeconds: savedSeconds, savedHour } = await loadTimerState();
    const currentHour = new Date().getHours();
    currentHourRef.current = currentHour;

    // Reset if hour changed
    if (savedHour !== null && savedHour !== currentHour) {
      setHourlyUsedSeconds(0);
      limitReachedRef.current = false;
      await saveTimerState(0, currentHour);
    } else {
      setHourlyUsedSeconds(savedSeconds);
      // Check if limit was already reached
      if (savedSeconds >= limitSeconds) {
        limitReachedRef.current = true;
      }
    }

    setIsInitialized(true);
  }, [loadTimerState, saveTimerState, limitSeconds]);

  /**
   * Check for hour change and reset if needed
   */
  const checkHourChange = useCallback(() => {
    const currentHour = new Date().getHours();
    if (currentHourRef.current !== currentHour) {
      currentHourRef.current = currentHour;
      setHourlyUsedSeconds(0);
      limitReachedRef.current = false;
      saveTimerState(0, currentHour);
      return true;
    }
    return false;
  }, [saveTimerState]);

  /**
   * Start the timer
   */
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      // Check for hour change synchronously using ref
      const hourChanged = checkHourChange();
      if (hourChanged) return;

      setSessionSeconds((prev) => prev + 1);
      setHourlyUsedSeconds((prev) => {
        const newVal = prev + 1;

        // Save to storage every SAVE_INTERVAL_SECONDS
        saveCounterRef.current += 1;
        if (saveCounterRef.current >= CONFIG.SAVE_INTERVAL_SECONDS) {
          saveCounterRef.current = 0;
          saveTimerState(newVal, currentHourRef.current);
        }

        // Check if limit reached (only trigger once per hour)
        if (newVal >= limitSeconds && !limitReachedRef.current) {
          limitReachedRef.current = true;
          // Call onLimitReached in next tick to avoid state update during render
          setTimeout(() => {
            onLimitReached?.();
          }, 0);
        }

        return newVal;
      });
    }, CONFIG.TIMER_INTERVAL_MS);
  }, [checkHourChange, saveTimerState, limitSeconds, onLimitReached]);

  /**
   * Stop the timer
   */
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Save current state when stopping
    saveTimerState(hourlyUsedSeconds, currentHourRef.current);
  }, [saveTimerState, hourlyUsedSeconds]);

  /**
   * Reset timers
   */
  const resetTimers = useCallback(() => {
    setSessionSeconds(0);
    setHourlyUsedSeconds(0);
    limitReachedRef.current = false;
    saveCounterRef.current = 0;
  }, []);

  /**
   * Reset limit reached flag (for when user completes/skips intervention)
   */
  const resetLimitReached = useCallback(() => {
    limitReachedRef.current = true; // Keep it true to prevent re-triggering
  }, []);

  /**
   * Handle app state changes (background/foreground)
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        // Going to background - save state
        await saveTimerState(hourlyUsedSeconds, currentHourRef.current);
      } else if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // Coming to foreground - reload state
        await initializeTimer();
      }
      appStateRef.current = nextAppState;
    });

    return () => subscription?.remove();
  }, [hourlyUsedSeconds, saveTimerState, initializeTimer]);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    initializeTimer();
  }, [initializeTimer]);

  /**
   * Start/stop timer based on isActive
   */
  useEffect(() => {
    if (isActive && isInitialized) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isInitialized, startTimer, stopTimer]);

  return {
    sessionSeconds,
    hourlyUsedSeconds,
    isOverLimit: hourlyUsedSeconds >= limitSeconds,
    remainingSeconds: Math.max(0, limitSeconds - hourlyUsedSeconds),
    progress: Math.min((hourlyUsedSeconds / limitSeconds) * 100, 100),
    resetTimers,
    resetLimitReached,
  };
};
