# Claude Code Prompts for Beò

Use these exact prompts when working with Claude Code. Copy-paste and customize [BRACKETS].

---

## Building a New Screen
```bash
claude "Build the [SCREEN_NAME] screen for Beò.

CRITICAL: Reference ~/beo-app/config/theme.js for ALL styling.

File structure: Create at src/screens/[ScreenName].js

Requirements:
- Import { theme, textStyles, componentStyles, spacing } from '../config/theme'
- Use ONLY theme tokens for colors (theme.sage, theme.coral, theme.bg, etc)
- Use ONLY textStyles for typography (textStyles.h2, textStyles.body, etc)
- Use ONLY spacing constants for padding/margins (spacing.md, spacing.lg, etc)
- Primary actions: theme.coral background
- Secondary actions: theme.sage background
- Text color: theme.text
- Card backgrounds: theme.card
- Card padding: spacing.lg
- Section gutters: spacing.lg (24px)

Data structure:
[DESCRIBE YOUR DATA MODEL]

Layout:
[DESCRIBE THE LAYOUT]

Voice: Direct, honest, evidence-based. Never shame language.

Output: Complete, functional component with all imports."
```

---

## Building a Reusable Component
```bash
claude "Create a reusable [COMPONENT_NAME] component for Beò.

CRITICAL: Reference ~/beo-app/config/theme.js for ALL styling.

File structure: Create at src/components/[ComponentName].js

Props:
[LIST PROPS WITH TYPES]

Styling rules:
- Import { theme, textStyles, componentStyles } from '../../config/theme'
- Use componentStyles.[name] presets when available
- All colors from theme object
- All typography from textStyles
- All spacing from spacing constants

Example usage:
[SHOW HOW IT SHOULD BE USED]

Output: Complete component with PropTypes and full documentation."
```

---

## Updating Existing Code
```bash
claude "Refactor [FILE_PATH] to use centralized branding.

Current issue: [DESCRIBE THE PROBLEM]

Fix:
- Replace all hardcoded colors with theme tokens
- Replace all hardcoded font sizes with textStyles
- Replace all hardcoded padding/margins with spacing constants
- Add import: import { theme, textStyles, spacing } from '[PATH_TO_THEME]'

Keep all functionality identical—this is styling only.

Reference: config/theme.js"
```

---

## Key Points for Every Prompt

1. Always mention: "Reference ~/beo-app/config/theme.js"
2. Always say: "Use ONLY theme tokens for colors"
3. Always say: "Use ONLY textStyles for typography"
4. Always say: "Use ONLY spacing constants for spacing"
5. Always specify the file path to create
6. Always include voice guidelines if it's user-facing copy

---

## Color Quick Reference
```javascript
// Primary brand
theme.sage           // #4A5D4A (main brand color)
theme.sageDark       // #3A4A3A (darker variant)
theme.sageLight      // #6B7F6B (lighter variant)

// Action (CTAs ONLY)
theme.coral          // #E85D4C (buttons, alerts)
theme.coralDark      // #C94A3A (pressed state)

// Backgrounds
theme.bg             // #0D0D0F (main background)
theme.card           // #1A1A1F (card background)
theme.cardAlt        // #252530 (alternate card)

// Text
theme.text           // #FFFFFF (primary text)
theme.textSecondary  // #9CA3AF (secondary text)
theme.textMuted      // #6B7280 (muted text)

// Status
theme.success        // #10B981
theme.warning        // #F59E0B
theme.danger         // #EF4444
theme.info           // #3B82F6
```

---

## Spacing Quick Reference
```javascript
spacing.xs    // 4px   (very small gaps)
spacing.sm    // 8px   (small gaps)
spacing.md    // 16px  (standard gaps)
spacing.lg    // 24px  (default gutters, card padding)
spacing.xl    // 32px  (large sections)
spacing.xxl   // 48px  (major sections)
```

---

## Typography Quick Reference
```javascript
textStyles.hero      // 48px, bold (hero headlines)
textStyles.h1        // 36px, bold (main titles)
textStyles.h2        // 28px, semibold (section titles)
textStyles.h3        // 20px, semibold (subsections)
textStyles.body      // 16px, regular (body copy)
textStyles.bodySm    // 14px, regular (small text)
textStyles.caption   // 12px, regular (captions)
textStyles.button    // 16px, semibold (button labels)
```
