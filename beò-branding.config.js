/**
 * BEÒ Branding Configuration
 * Single source of truth for all brand assets across app, web, and marketing
 * Version: 1.0 | Updated: January 2025
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

const colors = {
  // Primary Brand Colors
  sage: '#4A5D4A',
  sageDark: '#3A4A3A',
  sageLight: '#6B7F6B',
  
  // Action Color
  coral: '#E85D4C',
  coralDark: '#C94A3A',
  
  // Neutrals & Backgrounds
  cream: '#F5F2ED',
  black: '#0A0A0A',
  white: '#FAFAFA',
  
  // Text Colors
  textPrimary: '#0A0A0A',
  textSecondary: '#5A5A5A',
  textMuted: '#6B7280',
  
  // App-specific (for dark mode UI)
  bg: '#0D0D0F',
  card: '#1A1A1F',
  cardAlt: '#252530',
  border: '#2D2D35',
  
  // Status & Feedback
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
};

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

const typography = {
  // Font Families
  fonts: {
    display: 'Instrument Serif',
    displayFallback: 'Georgia, serif',
    body: 'DM Sans',
    bodyFallback: '-apple-system, Segoe UI, Arial, sans-serif',
  },
  
  // Font Weights
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Type Scale
  scales: {
    hero: {
      fontSize: 48,
      lineHeight: 1.2,
      fontWeight: 400,
      fontFamily: 'display',
    },
    h1: {
      fontSize: 36,
      lineHeight: 1.3,
      fontWeight: 400,
      fontFamily: 'display',
    },
    h2: {
      fontSize: 28,
      lineHeight: 1.4,
      fontWeight: 400,
      fontFamily: 'display',
    },
    h3: {
      fontSize: 20,
      lineHeight: 1.4,
      fontWeight: 500,
      fontFamily: 'body',
    },
    body: {
      fontSize: 16,
      lineHeight: 1.6,
      fontWeight: 400,
      fontFamily: 'body',
    },
    bodySm: {
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 400,
      fontFamily: 'body',
    },
    caption: {
      fontSize: 12,
      lineHeight: 1.4,
      fontWeight: 400,
      fontFamily: 'body',
    },
    button: {
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: 600,
      fontFamily: 'body',
      letterSpacing: 0.5,
    },
  },
};

// ============================================================================
// SPACING SYSTEM (8px base unit)
// ============================================================================

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// ============================================================================
// SHADOWS
// ============================================================================

const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
};

// ============================================================================
// COMPONENT THEMES
// ============================================================================

const components = {
  button: {
    primary: {
      backgroundColor: colors.sage,
      color: colors.white,
      borderRadius: borderRadius.md,
      padding: `${spacing.md}px ${spacing.lg}px`,
      fontSize: typography.scales.button.fontSize,
      fontWeight: typography.weights.semibold,
    },
    secondary: {
      backgroundColor: colors.cream,
      color: colors.black,
      borderRadius: borderRadius.md,
      padding: `${spacing.md}px ${spacing.lg}px`,
      fontSize: typography.scales.button.fontSize,
      fontWeight: typography.weights.semibold,
    },
    accent: {
      backgroundColor: colors.coral,
      color: colors.white,
      borderRadius: borderRadius.md,
      padding: `${spacing.md}px ${spacing.lg}px`,
      fontSize: typography.scales.button.fontSize,
      fontWeight: typography.weights.semibold,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.sage,
      borderRadius: borderRadius.md,
      padding: `${spacing.md}px ${spacing.lg}px`,
      fontSize: typography.scales.button.fontSize,
      fontWeight: typography.weights.semibold,
      border: `1px solid ${colors.sage}`,
    },
  },
  
  card: {
    default: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      boxShadow: shadows.sm,
      border: `1px solid ${colors.cream}`,
    },
    dark: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      border: `1px solid ${colors.border}`,
    },
  },
  
  input: {
    default: {
      borderRadius: borderRadius.md,
      borderColor: colors.border,
      padding: `${spacing.md}px ${spacing.md}px`,
      fontSize: typography.scales.body.fontSize,
      fontFamily: typography.fonts.body,
    },
  },
};

// ============================================================================
// VOICE & TONE GUIDELINES
// ============================================================================

const voice = {
  principles: {
    do: [
      'Direct and honest—not preachy or judgmental',
      'Empathetic—we understand the struggle',
      'Evidence-based—cite research, not opinions',
      'Actionable—every message leads somewhere',
    ],
    dont: [
      'Shaming ("You\'re addicted to your phone")',
      'Alarmist ("Technology is destroying humanity")',
      'Preachy ("You should spend less time on screens")',
      'Vague ("Live your best life")',
    ],
  },
  examples: {
    bad: 'Stop wasting your life on social media',
    good: 'See the gap between how much you think you scroll vs. reality',
  },
};

// ============================================================================
// LOGO & BRAND SPECS
// ============================================================================

const logo = {
  name: 'beò',
  wordmark: {
    font: 'Instrument Serif',
    style: 'italic',
    weight: 700,
    format: 'lowercase with accent (beò)',
    minSize: {
      digital: '80px width',
      print: '0.75 inches',
    },
  },
  symbol: {
    name: 'Dopamine Molecule',
    description: 'Represents what social media hijacks—what we help you reclaim',
    spacing: 'Equal to height of "b" in beò',
  },
  clearSpace: 'Equal to height of "e" in beò on all sides',
};

// ============================================================================
// EXPORT
// ============================================================================

module.exports = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  voice,
  logo,
  
  getTheme: (mode = 'light') => ({
    light: {
      bg: colors.white,
      text: colors.textPrimary,
      card: colors.cream,
      ...colors,
    },
    dark: {
      bg: colors.bg,
      text: colors.white,
      card: colors.card,
      ...colors,
    },
  })[mode],
};
