/**
 * DEPRECATED: This file is deprecated. Use config/theme.js instead.
 * This file now re-exports from the centralized branding config.
 *
 * All new code should import from: ../../config/theme
 */

const { theme } = require('../../config/theme');

// Re-export the theme for backward compatibility
module.exports = { theme };
