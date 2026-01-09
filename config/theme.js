/**
 * Beò React Native Theme
 * Imports tokens from beò-branding.config.js
 * Single source of truth for app colors, typography, spacing
 */

const brandConfig = require('../beò-branding.config');

// App-specific theme (extends base branding)
const theme = {
  // Core colors
  ...brandConfig.colors,
  
  // App-specific backgrounds (dark mode)
  bg: brandConfig.colors.bg,           // #0D0D0F
  bgSecondary: brandConfig.colors.card, // #1A1A1F
  
  // Text colors
  text: brandConfig.colors.white,
  textSecondary: '#9CA3AF',
  textMuted: brandConfig.colors.textMuted,
  
  // Neutral colors
  border: brandConfig.colors.border,
  card: brandConfig.colors.card,
  cardAlt: brandConfig.colors.cardAlt,
  
  // Status colors
  success: brandConfig.colors.success,
  warning: brandConfig.colors.warning,
  danger: brandConfig.colors.danger,
  info: brandConfig.colors.info,
  
  // Primary action
  primary: brandConfig.colors.sage,
  primaryLight: brandConfig.colors.sageLight,
  
  // Accent (action color)
  accent: brandConfig.colors.coral,
  accentDark: brandConfig.colors.coralDark,
};

// Component presets for React Native
const componentStyles = {
  // Button styles
  buttonPrimary: {
    backgroundColor: theme.sage,
    paddingVertical: brandConfig.spacing.md,
    paddingHorizontal: brandConfig.spacing.lg,
    borderRadius: brandConfig.borderRadius.md,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.sage,
    paddingVertical: brandConfig.spacing.md,
    paddingHorizontal: brandConfig.spacing.lg,
    borderRadius: brandConfig.borderRadius.md,
  },
  
  buttonAccent: {
    backgroundColor: theme.coral,
    paddingVertical: brandConfig.spacing.md,
    paddingHorizontal: brandConfig.spacing.lg,
    borderRadius: brandConfig.borderRadius.md,
  },
  
  // Card styles
  cardDefault: {
    backgroundColor: theme.card,
    borderRadius: brandConfig.borderRadius.lg,
    padding: brandConfig.spacing.lg,
    borderColor: theme.border,
    borderWidth: 1,
  },
  
  cardAlt: {
    backgroundColor: theme.cardAlt,
    borderRadius: brandConfig.borderRadius.lg,
    padding: brandConfig.spacing.lg,
  },
  
  // Input styles
  inputDefault: {
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: brandConfig.borderRadius.md,
    padding: brandConfig.spacing.md,
    backgroundColor: theme.bgSecondary,
    color: theme.text,
  },
};

// Typography presets
const textStyles = {
  hero: {
    fontSize: brandConfig.typography.scales.hero.fontSize,
    lineHeight: brandConfig.typography.scales.hero.lineHeight * 24,
    fontWeight: '700',
  },
  
  h1: {
    fontSize: brandConfig.typography.scales.h1.fontSize,
    lineHeight: brandConfig.typography.scales.h1.lineHeight * 24,
    fontWeight: '700',
  },
  
  h2: {
    fontSize: brandConfig.typography.scales.h2.fontSize,
    lineHeight: brandConfig.typography.scales.h2.lineHeight * 24,
    fontWeight: '600',
  },
  
  h3: {
    fontSize: brandConfig.typography.scales.h3.fontSize,
    lineHeight: brandConfig.typography.scales.h3.lineHeight * 24,
    fontWeight: '600',
  },
  
  body: {
    fontSize: brandConfig.typography.scales.body.fontSize,
    lineHeight: brandConfig.typography.scales.body.lineHeight * 16,
    fontWeight: '400',
  },
  
  bodySm: {
    fontSize: brandConfig.typography.scales.bodySm.fontSize,
    lineHeight: brandConfig.typography.scales.bodySm.lineHeight * 14,
    fontWeight: '400',
  },
  
  caption: {
    fontSize: brandConfig.typography.scales.caption.fontSize,
    lineHeight: brandConfig.typography.scales.caption.lineHeight * 12,
    fontWeight: '400',
  },
  
  button: {
    fontSize: brandConfig.typography.scales.button.fontSize,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
};

module.exports = {
  theme,
  componentStyles,
  textStyles,
  spacing: brandConfig.spacing,
  borderRadius: brandConfig.borderRadius,
  colors: brandConfig.colors,
  typography: brandConfig.typography,
};
