# Material Fragments — Design

Material fragments are craftable-resource loot drops.  They are the physical form of the
procedural item system's **material axis** — dropping as items in the dungeon, accumulating
in a dedicated stash, and consumed at the Forge to skip the gold-purchase path for crafting.

---

## Fragment as an Item

### New `MaterialFragmentV3` type

Material fragments live in the existing V3 item pipeline with a new discriminant value:

```ts
export interface MaterialFragmentV3 extends ItemV3Base {
  itemType: 'material'   // new discriminant alongside 'procedural' | 'unique' | 'set' | 'consumable'
  materialId: string     // e.g. "mithril", "dragonscale" — must match a Material.id in the registry
  quantity: number       // how many units this drop stacks to (usually 1, chest drops can be 2–3)
}
```

`ItemV3` union becomes:
```ts
export type ItemV3 = ProceduralItemV3 | UniqueItemV3 | SetItemV3 | ConsumableV3 | MaterialFragmentV3
```

`ItemStorage` is unchanged — it's `ItemV2 | ItemV3`, and `MaterialFragmentV3` is a `ItemV3`.

### Hydration

`hydrateItem` gets a new branch for `itemType === 'material'`:

```ts
// Pseudo-code — actual impl will be in itemHydration.ts
function hydrateMaterialFragment(stored: MaterialFragmentV3): Item {
  const material = getMaterialById(stored.materialId)
  return {
    version: 3,
    id: stored.id,
    name: `${material.name} Fragment${stored.quantity > 1 ? ` ×${stored.quantity}` : ''}`,
    description: `A raw piece of ${material.name.toLowerCase()}. Used at the Forge to craft items.`,
    type: 'material',          // new ItemSlot value (non-equippable)
    rarity: material.rarity,
    stats: {},                 // no combat stats — purely a crafting input
    value: Math.floor(GAME_CONFIG.forge.fragmentAlkahestValue * material.valueMultiplier),
    icon: material.icon ?? GiCrystalWand,  // material definition gets an optional icon field
    isMaterialFragment: true,  // runtime flag — lets any inventory code skip slot logic
    materialId: stored.materialId,
    stackCount: stored.quantity,
  }
}
```

### `ItemSlot` addition

Add `'material'` to the `ItemSlot` union type.  It is **non-equippable** — equip-logic guards
(`canEquip`, slot validation) simply check `type !== 'material'` early-out.  The inventory 
display uses the same guard: material items never appear in the equipment panel.

---

## Store State: Material Stash

A **separate store slice** tracks accumulated material quantities so they're never mixed
with equipment inventory.

```ts
// In GameState (types/index.ts)
materialStash: Record<string, number>  // materialId → total quantity owned
```

Default value: `{}`.

The stash is **bank-persisted** (saved with the rest of the game state) but is **not** part
of `bankInventory: Item[]`.  This keeps equipment lists clean and stacking trivial.

---

## `finalizeRunItemTransfer` Pipeline

When the player returns to town, `finalizeRunItemTransfer` in `inventoryActions.ts` already
iterates `dungeon.inventory` to distribute items to `bankInventory` or `overflow`.  A new
pre-pass intercepts material fragments before they reach that logic:

```
for each item in dungeon.inventory:
  if item.isMaterialFragment:
    materialStash[item.materialId] += item.stackCount   ← merge into stash
    remove from dungeon.inventory                        ← consumed here, never banked
  else:
    existing bank/overflow distribution logic
```

- Material fragments **never** trigger overflow — they auto-merge.
- The Shifty Guy deal **skips** them (they're not equippable items, so they're outside his selection set).
- Fragments **can** be scrapped manually from the Forge's stash panel for alkahest at the normal `items.alkahestConversionRate` applied against `baseFragmentValue × material.valueMultiplier`.  Controlled by `scrappedAlkahestRate` (1.0 = same rate as items).
- A small toast confirms how many fragments were added to the stash on return.

---

## Drop System Integration

### Config: `GAME_CONFIG.forge.materialFragment`

Fragment drop controls live under the `forge` section (not `loot`) since they are a Forge input, not general loot:

```ts
// gameConfig.ts — forge.materialFragment
materialFragment: {
  baseChance: 0.15,           // 15% secondary roll alongside any item-generating event
  chestBonus: 0.20,           // additive bonus for chest sources → 35% total
  bossDropGuaranteed: true,   // boss kills always drop a fragment, skips the chance roll
  bossDropQuantity: 2,        // fragments per boss kill (stacked into one drop item)
  maxPerDrop: 1,              // max fragments from a single non-chest/non-boss event
  maxPerChestDrop: 2,         // max fragments from a single chest event
  autoMergeOnReturn: true,    // fragments auto-merge into stash in finalizeRunItemTransfer
  scrappedAlkahestRate: 1.0,  // multiplier on alkahest conversion vs normal items (1.0 = same rate)
  baseFragmentValue: 40,      // base gold value → alkahest = baseFragmentValue × valueMultiplier × alkahestConversionRate
  // e.g. iron (×1.0): 40g → ~14 alkahest at 35% rate
  // e.g. mithril (×3.5): 140g → ~49 alkahest
  excludedFromDrops: [
    'narrative', 'author', 'plane', 'layer', 'elder',
    'void', 'singularity', 'structural', 'realityAnchor',
  ],
}
```

This is a **secondary roll** — it does not replace or affect the main item drop.  Every time
`generateItem` would produce a drop, there is also a `baseChance` roll to additionally
produce a `MaterialFragmentV3`.

### New function: `generateMaterialFragment`

