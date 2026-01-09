// AsyncStorage keys
export const STORAGE_KEYS = {
  PROFILE: '@beo_profile',
  HISTORY: '@beo_history',
  SESSION_START: '@beo_session_start',
  HOURLY_START: '@beo_hourly_start',
  HOURLY_USED: '@beo_hourly_used',
};

// App configuration constants
export const CONFIG = {
  // History settings
  MAX_HISTORY_ITEMS: 100,

  // Hourly limit settings (in minutes)
  HOURLY_LIMIT: {
    MIN: 5,
    MAX: 55,
    DEFAULT: 45,
    STEP: 5,
  },

  // Timer settings
  TIMER_INTERVAL_MS: 1000,
  SAVE_INTERVAL_SECONDS: 10,

  // BSMAS risk thresholds
  RISK_THRESHOLDS: {
    LOW_MAX: 12,
    MODERATE_MAX: 18,
  },
};
