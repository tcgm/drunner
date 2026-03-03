# Set & Unique Item Rarity Boost Implementation

## Summary

Fixed a critical bug where **set items and unique items were not benefiting from rarity multipliers** on their stats, and implemented:
1. **Variable rarity support** for both item types
2. **Rarity constraints system** allowing fine-grained control over which rarities items can roll at

Items can now specify `minRarity` and `maxRarity` in their templates to control power scaling.

## What Was Fixed

### Before
- ❌ Set items: Only applied unique roll boost (1.3x), **no rarity multiplier**
- ❌ Unique items: Only applied unique boost (1.3x), **no rarity multiplier**  
- ❌ Both types had fixed rarities from their templates
- ❌ Value calculations were correct, but stat calculations were broken

### After
- ✅ Set items: Apply **rarity multiplier × [unique roll boost if applicable]**
- ✅ Unique items: Apply **rarity multiplier × unique boost (1.3x)**
- ✅ Both types can generate at **multiple rarities** (stored in item data)
- ✅ **Both stats AND values** now use rarity multipliers correctly

## New Formulas

### Set Items
```typescript
Stats = template_stats × rarity_multiplier × [1.3 if isUniqueRoll else 1.0]
Value = template_value × rarity_multiplier × [1.3 if isUniqueRoll else 1.0]
```

### Unique Items
```typescript
Stats = template_stats × rarity_multiplier × 1.3
Value = template_value × rarity_multiplier × 1.3
```

## Examples

### Titan's Wrath (Set Item - 150 base attack)

| Configuration | Calculation | Result |
|--------------|-------------|--------|
| Legendary (template) | 150 × 3.0 | 450 attack |
| Legendary + unique roll | 150 × 3.0 × 1.3 | 585 attack |
| Mythic | 150 × 4.5 | 675 attack |
| Mythic + unique roll | 150 × 4.5 × 1.3 | 877 attack |

### Excalibur (Unique Weapon - 200 base attack)

| Configuration | Calculation | Result |
|--------------|-------------|--------|
| Legendary (template) | 200 × 3.0 × 1.3 | 780 attack |
| Mythic | 200 × 4.5 × 1.3 | 1170 attack |

## Technical Changes

### 1. Type Definitions (`types/items-v3.ts`)
- Added optional `rarity?: ItemRarity` field to `UniqueItemV3`
- Added optional `rarity?: ItemRarity` field to `SetItemV3`

### 2. Stat Calculations (`utils/itemStatCalculation.ts`)

#### `calculateUniqueStats()`
**Before:**
```typescript
calculateUniqueStats(baseStats, modifierIds?)
// Formula: template × 1.3
```

**After:**
```typescript
calculateUniqueStats(baseStats, templateRarity, actualRarity?, modifierIds?)
// Formula: template × rarity × 1.3
```

#### `calculateSetStats()`
**Before:**
```typescript
calculateSetStats(baseStats, isUniqueRoll, modifierIds?)
// Formula: template × [1.3 if unique roll]
```

**After:**
```typescript
calculateSetStats(baseStats, templateRarity, actualRarity, isUniqueRoll, modifierIds?)
// Formula: template × rarity × [1.3 if unique roll]
```

### 3. Item Hydration (`utils/itemHydration.ts`)

Updated `deriveUniqueItem()` and `deriveSetItem()` to:
- Use stored `rarity` if present, otherwise fall back to template rarity
- Pass both template and actual rarity to stat calculation functions
- Apply rarity multiplier to value calculations

### 4. Loot Generation (`systems/loot/lootGenerator.ts`)

Updated `generateItem()` to:
- Store the rolled `rarity` in `SetItemV3` items
- Store the rolled `rarity` in `UniqueItemV3` items
- This allows the same set/unique to generate at different power levels based on depth

### 5. Item Converter (`utils/itemConverter.ts`)

Updated `convertUniqueToV3()` and `convertSetToV3()` to:
- Preserve the item's actual rarity when converting from V2 to V3
- Ensures migrated items maintain their existing rarity

### 6. Item Migration (`utils/itemMigration.ts`)

Updated `generateExpectedStats()` to:
- Use item's actual rarity instead of template rarity for set items
- Add proper handling for unique items with rarity multipliers
- Ensures stat validation accounts for variable rarities

## Backward Compatibility

✅ **Fully backward compatible:**
- Items without stored rarity field will use template rarity (existing behavior)
- V2 items are converted and preserve their rarity
- Existing save files will work without modification
- The `rarity` field is optional, so old items continue working

## Testing

Run the test script to see example calculations:
```bash
node test-rarity-boost.mjs
```

## Impact

### Gameplay Impact
- **Set items are now properly scaled** to their rarity (previously under-powered)
- **Unique items are now properly scaled** to their rarity (previously under-powered)
- **High-rarity versions** of sets/uniques are significantly more powerful
- **Better progression curve** as you find higher rarity versions of iconic items

### Performance Impact
- Negligible - only affects stat hydration (already cached)
- No additional storage overhead (single optional field)

## Future Enhancements

### Option 1: Per-Template Rarity Configuration ✅ **IMPLEMENTED**
Templates can now specify which rarities they can generate at:
```typescript
export const EXCALIBUR: Omit<Item, 'id'> = {
  name: "Excalibur",
  minRarity: 'legendary',  // Only legendary or higher
  maxRarity: 'mythic',     // Cannot exceed mythic
  // ...
}
```

See [RARITY_CONSTRAINTS_GUIDE.md](RARITY_CONSTRAINTS_GUIDE.md) for full documentation.

### Option 2: Rarity Scaling Tweaks
Some uniques/sets might want custom scaling curves:
```typescript
export const TITANS_WRATH: SetTemplate = {
  name: "Titan's Wrath",
  rarityScaling: 0.8, // Lower scaling for this specific item
  // ...
}
```

### Option 3: Min/Max Rarity by Depth
Control which rarities can roll at different depths:
```typescript
// Only allow legendary+ versions of sets after floor 25
if (depth >= 25) {
  minRarity = 'legendary'
}
```

## Files Changed

1. `src/types/items-v3.ts` - Added rarity fields
2. `src/utils/itemStatCalculation.ts` - Updated formulas  
3. `src/utils/itemHydration.ts` - Updated hydration logic
4. `src/systems/loot/lootGenerator.ts` - Store rarity on generation
5. `src/utils/itemConverter.ts` - Preserve rarity on conversion
6. `src/utils/itemMigration.ts` - Handle variable rarities in validation

## Verification

Check existing unique/set items to ensure they benefit from both:
1. ✅ Rarity multiplier (based on `item.rarity`)
2. ✅ Unique/set boost (1.3x for uniques, 1.3x for unique-rolled sets)

## Notes

- The bug existed because the original implementation assumed set/unique items had "fixed" stats from templates
- In reality, rarity should scale ALL items (procedural, unique, and set) consistently
- This fix brings set/unique items in line with procedural items for stat scaling
- The "unique boost" (1.3x) is now correctly applied ON TOP OF the rarity scaling