```ts
// lootGenerator.ts
export function generateMaterialFragment(depth: number, sourceType?: 'chest' | 'boss'): MaterialFragmentV3 | null {
  const config = GAME_CONFIG.loot.materialFragment
  let chance = config.baseChance
  if (sourceType === 'chest')  chance += config.chestBonus
  if (sourceType === 'boss')   return generateForcedMaterialFragment(depth)  // guaranteed

  if (Math.random() > chance) return null

  // Reuse the existing depth-adjusted rarity weights to pick a material tier
  const rarity = selectRarityForMaterial(depth)   // same as selectRarity() but uses material registry
  const materialsAtRarity = getMaterialsByRarity(rarity)
  if (!materialsAtRarity.length) return null

  const material = materialsAtRarity[Math.floor(Math.random() * materialsAtRarity.length)]

  return {
    version: 3,
    id: uuidv4(),
    itemType: 'material',
    materialId: material.id,
    quantity: 1,
  }
}
```

### Where the roll is triggered

`generateItem()` is the single call-site for all item generation.  The material fragment roll
is **not** embedded in `generateItem` itself — it would conflate two different concerns.
Instead, the callers that currently call `generateItem(depth)` are updated to also call
`generateMaterialFragment(depth)` and push the result (if non-null) into the same loot array.

The primary call-sites are in `dungeonActions.ts` (combat loot) and the event resolver
(event loot/chests).  A small shared helper function wraps both calls:

```ts
// lootGenerator.ts
export function generateLootDrop(
  depth: number,
  opts: { 
    sourceType?: 'chest' | 'boss'
    forceType?: ItemSlot
    minRarity?: ItemRarity
    maxRarity?: ItemRarity
    modifiers?: string[]
  } = {}
): Item[] {
  const items: Item[] = []

  // Primary item drop
  items.push(generateItem(depth, opts.forceType, opts.minRarity, opts.maxRarity, 0, undefined, opts.modifiers))

  // Secondary material fragment roll
  const fragment = generateMaterialFragment(depth, opts.sourceType)
  if (fragment) items.push(hydrateItem(fragment))

  return items
}
```

Existing callers can migrate to `generateLootDrop` incrementally — `generateItem` stays
unchanged so nothing breaks.

### Material rarity gating (mirrors loot gating)

Only materials whose `rarity` has `RARITY_CONFIGS[rarity].minFloor <= depth` can drop.  The
`selectRarityForMaterial` helper filters the material pool the same way `getDepthAdjustedWeights`
filters the item rarity pool.  This means:

- Floors 1–4: only junk/common materials (Iron, Leather, Bronze fragments)
- Floors 5–9: uncommon materials start appearing (Steel, Silver, etc.)
- Floors 10+: rare materials unlock
- etc.

Materials in `excludedFromLoot` are also excluded from fragment drops by default (though
the forge config can have a separate exclusion list if needed).

---

## Bank / Stash Display

The material stash is surfaced in the **Forge modal** as a "Your Materials" panel, showing:

```
[ Iron Fragment ×3 ]  [ Steel Fragment ×1 ]  [ Mithril Fragment ×2 ]
  common                 uncommon               rare
```

Each entry shows the material's name, rarity badge (colored per rarity system), and quantity.

The Bank modal shows a small "Materials" count badge on its header tab as a secondary indicator
but does **not** show the stash contents directly — that's the Forge's job.

A future "Materials Pouch" modal from the town hub is out of scope for MVP.

---

## Forge Consumption

When forging with a fragment from the stash:

1. Player selects a material from the stash panel (not the gold-purchase picker).
2. Fragment quantity for that material is `>= 1` — Forge Material Slot shows it as "selected from stash."
3. On successful forge: `materialStash[materialId] -= 1`.
4. If quantity was already 0 the slot UI shows it as depleted (greyed out, disabled).

Gold-purchase crafting and stash-fragment crafting are **mutually exclusive UI modes** —
a `[ Stash | Buy ]` tab toggle on the Material Slot picker switches between them.

The **Buy tab** is not present in the Forge MVP — gold-buy is fully disabled until the
**Temple** system is designed and built.  When Temple ships, it will unlock gold-buy per
material tier, at which point the tab appears.  Materials at `celestial` rarity and above
have a `null` gold price in config and will be permanently stash-only regardless of Temple.

---

## Summary of Changes Required

### Types
| File | Change |
|---|---|
| `src/types/items-v3.ts` | Add `MaterialFragmentV3` interface; add to `ItemV3` union; add `isMaterialFragment` type guard |
| `src/types/index.ts` | Add `'material'` to `ItemSlot`; add `materialStash: Record<string, number>` to `GameState`; re-export new guard |

### Data
| File | Change |
|---|---|
| `src/data/items/materials/index.ts` | Add optional `icon?: IconType` field to `Material` interface; populate icons for key materials |
| `src/config/gameConfig.ts` | Add `forge.materialFragment` config block (under the new `forge` section, not `loot`) |

### Systems
| File | Change |
|---|---|
| `src/utils/itemHydration.ts` | Add `hydrateMaterialFragment` branch; add `isMaterialFragment` to hydrated item |
| `src/systems/loot/lootGenerator.ts` | Add `generateMaterialFragment(depth, sourceType?)`; add `generateLootDrop(depth, opts)` wrapper |
| `src/core/modules/inventoryActions.ts` | Pre-pass in `finalizeRunItemTransfer` to extract material fragments into `materialStash` |

### Store state
| File | Change |
|---|---|
| `src/core/gameStore.ts` (or relevant slice) | Add `materialStash` to initial state and persistence; add `consumeMaterialFromStash(materialId)` action |

### UI *(deferred to Forge implementation sprint)*
- `ForgeModal.tsx` — "Your Materials" stash panel
- Bank modal — materials count badge
