# Dynamic CSS Variables for Rarity Colors

## Quick Start

The rarity colors are **automatically injected as CSS variables** at app startup. Just use them in your CSS!

```css
.my-epic-item {
  border-color: var(--rarity-epic-border);
  background: var(--rarity-epic-bg-color);
  box-shadow: 0 0 12px rgba(var(--rarity-epic-glow-rgb), 0.5);
}
```

## Available Variables

For any rarity (`junk`, `common`, `rare`, `epic`, `legendary`, etc.):

```css
var(--rarity-epic-color)        /* Primary color */
var(--rarity-epic-bg-color)     /* Background */
var(--rarity-epic-border)       /* Border */
var(--rarity-epic-text)         /* Text color */
var(--rarity-epic-gem)          /* Gem/icon color */
var(--rarity-epic-glow)         /* Glow (full rgba) */
var(--rarity-epic-glow-rgb)     /* RGB only (for custom alpha) */
```

## Why This Works

1. **Single Source of Truth**: Colors defined in `src/systems/rarity/rarities/*.ts`
2. **Auto-Injected**: `injectRarityColorVars()` runs at startup in `main.tsx`
3. **Always in Sync**: Edit TypeScript → refresh browser → CSS updates

No build scripts, no generation steps, no manual sync. Just works!

## Custom Opacity

Use RGB components for flexible opacity:

```css
/* 50% opacity */
color: rgba(var(--rarity-epic-glow-rgb), 0.5);

/* 10% opacity */
background: rgba(var(--rarity-legendary-glow-rgb), 0.1);
```

## See Also

- **Full Guide**: `RARITY_CSS_SYSTEM.md`
- **Examples**: `src/rarity-colors-example.css`
- **Implementation**: `src/utils/injectRarityColors.ts`
