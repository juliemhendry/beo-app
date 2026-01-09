import { useState, useEffect, useCallback } from 'react';
import { CONFIG } from '../constants/storage';
import { getRiskLevel, calculateBSMASScore } from '../utils/riskLevel';
import { useStorage } from './useStorage';

/**
 * Custom hook for managing user profile
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { loadProfile, saveProfile: saveProfileToStorage } = useStorage();

  /**
   * Load profile on mount
   */
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loadedProfile = await loadProfile();
        setProfile(loadedProfile);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [loadProfile]);

  /**
   * Create a new profile from BSMAS answers
   * @param {number[]} answers - Array of answers (1-5)
   * @param {number} hourlyLimit - Hourly limit in minutes
   * @returns {Promise<Object|null>} Created profile or null on error
   */
  const createProfile = useCallback(async (answers, hourlyLimit = CONFIG.HOURLY_LIMIT.DEFAULT) => {
    setError(null);
    try {
      const score = calculateBSMASScore(answers);
      const risk = getRiskLevel(score);

      const newProfile = {
        bsmasScore: score,
        riskLevel: risk.level,
        hourlyLimit,
        createdAt: new Date().toISOString(),
      };

      const success = await saveProfileToStorage(newProfile);
      if (success) {
        setProfile(newProfile);
        return newProfile;
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (err) {
      setError('Failed to create profile');
      console.error('Error creating profile:', err);
      return null;
    }
  }, [saveProfileToStorage]);

  /**
   * Update profile hourly limit
   * @param {number} hourlyLimit - New hourly limit in minutes
   * @returns {Promise<boolean>} Success status
   */
  const updateHourlyLimit = useCallback(async (hourlyLimit) => {
    if (!profile) {
      setError('No profile to update');
      return false;
    }

    setError(null);
    try {
      const validLimit = Math.max(
        CONFIG.HOURLY_LIMIT.MIN,
        Math.min(CONFIG.HOURLY_LIMIT.MAX, hourlyLimit)
      );

      const updatedProfile = {
        ...profile,
        hourlyLimit: validLimit,
      };

      const success = await saveProfileToStorage(updatedProfile);
      if (success) {
        setProfile(updatedProfile);
        return true;
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (err) {
      setError('Failed to update hourly limit');
      console.error('Error updating hourly limit:', err);
      return false;
    }
  }, [profile, saveProfileToStorage]);

  /**
   * Clear profile (for reset)
   */
  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
  }, []);

  return {
    profile,
    isLoading,
    error,
    createProfile,
    updateHourlyLimit,
    clearProfile,
    hasProfile: profile !== null,
  };
};
