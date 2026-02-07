# Plan: Item System Simplification—V3 Completion

The item system has a partially-implemented V3 format that stores only IDs and derives everything else at runtime. Currently only unique/set items use it; procedural items and consumables still use the bloated V2 format (15+ fields with redundant computed data). This plan completes the migration, eliminates redundant storage, removes repair systems, and establishes conversion from legacy formats on first display or modification.

**Key principles:**
- **Store minimal data**: IDs only (material, base, rarity, variant name)
- **Derive everything else**: Stats, names, descriptions, values computed at runtime
- **Session cache**: Per-composition keys to avoid redundant calculations
- **Dual-trigger migration**: V2→V3 conversion when item displayed OR modified, not on game load
- **Backward compatibility**: Name parsing extracts IDs from legacy items; failures stay V2 for manual resolution
- **Variant names**: Store full variant string (e.g., "Staff") - simple, collision-free, ~5 bytes average

**Terminology Clarification:**
- **type** = Folder name where base is located ("weapon", "armor", "helmet", "boots", "accessory") - categorization structure
- **ItemSlot** = Equipment slot on hero ("weapon", "armor", "helmet", "boots", "accessory1", "accessory2") - where item can be equipped
- **baseName** = Base template identifier ("sword", "axe", "book", "crown") - which template file
- **variantName** = Selected variant from baseNames array ("Sword"/"Blade", "Staff"/"Stave", "Book"/"Tome") - actual name shown
- **baseTemplateId** = `"<type>.<baseName>"` format (e.g., "weapon.sword", "helmet.crown")

**Note:** Type and ItemSlot are decoupled - this allows slots to accept multiple type folders, and by extension all bases within those folders. For example, an "accessory" slot could accept items from both "accessory" and "talisman" type folders, meaning it would accept all base templates (ring, amulet, etc.) from those folders.

**Example:** A "Mithril Blade" would have:
- type: "weapon"
- baseName: "sword" (from SWORD_BASE template)
- variantName: "Blade" (randomly chosen from `["Sword", "Blade"]`)
- baseTemplateId: "weapon.sword"
- Full name: "Mithril Blade" (materialPrefix + variantName)

**Steps**

1. **Extend composition key system for caching**
   - Update [itemHydration.ts](w:/repos/drunner/src/utils/itemHydration.ts) cache key generation to support all item types
   - Current format works for procedural: `${materialId}_${baseTemplateId}_${rarity}_${modifiers}`
   - Add consumable keys: `consumable_${baseId}_${sizeId}_${potencyId}_${rarity}_${modifiers}`
   - Add unique keys: `unique_${templateId}_${isUniqueRoll}_${modifiers}`
   - Add set keys: `set_${templateId}_${isUniqueRoll}_${modifiers}`
   - Modifiers are optional string[] IDs that reference [ItemModifier](w:/repos/drunner/src/data/items/mods/index.ts) templates
   - Modifiers have statMultipliers applied during stat calculation (cursed, blessed, quick, fortified, etc.)
   - Ensure cache persists for session lifecycle only

2. **Rename baseName to variantName and remove redundant itemSlot field**
   - Modify [items-v3.ts](w:/repos/drunner/src/types/items-v3.ts) `ProceduralItemV3` interface
   - Current field: `baseName: string` is **misnamed** - it actually stores the selected variant, not the template identifier
   - Rename field: `baseName` → `variantName` for correct terminology
   - Field stores selected variant (e.g., `"Staff"` or `"Stave"`, `"Sword"` or `"Blade"`)
   - **Remove field**: `itemSlot: ItemSlot` - redundant since it can be derived from base.type and cached
   - Quick filtering can use session cache instead of storing in every item
   - Update `deriveProceduralItem()` in [itemHydration.ts](w:/repos/drunner/src/utils/itemHydration.ts) to:
     - Use variantName field to select exact variant from template's baseNames array
     - Match case-insensitively for robustness
     - Fall back to first variant if variantName missing/not found
     - Derive itemSlot based on base.type (mapping logic: type="weapon"→slot="weapon", type="accessory"→slot="accessory1" by default, etc.)
     - Include derived itemSlot in cached result for quick filtering
   - Note: Template identifier ("sword") is derived from baseTemplateId, not stored separately

