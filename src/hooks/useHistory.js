import { useState, useEffect, useCallback, useMemo } from 'react';
import { CONFIG } from '../constants/storage';
import { useStorage } from './useStorage';

/**
 * Custom hook for managing intervention history
 */
export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { loadHistory, addHistoryEntry } = useStorage();

  /**
   * Load history on mount
   */
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const loadedHistory = await loadHistory();
      setHistory(loadedHistory);
      setIsLoading(false);
    };
    load();
  }, [loadHistory]);

  /**
   * Add a new intervention to history
   * @param {Object} intervention - Intervention that was shown
   * @param {boolean} completed - Whether user completed the intervention
   */
  const addIntervention = useCallback(async (intervention, completed) => {
    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      intervention: intervention.name,
      duration: intervention.duration,
      completed,
    };

    const newHistory = await addHistoryEntry(entry, history);
    setHistory(newHistory);
  }, [addHistoryEntry, history]);

  /**
   * Get today's statistics
   */
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayHistory = history.filter((h) => {
      const d = new Date(h.date);
      return d.toDateString() === today;
    });

    return {
      completed: todayHistory.filter((h) => h.completed).length,
      skipped: todayHistory.filter((h) => !h.completed).length,
      total: todayHistory.length,
    };
  }, [history]);

  /**
   * Get recent history entries
   * @param {number} limit - Number of entries to return
   */
  const getRecentHistory = useCallback((limit = 10) => {
    return history.slice(0, limit);
  }, [history]);

  /**
   * Clear history (for reset)
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    isLoading,
    todayStats,
    getRecentHistory,
    addIntervention,
    clearHistory,
  };
};
