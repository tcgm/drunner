// Loot Integration Documentation
//
// The event system now supports multiple ways to specify item generation:
//
// 1. SIMPLE ITEM TYPES:
//    { type: 'item', itemType: 'weapon' }     // Generate any weapon
//    { type: 'item', itemType: 'random' }     // Generate any item
//
// 2. LITERAL MATERIAL IMPORTS:
//    import { STEEL, MITHRIL } from '@/data/items/materials'
//    { type: 'item', material: STEEL, itemType: 'weapon' }
//
// 3. LITERAL UNIQUE ITEM IMPORTS:
//    import { EXCALIBUR } from '@/data/items/uniques/weapons/excalibur'
//    { type: 'item', uniqueItem: EXCALIBUR }
//
// 4. WEIGHTED ITEM CHOICES:
//    {
//      type: 'item',
//      itemChoices: [
//        { weight: 70, itemType: 'weapon' },
//        { weight: 20, material: STEEL, itemType: 'armor' },
//        { weight: 10, uniqueItem: EXCALIBUR }
//      ]
//    }
//
// This provides:
// - Type safety through TypeScript imports
// - Individual file architecture support
// - Flexible probability systems  
// - Clean separation between data and logic
//
// Events are pure data definitions, item generation happens at resolution time.

# Item Stat Calculation & Versioning

## Current Formula (Version 1)

All procedurally generated items use this formula:

```
Item Stat = Base Template Stat × Material Multiplier × Rarity Multiplier
Item Value = Base Value × Material Multiplier × Rarity Multiplier
```

### Example Calculation:
```typescript
// Base template: Sword with 5 attack
// Material: Mithril (2.5× multiplier)  
// Rarity: Legendary (4.0× multiplier)
// Result: 5 × 2.5 × 4.0 = 50 attack
```

## Stat Versioning System

Every item carries a `statVersion` field that tracks which formula was used:

- **New items**: Created with `statVersion: 1` (current)
- **Old items**: Missing `statVersion` or have outdated version
- **Migration**: Automatic on save load

### Migration Process:

1. Check item's `statVersion` field
2. If outdated or missing:
   - Generate "phantom copy" with current formula
   - Compare stats and value
   - If different, replace with corrected version
   - Mark with current `statVersion`
3. If current version, skip migration

### Implementation:

- **Generator**: `src/systems/loot/lootGenerator.ts` - Sets version on creation
- **Migration**: `src/utils/itemMigration.ts` - Handles version checks and updates
- **Version constant**: `CURRENT_STAT_VERSION` - Increment when formula changes

This ensures items remain balanced across game updates without manual intervention.
