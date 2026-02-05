# Item System Refactor - Lazy Migration Approach

## Overview
Refactor items to store IDs and derive properties, while maintaining backward compatibility forever.

## Strategy: Read Old, Write New
**No forced migration. Old saves always work.**

1. **Old items remain valid** - V2 format works indefinitely
2. **New items use V3 format** - Loot generator creates efficient format
3. **Lazy conversion** - Detect and upgrade on access, not on load
4. **Gradual transition** - Items naturally convert through gameplay

## Architecture

### V2 (Legacy) - Keep Supporting Forever
```typescript
interface ItemV2 {
  id: string
  name: string
  description: string
  type: ItemSlot
  rarity: ItemRarity
  stats: Stats
  value: number
  icon?: IconType
  materialId?: string
  baseTemplateId?: string
  isUnique?: boolean
  setId?: string
  modifiers?: string[]
  statVersion?: number
  // NO version field = V2
}
```

### V3 (New) - ID-Based Format
```typescript
interface ItemV3 {
  version: 3  // Explicit version marker
  id: string
  
  // Discriminated union by type
  itemType: 'procedural' | 'unique' | 'set'
  
  // Procedural items
  materialId?: string
  baseTemplateId?: string
  baseName?: string       // "Axe", "Guitar", etc
  rarity?: ItemRarity
  
  // Unique/Set items
  templateId?: string     // "EXCALIBUR", "TITANS_GUARD"
  
  // Common
  modifiers?: string[]
}
```

## Implementation Steps

### Step 1: Type Guard & Detection
```typescript
// types/items-v3.ts
export function isItemV3(item: any): item is ItemV3 {
  return item.version === 3
}

export function isItemV2(item: any): item is ItemV2 {
  return !item.version || item.version === 2
}
```

### Step 2: Unified Item Type
```typescript
// Use union for storage, hydrate for runtime
export type ItemStorage = ItemV2 | ItemV3
export type Item = ItemV2 // Runtime always uses V2 shape for now
```

### Step 3: Hydration Layer
```typescript
// utils/itemHydration.ts
export function hydrateItem(stored: ItemStorage): Item {
  if (isItemV2(stored)) {
    // V2 items work as-is, just restore icon
    return restoreItemIcon(stored)
  }
  
  // V3 items: derive all properties
  return deriveItemFromV3(stored)
}

function deriveItemFromV3(item: ItemV3): Item {
  if (item.itemType === 'procedural') {
    return deriveProceduralItem(item)
  } else if (item.itemType === 'unique') {
    return deriveUniqueItem(item)
  } else {
    return deriveSetItem(item)
  }
}
```

### Step 4: Update Loot Generator
```typescript
// lootGenerator.ts - only change: wrap output
export function generateItem(...): ItemStorage {
  // Generate in V3 format
  const v3Item: ItemV3 = {
    version: 3,
    id: uuidv4(),
    itemType: 'procedural',
    materialId: material.id,
    baseTemplateId: base.id,
    baseName: selectedBaseName,
    rarity: rarity,
    modifiers: modifiers
  }
  
  // Return as storage type
  return v3Item
}
```

### Step 5: Update Usage Points
```typescript
// Wherever items are used:
const item = hydrateItem(storedItem) // Convert to runtime format
// Now use item.name, item.stats, etc normally
```

### Step 6: Opportunistic Conversion
```typescript
// When saving items back, convert V2 → V3 if possible
export function prepareItemForSave(item: Item): ItemStorage {
  if (isItemV2(item)) {
    // Try to convert to V3
    const v3 = tryConvertV2ToV3(item)
    return v3 || item // Use V3 if successful, keep V2 if not
  }
  return item
}
```

## Benefits

✅ **Zero Breaking Changes** - Old saves work forever
✅ **No Forced Migration** - Converts naturally through gameplay  
✅ **No Data Loss** - Can't fail migration if there is no migration
✅ **Gradual Improvement** - New items are efficient immediately
✅ **Easy Rollback** - Can revert changes without save corruption
✅ **Lower Risk** - Nothing breaks if conversion fails

## Conversion Triggers

Items naturally convert from V2 → V3 when:
- Upgraded (material/rarity)
- Equipped/unequipped
- Moved in inventory
- Modified in any way

