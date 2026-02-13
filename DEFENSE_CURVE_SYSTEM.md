# Defense Curve System

## Overview

The defense curve system automatically converts defense stat values into block percentages using a configurable curve. This eliminates the need to manually balance defense percentages every time you add new items or change defense values.

## How It Works

1. **Theoretical Max Defense**: A script analyzes all items, rarities, and set bonuses to calculate the theoretical maximum defense a hero could achieve with best-in-slot gear.

2. **Curve Calculation**: Defense values are converted to block percentages using a mathematical curve that scales from 0% (at 0 defense) to a maximum cap (default 95%) at theoretical max defense.

3. **Auto-Scaling**: When you add new items or change defense values, simply re-run the calculator script to update the system.

## Quick Start

### Recalculate Max Defense

After adding new items or changing defense values:

```bash
npm run calculate-max-defense
```

This will:
- Scan all items (sets, uniques, procedural bases)
- Find highest defense values at maximum rarity
- Include set bonuses
- Update `src/config/defenseConfig.ts` with new max defense
- Show a preview of the defense curve

### Check Current Settings

Look at `src/config/defenseConfig.ts`:

```typescript
export const DEFENSE_CONFIG: DefenseConfig = {
  curveType: 'logarithmic',        // Curve shape
  minBlockPercent: 0.0,            // 0% block at 0 defense
  maxBlockPercent: 0.95,           // 95% max block cap
  maxDefense: 128280,              // Auto-calculated max
  midpointDefenseRatio: 0.4,       // 50% block at 40% of max
  curveModifier: 1.0,              // Fine-tune steepness
}
```

## Tuning the Curve

### Change Curve Type

Edit `curveType` in `defenseConfig.ts`:

- **`'linear'`**: Simple linear scaling (not recommended - reaches cap too fast)
- **`'diminishing'`**: Hyperbolic curve with diminishing returns
- **`'logarithmic'`** ⭐ (default): Smooth, natural-feeling progression
- **`'exponential'`**: Exponential decay toward cap

### Adjust Curve Shape

**`midpointDefenseRatio`** (0.0 to 1.0)
- Controls where 50% of max block is reached
- Default: `0.4` (50% block at 40% of theoretical max defense)
- Lower = reaches cap slower (more gradual)
- Higher = reaches cap faster (steeper)

**`curveModifier`** (multiplier)
- Fine-tune overall steepness
- Default: `1.0`
- Higher = steeper curve
- Lower = gentler curve

**`maxBlockPercent`** (0.0 to 1.0)
- Maximum block percentage cap
- Default: `0.95` (95%)
- Ensures there's always some risk

**`minBlockPercent`** (0.0 to 1.0)
- Starting block percentage at 0 defense
- Default: `0.0` (0%)

## Example Curves

### Default (Logarithmic, midpoint 0.4)
```
    0% of max ->   0.0% block
   25% of max ->  36.8% block
   50% of max ->  61.5% block
   75% of max ->  80.1% block
  100% of max ->  95.0% block
```

### Gentler Curve (midpoint 0.3)
```
Change midpointDefenseRatio to 0.3 for:
   25% of max ->  46.2% block
   50% of max ->  70.8% block
   75% of max ->  85.9% block
```

### Steeper Curve (midpoint 0.5)
```
Change midpointDefenseRatio to 0.5 for:
   25% of max ->  27.4% block
   50% of max ->  52.6% block
   75% of max ->  74.1% block
```

## When to Recalculate

Run `npm run calculate-max-defense` after:

- ✅ Adding new items with defense stats
- ✅ Changing defense values on existing items
- ✅ Adding new rarities with higher multipliers
- ✅ Adding/changing set bonuses that grant defense
- ✅ Adding new equipment slots

You do **NOT** need to recalculate after:

- ❌ Changing curve settings (tuning experience)
- ❌ Adding items without defense stats
- ❌ Changing non-defense stats

## Technical Details

### File Structure

```
src/
  config/
    defenseConfig.ts          # Curve configuration & calculation logic
  utils/
    defenseUtils.ts           # Helper functions (uses defenseConfig)

scripts/
  calculate-max-defense.mjs   # Calculator script
```

### How Max Defense is Calculated

The script:

1. Finds the highest rarity multiplier (currently "plane" at 170x)
2. For each equipment slot (weapon, armor, helmet, boots, accessory1, accessory2):
   - Checks all set items at max rarity (with 1.3x unique boost)
   - Checks all unique items at max rarity (with 1.3x unique boost)
   - Checks all procedural bases × materials at max rarity
   - Takes the highest defense value found
3. Adds the highest set bonus defense (Titan 6-piece: +100)
4. Updates `defenseConfig.ts` with the total

### Curve Mathematics

**Logarithmic** (default):
```
normalized = ln(1 + defense/k) / ln(1 + maxDefense/k)
blockPercent = minBlock + normalized × (maxBlock - minBlock)
```

**Diminishing**:
```
normalized = defense / (defense + k)
blockPercent = minBlock + normalized × (maxBlock - minBlock)
```

**Exponential**:
```
normalized = 1 - e^(-k × defense)
blockPercent = minBlock + normalized × (maxBlock - minBlock)
```

Where `k` is calculated from `midpointDefenseRatio` to ensure 50% of range is reached at the specified point.

## Integration

The defense system is used automatically in:

- `src/utils/defenseUtils.ts` - `calculateDefenseReduction(defense)`
- Combat damage calculations
- Character stat displays
- Tooltip previews

No code changes needed - just recalculate when adding items!

## Troubleshooting

**"Block percentage feels too high/low at mid-game"**
→ Adjust `midpointDefenseRatio` in `defenseConfig.ts`

**"Defense cap is reached too quickly"**
→ Lower `midpointDefenseRatio` or change `curveType` to `'logarithmic'`

**"Script shows 0 defense for items I just added"**
→ Ensure items have `defense: number` in their stat definitions

**"Max defense seems wrong"**
→ Check that new items are in `src/data/items/` directories
→ Verify rarity multipliers in `src/systems/rarity/rarities/`

## Advanced: Custom Curves

You can implement custom curve logic in `calculateBlockPercent()` in `defenseConfig.ts`. The function receives defense value and should return a block percentage (0.0 to maxBlockPercent).

Example adding a custom curve type:

```typescript
switch (config.curveType) {
  // ... existing cases ...
  
  case 'custom':
    // Your custom formula here
    normalized = Math.pow(defense / config.maxDefense, 0.8)
    break
}
```

---

**Last Updated**: 2026-02-12
**Current Max Defense**: 128,280
**Current Curve**: Logarithmic (midpoint 0.4, cap 95%)
