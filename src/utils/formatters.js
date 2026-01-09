/**
 * Format seconds into MM:SS format
 * @param {number} seconds - Total seconds to format
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const validSeconds = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(validSeconds / 60);
  const secs = validSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format a date into a human-readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string (Today, Yesterday, or Mon DD)
 */
export const formatDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return 'Unknown date';
  }

  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Format minutes into a readable string
 * @param {number} minutes - Minutes to format
 * @returns {string} Formatted string like "45m" or "1h 15m"
 */
export const formatMinutes = (minutes) => {
  const validMinutes = Math.max(0, Math.floor(minutes || 0));
  if (validMinutes < 60) {
    return `${validMinutes}m`;
  }
  const hours = Math.floor(validMinutes / 60);
  const mins = validMinutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};
