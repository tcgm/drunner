# Rarity Color System - Complete Reference

## Overview
All rarity colors have been consolidated into a single source of truth at:
**`src/systems/rarity/rarityColors.ts`**

## Key Achievement
✅ **All adjacent rarity tiers maintain at least 5:1 contrast ratio** (exceeding 3.5:1 minimum)
- Minimum contrast: 5.01:1 (Layer → Plane)
- Maximum contrast: 15.29:1 (Void → Elder)

## Color Strategy
The color palette alternates between **bright** and **dark** hues to ensure maximum visual distinction when items of different rarities are displayed side by side. This creates a "sawtooth" luminance pattern:
- Bright colors: High luminance (L ~0.70-0.93)
- Dark colors: Low luminance (L ~0.04-0.20)

## Complete Color Palette

| Tier | Rarity | Color | Luminance | Contrast with Next |
|------|--------|-------|-----------|-------------------|
| 0 | Junk | `#D1D5DB` | 0.6626 | 5.15:1 |
| 1 | Abundant | `#115E59` | 0.0885 | 5.80:1 |
| 2 | Common | `#BEF264` | 0.7537 | 6.68:1 |
| 3 | Uncommon | `#1E40AF` | 0.0704 | 6.41:1 |
| 4 | Rare | `#E9D5FF` | 0.7213 | 7.37:1 |
| 5 | Very Rare | `#701A75` | 0.0547 | 8.04:1 |
| 6 | Magical | `#A5F3FC` | 0.7913 | 7.66:1 |
| 7 | Elite | `#881337` | 0.0598 | 6.92:1 |
| 8 | Epic | `#FBCFE8` | 0.7096 | 6.78:1 |
| 9 | Legendary | `#7C2D12` | 0.0621 | 8.72:1 |
| 10 | Mythic | `#FEF9C3` | 0.9276 | 9.33:1 |
| 11 | Mythicc | `#7F1D1D` | 0.0548 | 8.05:1 |
| 12 | Artifact | `#FDE68A` | 0.7931 | 7.80:1 |
| 13 | Divine | `#064E3B` | 0.0580 | 7.32:1 |
| 14 | Celestial | `#BAE6FD` | 0.7412 | 8.61:1 |
| 15 | Reality Anchor | `#312E81` | 0.0419 | 8.23:1 |
| 16 | Structural | `#DDD6FE` | 0.7062 | 7.89:1 |
| 17 | Singularity | `#4C1D95` | 0.0459 | 9.38:1 |
| 18 | Void (Vorpal) | `#D9F99D` | 0.8494 | 15.29:1 |
| 19 | Elder | `#0F172A` | 0.0088 | 9.44:1 |
| 20 | Layer | `#FDA4AF` | 0.5053 | 5.01:1 |
| 21 | Plane | `#134E4A` | 0.0608 | 9.48:1 |
| 22 | Author | `#FFFFFF` | 1.0000 | - |

## Color Properties per Rarity

Each rarity includes these color properties:
- **color**: Primary border/outline color
- **backgroundColor**: Background fill color
- **glow**: RGBA glow effect with opacity
- **text**: Primary text color (usually lighter)
- **textLight**: Light text variant for emphasis
- **bg**: Background with opacity for containers
- **gem**: Gem/icon color
- **border**: Border color (usually matches primary)

## Updated Files

### Core System
- ✅ `src/systems/rarity/rarityColors.ts` - **New centralized color definitions**
- ✅ `src/systems/rarity/rarities/*.ts` - All 23 individual rarity config files

### UI Components
- ✅ `src/components/ui/ItemSlot.tsx` - RARITY_GLOW_COLORS and RARITY_COLORS constants
- ✅ `src/components/dungeon/InventoryPanel.tsx` - RARITY_COLORS Chakra tokens
- ✅ `src/index.css` - Item detail modal corner border colors

### Theme & Config
- ✅ `src/theme/index.ts` - Chakra theme rarity colors
- ✅ `src/config/gameConfig.ts` - Game config rarity color tokens

## Usage Examples

### TypeScript/TSX
```typescript
import { RARITY_COLORS, getRarityColor, getRarityColors } from '@/systems/rarity/rarityColors'

// Get complete color scheme
const colors = getRarityColors('mythic')
console.log(colors.color) // '#FEF9C3'
console.log(colors.text)  // '#FEFCE8'

// Get just the primary color
const color = getRarityColor('legendary')
console.log(color) // '#7C2D12'

// Access full color object
const rarityScheme = RARITY_COLORS['epic']
```

### Chakra UI
```typescript
import { useTheme } from '@chakra-ui/react'

const theme = useTheme()
const rarityColor = theme.colors.rarity.mythic
```

### CSS
```css
.item-detail-modal--mythic .item-detail-modal__corner {
  border-color: #FEF9C3;
}
```

## Design Principles

1. **Logical Progression**: Colors flow logically from common to ultra-rare
   - Gray (junk) → Teal/Lime (common) → Blue/Purple (magical) → Pink/Red (powerful) → Yellow/Gold (legendary) → Cyan/Special (cosmic)

2. **High Contrast**: Alternating bright/dark ensures visual distinction
   - Prevents similar items from blending together in inventory
   - Makes rarity immediately identifiable at a glance

3. **Accessibility**: All pairs exceed WCAG contrast requirements
   - Minimum 3.5:1 for large UI elements
   - Average contrast: ~7.5:1 across all pairs

4. **Consistency**: Single source of truth prevents drift
   - All UI components reference same color definitions
   - Updates propagate automatically throughout app

## Testing

Run the contrast test anytime:
```bash
node test-contrast.mjs
```

This validates that all adjacent rarity pairs maintain the minimum 3.5:1 contrast ratio.

## Future Updates

When adding new rarities or adjusting colors:
1. Update `src/systems/rarity/rarityColors.ts`
2. Run `node test-contrast.mjs` to verify contrast
3. Update the corresponding rarity config file in `rarities/`
4. Colors will automatically propagate to all components