3. **Standardize baseTemplateId format and add explicit IDs**
   - Establish single format: `"<type>.<baseName>"` (e.g., "weapon.sword", "helmet.crown")
   - Update BaseItemTemplate interface in [bases/index.ts](w:/repos/drunner/src/data/items/bases/index.ts):
     - Add required field: `id: string` (base identifier only, not full path)
   - Update folder index files to export type constant:
     - Example: `weapon/index.ts` exports `const WEAPON_TYPE = "weapon"`
     - Example: `helmet/index.ts` exports `const HELMET_TYPE = "helmet"`
   - Update all base template files to include explicit `id` field:
     - Example: `SWORD_BASE` gets `id: "sword"` (just the base part)
     - Example: `CROWN_BASE` gets `id: "crown"` (just the base part)
     - Full baseTemplateId constructed as: `"${folderType}.${base.id}"` → `"weapon.sword"`
     - Decoupled from filename - allows file renames without breaking saves
   - Update `deriveProceduralItem()` in [itemHydration.ts](w:/repos/drunner/src/utils/itemHydration.ts):
     - Look up base by matching `"${base.type}.${base.id}"` against baseTemplateId
     - For legacy items: try underscore format as fallback, then migrate to dot format
   - Update generation code in lootGenerator: construct baseTemplateId as `"${base.type}.${base.id}"` directly from base template