Read-only operations (viewing, comparing) don't convert.

## Timeline

- Step 1-3: 3-4 hours (types + hydration)
- Step 4: 2 hours (update generation)
- Step 5: 6-8 hours (update all usage)
- Step 6: 2 hours (opportunistic conversion)

**Total**: ~13-16 hours (vs 25-35 for forced migration)

## Next Steps

1. Implement ItemV3 type in `types/items-v3.ts`
2. Create hydration layer in `utils/itemHydration.ts`
3. Update loot generator to produce V3
4. Add hydration calls at key points
5. Test with mixed V2/V3 saves
6. Ship it - old saves continue working
```typescript
interface Item {
  id: string
  name: string              // ❌ Derived from materialId + baseName
  description: string       // ❌ Derived from material + base
  type: ItemSlot
  rarity: ItemRarity
  stats: Stats              // ❌ Derived from base * material * rarity
  value: number             // ❌ Derived from base * material * rarity
  icon: IconType            // ❌ Lost on serialization, needs restoration
  materialId?: string       // ✅ Keep
  baseTemplateId?: string   // ✅ Keep
  isUnique?: boolean        // ✅ Keep
  setId?: string            // ✅ Keep
  modifiers?: string[]      // ✅ Keep
  statVersion?: number      // ❌ Not needed if we derive
}
```

## New Architecture (V3)

### Base Types
```typescript
// Raw item data - what gets saved
interface ItemData {
  id: string
  type: 'procedural' | 'unique' | 'set'
  
  // For procedural items
  materialId?: string
  baseTemplateId?: string
  baseName?: string        // Which variant: "Axe" vs "Hatchet"
  rarity?: ItemRarity
  
  // For unique/set items
  templateId?: string      // "EXCALIBUR", "SHADOWFANG", etc.
  
  // Common
  modifiers?: string[]
}

// Full item with derived properties - used at runtime
interface Item extends ItemData {
  // Derived properties (getters/computed)
  readonly name: string
  readonly description: string
  readonly itemSlot: ItemSlot
  readonly stats: Stats
  readonly value: number
  readonly icon: IconType
}
```

## Migration Phases

### Phase 1: Add Parallel Types (No Breaking Changes)
**Goal**: Support both old and new format

1. Create new types in `types/items-v3.ts`
2. Add `itemVersion?: 2 | 3` field to distinguish
3. Create converter functions:
   - `convertV2ToV3(oldItem: Item): ItemDataV3`
   - `hydrateItem(data: ItemDataV3): ItemV3`

### Phase 2: Add Runtime Derivation Layer
**Goal**: Derive properties from IDs

1. Create `utils/itemDerivation.ts`:
   ```typescript
   export function deriveItemProperties(data: ItemDataV3): Item {
     if (data.type === 'unique') {
       return deriveUniqueItem(data)
     } else if (data.type === 'set') {
       return deriveSetItem(data)
     } else {
       return deriveProceduralItem(data)
     }
   }
   ```

2. Handle all derivation cases:
   - Procedural: material + base + rarity → stats
   - Unique: templateId → all properties
   - Set: templateId → all properties
   - Modifiers: apply on top

### Phase 3: Add Migration Detection & Conversion
**Goal**: Auto-convert old saves

1. In `store/gameStore.ts` persist middleware:
   ```typescript
   const migrateItemsIfNeeded = (state: GameState): GameState => {
     if (state.itemSystemVersion === 3) return state
     
     return {
       ...state,
       itemSystemVersion: 3,
       heroes: state.heroes.map(hero => ({
         ...hero,
         equipment: migrateEquipment(hero.equipment),
         inventory: migrateInventory(hero.inventory)
       })),
       bank: migrateBank(state.bank)
     }
   }
   ```

