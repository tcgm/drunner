# Rarity Constraints for Unique and Set Items

## Overview

Unique and set items now support **rarity constraints** that control which rarities they can generate at. This allows fine-tuned control over item power scaling.

## Three Levels of Control

### 1. Per-Unique Item (Highest Priority)
Define `minRarity` and `maxRarity` directly on the unique item template:

```typescript
// src/data/items/uniques/weapons/excalibur.ts
export const EXCALIBUR: Omit<Item, 'id'> = {
  name: 'Excalibur',
  description: 'The legendary blade of kings...',
  type: 'weapon',
  rarity: 'legendary',  // Template/base rarity  
  minRarity: 'legendary',  // Can only roll legendary or higher
  maxRarity: 'mythic',     // Cannot exceed mythic
  icon: GiBroadsword,
  stats: {
    attack: 150,
    defense: 20,
    luck: 10,
  },
  value: 10000,
}
```

### 2. Per-Set (Default for All Items in Set)
Define `minRarity` and `maxRarity` on the set definition:

```typescript
// src/data/items/sets/index.ts
export const ALL_SETS: SetDefinition[] = [
  {
    name: TITAN_SET_NAME,
    items: TITAN_SET_ITEMS,
    bonuses: TITAN_SET_BONUSES,
    minRarity: 'epic',      // All Titan items roll epic or higher
    maxRarity: 'artifact',  // All Titan items can roll up to artifact
  },
  // ...
]
```

### 3. Per-Set-Item (Overrides Set Default)
Define `minRarity` and `maxRarity` on individual set items to override the set-wide constraints:

```typescript
// src/data/items/sets/titan/weapon.ts
export const TITANS_WRATH: Omit<Item, 'id'> = {
  name: "Titan's Wrath",
  description: 'A colossal hammer...',
  type: 'weapon',
  rarity: 'legendary',  // Template/base rarity
  minRarity: 'legendary',  // This specific item: legendary minimum (overrides set)
  maxRarity: 'mythic',     // This specific item: mythic maximum (overrides set)
  icon: GiWarhammer,
  stats: {
    attack: 150,
    defense: 30,
    maxHp: 40,
  },
  value: 14000,
}
```

## Priority Order

When determining which rarity constraints to use:

1. **Item-specific** (`minRarity`/`maxRarity` on item template) - **HIGHEST**
2. **Set-wide** (`minRarity`/`maxRarity` on set definition)
3. **Template rarity** (no variable rarity, always rolls at `rarity` field) - **DEFAULT**

## How It Works

### Unique Items

```typescript
// Helper automatically gets constraints
const { minRarity, maxRarity } = getUniqueItemRarityConstraints(uniqueTemplate)

// Rarity is rolled within the allowed range
const itemRarity = selectRarity(depth, minRarity, maxRarity)
```

### Set Items

```typescript
// Helper checks: item field > set definition > template rarity
const { minRarity, maxRarity } = getSetItemRarityConstraints(setTemplate)

// Rarity is rolled within the allowed range
const itemRarity = selectRarity(depth, minRarity, maxRarity)
```

## Examples

### Example 1: Fixed Rarity Unique
```typescript
// Always legendary - no variable rarity
export const SHADOWFANG: Omit<Item, 'id'> = {
  name: 'Shadowfang',
  rarity: 'legendary',
  // No minRarity/maxRarity = always rolls at template rarity
  // ...
}
```

### Example 2: Variable Rarity Unique (Epic to Mythic)
```typescript
// Can roll as epic, legendary, or mythic
export const THUNDERFURY: Omit<Item, 'id'> = {
  name: 'Thunderfury',
  rarity: 'epic',  // Base/minimum
  minRarity: 'epic',
  maxRarity: 'mythic',
  // ...
}
```

### Example 3: Set with Uniform Constraints
```typescript
// All Kitsune Set items roll rare to legendary
{
  name: KITSUNE_SET_NAME,
  items: KITSUNE_SET_ITEMS,
  bonuses: KITSUNE_SET_BONUSES,
  minRarity: 'rare',
  maxRarity: 'legendary',
}
```

### Example 4: Set with Per-Item Overrides
```typescript
// Draconic Set: most items rare+ but helmet can be mythic
// In set definition:
{
  name: DRACONIC_SET_NAME,
  items: DRACONIC_SET_ITEMS,
  bonuses: DRACONIC_SET_BONUSES,
  minRarity: 'rare',      // Set-wide minimum
  maxRarity: 'epic',      // Set-wide maximum
}

// In helmet file (override):
export const DRACONIC_CROWN: Omit<Item, 'id'> = {
  name: "Draconic Crown",
  rarity: 'legendary',
  maxRarity: 'mythic',  // This item can exceed set maximum
  // ...
}
```

## Stat Scaling Formula

The actual stats are calculated at generation time based on the rolled rarity:

**Unique Items:**
```
stats = template_stats × rolled_rarity_multiplier × 1.3
```

**Set Items:**
```
stats = template_stats × rolled_rarity_multiplier × [1.3 if isUniqueRoll else 1.0]
```

## Power Progression Example

Excalibur (150 base attack, legendary min, mythic max):

| Rolled Rarity | Multiplier | Result |
|---------------|------------|--------|
| Legendary     | 3.0 × 1.3  | 585 attack |
| Mythic        | 4.5 × 1.3  | 877 attack |

## Migration & Backward Compatibility

- ✅ `minRarity` and `maxRarity` are **optional**
- ✅ Omitting them = fixed rarity (existing behavior)
- ✅ Existing templates work without modification
- ✅ No breaking changes to save data

## Use Cases

### Early-Game Unique
```typescript
// Can drop early but scales to mid-game
minRarity: 'uncommon',
maxRarity: 'rare',
```

### Endgame Unique
```typescript
// Only drops at high depths, extreme power
minRarity: 'legendary',
maxRarity: 'artifact',
```

### Flexible Set
```typescript
// Useful at all stages of the game
minRarity: 'common',
maxRarity: 'mythic',
```

### Elite Set Piece
```typescript
// Signature weapon that's always powerful
minRarity: 'legendary',
maxRarity: 'legendary',  // Fixed at legendary
```

## Implementation Notes

- The `rarity` field is still required (serves as base/template rarity)
- Constraints are checked at **generation time**, not at hydration
- The rolled rarity is **stored** in the V3 item data
- Stat calculations use the **stored rarity**, not template rarity
- If constraints result in no valid rarity, falls back to template rarity