4. **Complete procedural item V3 generation**
   - Update `generateItem()` in [lootGenerator.ts](w:/repos/drunner/src/systems/loot/lootGenerator.ts#L341-L565)
   - Currently returns V2 for procedural items; change to return `ProceduralItemV3`
   - Generate variantName when base has `baseNames` array:
     - Pick random variant from array
     - Store the full variant string in `variantName` field
   - Keep same material/base/rarity selection logic
   - Note: itemSlot is NOT stored - it will be derived from base.type during hydration/caching
   - Remove name generation, stat calculation, description building (derived at hydration)

5. **Implement ConsumableV3 generation**
   - `ConsumableV3` type already exists in [items-v3.ts](w:/repos/drunner/src/types/items-v3.ts); start using it
   - Update consumable generation in [lootGenerator.ts](w:/repos/drunner/src/systems/loot/lootGenerator.ts) or consumable systems
   - Store: `baseId` (effect type), `sizeId` (small/medium/large), `potencyId` (weak/potent/etc), `rarity`, `stackCount`
   - Create `deriveConsumableItem()` in [itemHydration.ts](w:/repos/drunner/src/utils/itemHydration.ts) if not fully implemented
   - Derive name format: `"<potency> <size> <baseName>"` (e.g., "Potent Large Health Potion")

6. **Build name parsing for V2→V3 migration**
   - Create new utility file [src/utils/itemNameParser.ts](w:/repos/drunner/src/utils/itemNameParser.ts)
   - Implement `parseProceduralName(name: string, type: ItemType)` → `{materialId, baseTemplateId, variantName} | null`
     - Extract material prefix by matching against all materials in [materials/index.ts](w:/repos/drunner/src/data/items/materials/index.ts)
     - Remaining text = base variant name (e.g., "Blade", "Staff")
     - Search all base templates for matching variant in their `baseNames` arrays
     - When match found, construct baseTemplateId using `"${base.type}.${base.id}"` format
     - Store the matched variant name exactly as it appears in the array
     - Example: "Mithril Blade" → material="mithril", variant="Blade", find base with id="sword" in type="weapon", construct baseTemplateId="weapon.sword"
   - Implement `parseConsumableName(name: string)` → `{baseId, sizeId, potencyId} | null`
     - Parse potency keywords (weak, decent, potent, supreme)
     - Parse size keywords (small, medium, large)
     - Extract base effect type (health, mana, stamina, food, etc.)
   - Return `null` on parsing failures (not corrupted fallback)

7. **Create V2→V3 converter with tracking**
   - Create [src/utils/itemConverter.ts](w:/repos/drunner/src/utils/itemConverter.ts)
   - Implement `convertToV3(itemV2: ItemV2): ItemStorage | null`
     - For procedural items: Use name parser to extract material/base/variantName
     - For consumables: Use consumable name parser
     - Create appropriate V3 object with parsed IDs and variant name
     - On parsing failure: Return `null`
   - Implement session tracking: `convertedItemIds: Set<string>` to avoid re-converting
   - Implement `markConverted(itemId: string)` and `wasConverted(itemId: string)` helpers

8. **Integrate conversion into hydration layer**
   - Update [itemHydration.ts](w:/repos/drunner/src/utils/itemHydration.ts) `hydrateItem()`
   - Add new parameter: `autoConvert: boolean = false` (defaults false for safety)
   - When called with `autoConvert: true`:
     - Check if item is V2 (via type guard)
     - Check if already converted this session (avoid redundant attempts)
     - If V2 and not previously attempted: Call `convertToV3()`
     - If conversion succeeds: Use converted V3 item for hydration, mark as converted
     - If conversion fails: Hydrate V2 as-is, mark as failed (don't retry)
   - Return object: `{ hydratedItem: Item, converted: boolean, v3Item?: ItemStorage }`
   - Caller can update storage with v3Item if converted is true

9. **Update item display components to trigger conversion**
   - Identify all components that display items:
     - [src/components/inventory/](w:/repos/drunner/src/components/inventory/) - Inventory slots
     - [src/components/dungeon/](w:/repos/drunner/src/components/dungeon/) - Loot display
     - Shop/merchant components
     - Equipment panel
     - Item tooltip/detail views
   - Before rendering item, call `hydrateItem(item, autoConvert: true)`
   - If `converted: true`, update the item in store with `v3Item`
   - Collect conversions in batch, trigger debounced save (not per-item)
   - Performance considerations:
     - Throttle/batch conversions when displaying many items (100+ in inventory)
     - Use React.memo() to prevent unnecessary re-renders during batch conversion
     - Display loading indicator if batch conversion takes >100ms
   - Failed conversions: Items stay as V2, require manual resolution via [ReviewV2ItemsModal](w:/repos/drunner/src/components/party/ReviewV2ItemsModal.tsx)
     - Modal shows item preview and guesses material/base from name/description
     - User confirms or adjusts material and base template selections
     - Progress indicator shows N of M items being reviewed
   - Corrupted items with missing critical data: Appear in [CorruptedItemsModal](w:/repos/drunner/src/components/party/CorruptedItemsModal.tsx)
     - Modal offers: reroll, sell for gold, sell for alkahest, delete
     - Different from V2 conversion failures - these are fully broken items

10. **Update item modification points to trigger conversion**
   - Identify all operations that modify items:
     - Item equip/unequip
     - Item upgrade (material/rarity) in [itemUpgrader.ts](w:/repos/drunner/src/systems/loot/itemUpgrader.ts)
     - Item enchantment/modification
     - Item stacking/splitting
     - Item selling/trading
   - Before modifying V2 item: Call `hydrateItem(item, autoConvert: true)`
   - If conversion succeeds: Perform modification on V3 item
   - If conversion fails: Allow modification on V2 item (backward compat)
   - After modification: Trigger save if conversion occurred

11. **Update all item generation to use V3**
    - [lootGenerator.ts](w:/repos/drunner/src/systems/loot/lootGenerator.ts) `generateItem()`: Return V3 union types for all branches
    - Unique items: Already return `UniqueItemV3` ✓
    - Set items: Already return `SetItemV3` ✓  
    - Procedural items: Switch from V2 → `ProceduralItemV3` (step 4)
    - Consumables: Switch to `ConsumableV3` (step 5)
    - Remove all name generation, stat calculation in generator

12. **Extract stat calculation to dedicated module**
    - Create [src/utils/itemStatCalculation.ts](w:/repos/drunner/src/utils/itemStatCalculation.ts)
    - Move stat calculation formulas from lootGenerator
    - Implement `calculateProceduralStats(material, base, rarity, modifiers)` → Stats
    - Implement `calculateUniqueStats(template, modifiers)` → Stats
    - Implement `calculateSetStats(template, isUniqueRoll, modifiers)` → Stats
    - Implement `calculateConsumableStats(base, size, potency, rarity)` → Stats, effects
    - Include all multiplier logic: material.statMultiplier, rarity.statMultiplier, unique boost (30%), modifiers
    - Apply modifier statMultipliers by looking up modifier IDs in [src/data/items/mods/index.ts](w:/repos/drunner/src/data/items/mods/index.ts)
    - Note: Stats are NEVER stored on items, only derived at hydration time and cached per session

13. **Update hydration to derive all stats and icons at runtime**
    - [itemHydration.ts](w:/repos/drunner/src/utils/itemHydration.ts) `hydrateItem()` is the single bottleneck
    - All V3 items (procedural/consumable/unique/set) → derive full V2 runtime object
    - Call stat calculation functions from itemStatCalculation.ts
    - Generate names from material prefix + variantName (procedural) or template name (unique/set/consumable)
    - Generate descriptions from base.description + material.description
    - Calculate value from base value × multipliers
    - Derive icons (not stored in saves, only session cache):
      - **Warning**: Existing [restoreItemIcon()](w:/repos/drunner/src/utils/itemUtils.ts) is V2-oriented and too complex for V3
      - That function: parses V2 name/description, uses underscore baseTemplateId format, has fallback heuristics
      - **Create new function** `deriveV3Icon(itemV3: ItemV3, templates)` in itemHydration.ts:
        - ProceduralItemV3: Look up base by baseTemplateId (dot format), check base.baseNameIcons[variantName], fallback to base.icon
        - UniqueItemV3: Look up unique template by templateId, use template.icon
        - SetItemV3: Look up set template by templateId, use template.icon
        - ConsumableV3: Look up consumable base by baseId, use base.icon
      - Much simpler: direct lookups, no name parsing
      - Keep old restoreItemIcon() for V2 backward compat only
    - Use composition key caching to avoid redundant derivation
    - V2 items pass through unchanged (backward compat)

14. **Implement dehydration for saves**
    - [itemHydration.ts](w:/repos/drunner/src/utils/itemHydration.ts) already has `dehydrateItem()` stub
    - Complete implementation:
      - Type guard to detect V2 vs V3 via `'version' in item`
      - V3 items: Strip runtime fields, return minimal V3
      - V2 items: Return as-is (no forced conversion at save time)
    - Call from [saveManager.ts](w:/repos/drunner/src/core/saveManager.ts) before serializing to localStorage
    - Already integrated in gameStore's dehydrateGameState function
    - Only V3 items get dehydrated; V2 items saved unchanged until they're converted

15. **Implement store update mechanism for converted items**
    - When hydration with autoConvert returns `{ converted: true, v3Item }`, must update item in storage
    - Items are stored in multiple locations in GameState:
      - `hero.equipment[slot]` - equipped items on heroes
      - `dungeon.inventory` - items picked up during run
      - `bankInventory` - items in bank storage
      - `overflowInventory` - items exceeding bank capacity
      - `corruptedItems` - items that failed hydration
      - `v2Items` - explicitly tracked V2 items (consider obsoleting this)
    - Create helper function `replaceItemInState(state: GameState, oldItemId: string, newItem: ItemStorage): GameState`
      - Search all storage locations for item with matching id
      - Replace with converted V3 item
      - Return updated state
    - Call from display/modification points after successful conversion
    - Batch conversions: Collect all replacements, apply once, trigger single debounced save

16. **Update item upgrade system**
    - [itemUpgrader.ts](w:/repos/drunner/src/systems/loot/itemUpgrader.ts) currently parses names to extract materialId/baseName
    - Add conversion trigger: Before upgrading, call `hydrateItem(item, autoConvert: true)`
    - For V3 items: Read materialId directly from item, no parsing needed
    - For V2 items that converted: Use V3 data for upgrade
    - For V2 items that failed to convert: Keep existing name parsing as fallback
    - Material upgrade: Increment material tier via ID lookup in material registry
    - Rarity upgrade: Increment rarity tier; recalculation happens automatically at hydration
    - Remove `extractMaterialId()`, `extractBaseName()` once V2 items phased out

17. **Remove obsolete systems**
    - Remove stat versioning: Delete `statVersion` field, `CURRENT_STAT_VERSION`, `migrateItemStats()` from [itemMigration.ts](w:/repos/drunner/src/utils/itemMigration.ts)
    - Remove name repair: Delete `repairItemName()`, `generateItemName()` keyword matching from [lootGenerator.ts](w:/repos/drunner/src/systems/loot/lootGenerator.ts)
    - Remove old keyword heuristics: Delete `generateBaseTemplateId()` function if it exists; baseTemplateId now constructed directly from explicit base.id
    - Keep `restoreItemIcon()` for V2 backward compatibility only - V3 uses new `deriveV3Icon()` function

18. **Deprecate legacy consumables**
    - Mark hardcoded consumables in [data/consumables/potions/index.ts](w:/repos/drunner/src/data/consumables/potions/index.ts) as deprecated
    - Add migration path in consumable name parser (step 6):
      - Map `"Small Health Potion"` → `{baseId: "health", sizeId: "small", potencyId: "decent", rarity: "common"}`
      - Map all legacy names to procedural equivalents
    - Update consumable generators to only create procedural variants
    - Eventually remove legacy definitions after migration stabilizes

**Verification**

- Load old save files from multiple versions; verify game loads fast without conversion
- Open inventory/loot screens with V2 items; verify automatic conversion to V3 on display
- Upgrade/equip/sell V2 items; verify automatic conversion to V3 on modification
- Check converted items persist correctly after save/reload cycle
- Verify save file sizes shrink progressively as items get converted
- Generate new items; verify all return V3 formats
- Test variant names: Multiple items with same base/material should show different variant names when randomly generated
- Test name parsing: Create V2 items with complex names, verify parsing extracts correct IDs
- Test parsing failures: Create items with unparseable names, verify they stay V2 without corruption
- Verify session cache: Display/modify identical items, check that derivation happens once per composition key
- Profile performance: First display/modification triggers conversion + hydration; subsequent uses cache
- Test legacy consumable compatibility: Load saves with old potions, interact with them, verify conversion
- Test material/rarity upgrades on V3 items without name parsing
- Test batch conversion: Open inventory with 100 V2 items, verify single save triggered (debounced)
- Test upgrade path: Upgrade V2 item, verify it converts to V3 before upgrade applies

**Decisions**

- **Dual-trigger migration**: V2→V3 conversion happens when item first rendered in UI OR when modified (equip/upgrade/sell)—fast load times, ensures all active items migrate
- **Parse failure handling**: Items with unparseable names stay V2 for manual resolution modal
- **Cache scope**: Per-composition key (material+base+rarity+etc), shared across item instances—less memory than per-item ID
- **Variant storage**: Store full variant name string (e.g., `"Staff"`)—simple, collision-free, minimal overhead (~5 bytes average)
- **Backward compat strategy**: Infinite backward support via hydration; V2 items never forced to convert
- **Runtime format**: Continue using V2 as runtime format (hydrated); only storage format changes to V3
- **Save trigger**: Batch conversions with debounced save to avoid performance impact
- **Modification safety**: Conversion attempted before modification; if fails, operation proceeds on V2 format
- **Icon storage**: Icons NOT stored in saves (React components don't serialize), derived from base templates at hydration, cached in session
- **Modifier application**: Modifiers stored as ID strings, looked up from template registry, statMultipliers applied during stat calculation
- **Rollback strategy**: Existing backup system ([src/core/modules/backup.ts](w:/repos/drunner/src/core/modules/backup.ts)) provides safety net if V3 issues arise in production
