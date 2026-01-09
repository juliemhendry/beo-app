# Beò Unified Branding Guide
## Using beò-branding.config.js with Claude Code

---

## Overview

All app branding is centralized in one source of truth:
- **beò-branding.config.js** — Core design tokens (colors, typography, spacing)
- **config/theme.js** — React Native implementation
- **docs/BEO_BRANDING_GUIDE.md** — This guide

### Updating Colors/Spacing

Edit `beò-branding.config.js` only. All changes automatically flow to React Native app.

---

## Using Claude Code

### Pattern 1: Generate a Screen Component
```bash
claude "Build a [ScreenName] screen for the beò app.

Reference: ~/beo-app/config/theme.js for colors and styles.

Requirements:
- Use theme.sage for primary UI elements
- Use theme.coral ONLY for CTAs/buttons
- Use theme.card for background cards
- Typography: H2 for titles, body text for descriptions
- Spacing: Use 24px (lg) gutters between sections

Output as a complete functional component."
```

### Pattern 2: Build a Reusable Component
```bash
claude "Create a reusable Button component.

Reference config/theme.js.

Props:
- variant: 'primary' | 'secondary' | 'accent' | 'ghost'
- size: 'sm' | 'md' | 'lg'
- disabled: boolean

Use theme.js for styling."
```

---

## Quick Reference

### Colors (React Native)
```javascript
import { theme } from './config/theme';

theme.sage              // #4A5D4A (primary)
theme.coral             // #E85D4C (CTA only)
theme.bg                // #0D0D0F (main bg)
theme.card              // #1A1A1F (card bg)
theme.text              // #FFFFFF (primary text)
theme.success           // #10B981
theme.warning           // #F59E0B
theme.danger            // #EF4444
```

### Spacing
```javascript
import { spacing } from './config/theme';

spacing.xs      // 4px
spacing.sm      // 8px
spacing.md      // 16px
spacing.lg      // 24px (default gutters)
spacing.xl      // 32px
spacing.xxl     // 48px
```

### Typography
```javascript
import { textStyles } from './config/theme';

textStyles.h1           // 36px, bold
textStyles.h2           // 28px, bold
textStyles.body         // 16px, regular
textStyles.button       // 16px, semibold
```

---

## Voice & Tone

### DO
- Direct and honest
- Empathetic
- Evidence-based
- Actionable

### DON'T
- Shaming
- Alarmist
- Preachy
- Vague

Example:
❌ "Stop wasting your life on social media"
✅ "See the gap between how much you think you scroll vs. reality"