2. Migration logic for each item:
   ```typescript
   function migrateItem(oldItem: Item): ItemDataV3 {
     // Detect if unique
     if (oldItem.isUnique && !oldItem.materialId) {
       return {
         id: oldItem.id,
         type: 'unique',
         templateId: detectTemplateId(oldItem.name),
         modifiers: oldItem.modifiers
       }
     }
     
     // Detect if set
     if (oldItem.setId) {
       return {
         id: oldItem.id,
         type: 'set',
         templateId: detectSetTemplateId(oldItem.name),
         modifiers: oldItem.modifiers
       }
     }
     
     // Procedural item
     return {
       id: oldItem.id,
       type: 'procedural',
       materialId: oldItem.materialId || detectMaterialFromName(oldItem.name),
       baseTemplateId: oldItem.baseTemplateId || detectBaseFromName(oldItem.name, oldItem.type),
       baseName: extractBaseName(oldItem.name),
       rarity: oldItem.rarity,
       modifiers: oldItem.modifiers
     }
   }
   ```

3. Detection heuristics:
   - Material: match name prefix against material.prefix
   - Base: match name suffix against baseNames
   - Fallback: create special "legacy" entries

### Phase 4: Update All Item Usage Points
**Goal**: Use derived properties everywhere

1. Search for all item property access
2. Update to use getters/derived properties
3. Key areas:
   - ItemSlot component
   - Equipment calculations
   - Inventory rendering
   - Comparison logic
   - Upgrade system
   - Loot generation

### Phase 5: Update Generation Systems
**Goal**: Generate new format directly

1. Update `lootGenerator.ts`:
   ```typescript
   export function generateItem(...): ItemDataV3 {
     // Generate ID-based data
     const data: ItemDataV3 = {
       id: uuidv4(),
       type: 'procedural',
       materialId: material.id,
       baseTemplateId: base.id,
       baseName: selectedBaseName,
       rarity: rarity,
       modifiers: modifiers
     }
     
     // Return hydrated item for immediate use
     return hydrateItem(data)
   }
   ```

2. Update `itemUpgrader.ts`:
   - Material upgrade: just change materialId
   - Rarity upgrade: just change rarity
   - Stats auto-recalculate

### Phase 6: Testing & Validation
**Goal**: Ensure no data loss

1. Create test saves with:
   - Old format items (V2)
   - Edge cases (corrupted data, unknown materials)
   - All item types (unique, set, procedural)

2. Validate migration:
   - All items convert successfully
   - Stats match or are recalculated
   - No crashes or data loss
   - Fallbacks work for unmappable items

3. Add comprehensive logs:
   - Track migration success/failure rates
   - Log items that need fallbacks
   - Report any data quality issues

### Phase 7: Cleanup
**Goal**: Remove old code

1. Remove old Item type definition
2. Remove statVersion and related migration code
3. Remove restoreItemIcon (icons always available)
4. Update documentation

## Fallback Strategies

### Unknown Material
If material can't be detected:
```typescript
{
  materialId: 'LEGACY_UNKNOWN',
  // Store original name/stats as override
  nameOverride: oldItem.name,
  statsOverride: oldItem.stats
}
```

### Unknown Base
Similar approach with legacy base templates

### Corrupted Data
Create special "Corrupted Item" with salvage value

## Benefits

✅ **Single Source of Truth**: Templates define everything
✅ **No Data Corruption**: Can't have mismatched descriptions
✅ **Smaller Saves**: ~70% reduction in item data size
✅ **Easy Updates**: Change template, all items update
✅ **No Stat Migrations**: Stats always calculated fresh
✅ **Better Performance**: Less data to serialize/deserialize

## Risks & Mitigations

⚠️ **Risk**: Migration fails for some items
✅ **Mitigation**: Comprehensive fallbacks, don't delete old data

⚠️ **Risk**: Performance hit from runtime derivation
✅ **Mitigation**: Memoize derived properties, benchmark

⚠️ **Risk**: Breaking existing saves
✅ **Mitigation**: Keep backup, allow rollback

## Timeline Estimate

- Phase 1-2: 4-6 hours (types + derivation)
- Phase 3: 6-8 hours (migration logic)
- Phase 4-5: 8-10 hours (update usage points)
- Phase 6: 4-6 hours (testing)
- Phase 7: 2-3 hours (cleanup)

**Total**: ~25-35 hours of focused work

## Next Steps

1. Review and approve this plan
2. Create feature branch `refactor/item-system-v3`
3. Implement phases incrementally
4. Test thoroughly between phases
5. Merge when stable
