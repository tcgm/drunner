# Rarity Color System - Dynamic CSS Variables

## Overview

The rarity colors are defined once in TypeScript and dynamically injected as CSS custom properties at runtime. This ensures CSS always stays in sync with TypeScript definitions - no build step required!

## How It Works

1. **Source of Truth**: Rarity colors are defined in TypeScript:
   - `src/systems/rarity/rarities/*.ts` - Individual rarity config files
   - `src/systems/rarity/raritySystem.ts` - Exports `RARITY_COLORS`

2. **Dynamic Injection**: Colors are injected as CSS variables at app startup:
   - `src/utils/injectRarityColors.ts` - Injection utility
   - `src/main.tsx` - Calls `injectRarityColorVars()` on startup

3. **Use in CSS**: Reference the CSS variables anywhere in your stylesheets:
   ```css
   .item-slot--epic {
     border-color: var(--rarity-epic-border);
     background-color: var(--rarity-epic-bg-color);
     box-shadow: 0 0 8px rgba(var(--rarity-epic-glow-rgb), 0.5);
   }
   ```

## Available CSS Variables

For each rarity (e.g., `epic`, `rare`, `legendary`):

### Solid Colors (hex)
- `--rarity-{name}-color` - Primary color
- `--rarity-{name}-bg-color` - Background color
- `--rarity-{name}-border` - Border color
- `--rarity-{name}-text` - Text color
- `--rarity-{name}-text-light` - Light text variant
- `--rarity-{name}-gem` - Gem/icon color

### Glow Colors (rgba)
- `--rarity-{name}-glow` - Full rgba value
- `--rarity-{name}-glow-rgb` - RGB components only (for custom alpha)
- `--rarity-{name}-glow-alpha` - Alpha value only

### Background Colors (rgba)
- `--rarity-{name}-bg` - Full rgba value
- `--rarity-{name}-bg-rgb` - RGB components only
- `--rarity-{name}-bg-alpha` - Alpha value only

## Usage Patterns

### Basic Colors
```css
.my-element {
  color: var(--rarity-epic-text);
  border: 2px solid var(--rarity-epic-border);
  background: var(--rarity-epic-bg-color);
}
```

### Custom Opacity
```css
.my-element {
  /* Use RGB components with custom alpha */
  box-shadow: 0 0 12px rgba(var(--rarity-epic-glow-rgb), 0.8);
  background: rgba(var(--rarity-epic-glow-rgb), 0.1);
}
```

### Gradients
```css
.my-gradient {
  background: radial-gradient(
    circle,
    rgba(var(--rarity-epic-glow-rgb), 0.6) 0%,
    transparent 70%
  );
}
```

## TypeScript Helpers

Use helper functions for programmatic access:

```typescript
import { getRarityCssVar, getRarityBoxShadow, getRarityRadialGradient } from '@/utils/injectRarityColors'

// Get CSS variable reference
const borderVar = getRarityCssVar('epic', 'border') 
// Returns: 'var(--rarity-epic-border)'

// Generate box-shadow
const shadow = getRarityBoxShadow('epic', 0.5, 12)
// Returns: '0 0 12px 0px rgba(var(--rarity-epic-glow-rgb), 0.5)'

// Generate radial gradient
const gradient = getRarityRadialGradient('epic', 0.6, 70)
// Returns: 'radial-gradient(...)'
```

## Benefits

✅ **Always in Sync**: CSS automatically matches TypeScript - no manual updates needed
✅ **No Build Step**: Colors are injected at runtime, not generated at build time
✅ **Single Source of Truth**: Edit rarities/*.ts files and CSS updates automatically
✅ **Runtime Flexibility**: Could potentially theme or customize colors at runtime
✅ **Type Safety**: TypeScript helpers provide autocomplete and type checking

## Workflow

### When Adding a New Rarity

1. Create the rarity TypeScript file: `src/systems/rarity/rarities/XXXnewRarity.ts`
2. Add to exports in `rarities/index.ts`
3. Add to `RARITY_CONFIGS` in `raritySystem.ts`
4. Restart dev server - CSS variables automatically available!

### When Updating Colors

1. Edit the rarity TypeScript file (e.g., `090epic.ts`)
2. Save and refresh browser
3. All CSS using those variables updates automatically

## Special Types

CSS variables are automatically generated for:
- All 23 standard rarities (junk → author)
- `--rarity-set-*` - Set items (teal)
- `--rarity-cursed-*` - Cursed items (dark gray)
- `--rarity-unique-*` - Unique items (gold)
- `--rarity-selected-*` - Selected state (blue)

## Migration Examples

**Before (hardcoded):**
```css
.item-detail-modal--epic .item-detail-modal__icon-frame {
  border-color: #EC4899;
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
}
```

**After (dynamic CSS variables):**
```css
.item-detail-modal--epic .item-detail-modal__icon-frame {
  border-color: var(--rarity-epic-border);
  box-shadow: 0 0 20px rgba(var(--rarity-epic-glow-rgb), 0.6);
}
```

## Notes

- Variables are injected once at app startup in `main.tsx`
- All modern browsers support CSS custom properties
- RGB component splitting enables flexible opacity control
- Hot module replacement works - changes apply on save during development
