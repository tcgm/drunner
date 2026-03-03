# The Forge — Feature Design

## Overview

The Forge is a Town Hub building with two complementary modes:

- **Craft** — make items deterministically by explicitly choosing every input the loot generator would normally randomize.  It is a *back-port* of the procedural item system: instead of rolling `material + base + rarity` randomly at dungeon depth, you hand-pick them and pay alkahest for certainty.
- **Break Down** — feed unwanted items into the Forge to charge up a per-material progress meter.  When a meter fills, you receive one material fragment of that type.  Progress persists across runs and can be improved through both Nexus upgrades and the future Research system.

---

## Design Pillars

| Pillar | Expression |
|---|---|
| **Agency** | Every axis of the resulting item is chosen, not rolled |
| **Cost = Certainty** | Alkahest is spent to remove randomness; higher rarity = steeper cost |
| **Tactile feel** | Radial slot layout + clickable anvil animation = satisfying ritual |
| **System purity** | Craft output is a standard `ProceduralItemV3` — no special item type needed |
| **Closed loop** | Items flow in (breakdown) and out (craft) of the same building, keeping the material economy self-contained |

---

## The Forge Interface

The Forge modal has two top-level tabs: `[ Craft | Break Down ]`.

### Craft Mode Layout

```
          ┌──────────────────────────────────┐
          │  [ MATERIAL ]      [ BASE/MOLD ] │   ← top two input slots
          │                                  │
          │        ╔══════════╗              │
          │        ║  ANVIL   ║              │   ← centre — click to forge
          │        ║  (anim)  ║              │
          │        ╚══════════╝              │
          │                                  │
          │  [ MOD 1 ]   [ ALKAHEST ]  [ MOD 2 ] │   ← bottom ring of slots
          │                                  │
          │  ┌─────────────────────────────┐ │
          │  │   [ ITEM PREVIEW ]         │ │   ← live preview panel
          │  └─────────────────────────────┘ │
          └──────────────────────────────────┘
```

Slots are arranged in a radial ring around the anvil.  On desktop the anvil sits center-screen; on mobile the slots stack vertically above and below.

### Break Down Mode Layout

```
          ┌──────────────────────────────────┐
          │  [ Item picker — bank items      │
          │    showing material + charge     │
          │    contribution per item ]       │
          │                                  │
          │        ╔══════════╗              │
          │        ║  SMELT   ║              │   ← same anvil, cold/dark anim
          │        ║  (anim)  ║              │
          │        ╚══════════╝              │
          │                                  │
          │  ┌─────────────────────────────┐ │
          │  │  CHARGE METERS              │ │   ← one row per active material
          │  │  [ Iron    ██████░░ 60/100 ] │ │      fills → fragment reward
          │  │  [ Mithril ███░░░░░ 30/100 ] │ │
          │  └─────────────────────────────┘ │
          └──────────────────────────────────┘
```

### Craft Mode Slots

#### 1. Material Slot
- The **material** determines the item's base rarity tier and `statMultiplier`.
- **Primary mode — Stash**: material fragments found in the dungeon accumulate in the player's `materialStash`.  Selecting a material from the stash costs nothing extra (beyond the alkahest forge cost, with a 15% discount applied for earned fragments).
- **Secondary mode — Gold Purchase**: buying a material with gold will be unlocked per material tier by the **Temple** — a tech tree system not yet designed or built.  Until Temple exists, gold-buy is fully disabled and the Forge is stash-only.  Controlled by `GAME_CONFIG.forge.goldBuyEnabled` — set to `false` for MVP, flipped to `true` when Temple ships.  Materials at `celestial` rarity and above are permanently stash-only even after Temple launches.
- The two modes are presented as a tab toggle on the Material Slot picker: `[ Stash | Buy ]`.  The "Buy" tab is hidden entirely when `goldBuyEnabled` is `false`; it appears and becomes tier-unlockable once Temple ships.
- Blacklist rules from `Material.blacklist` still apply (e.g. leather can't make a weapon).

#### 2. Base / Mold Slot
- The **base template** controls item type (slot), base stats, and description.
- Displayed as a scrollable grid of all `BaseItemTemplate` entries, filtered by the selected material's compatibility.
- Each base visually shows its item slot icon and a stat preview at the material's base rarity.

#### 3. Alkahest Slot (Rarity Charger)
- Accepts an **alkahest charge amount** — displayed as a glowing "charge meter" with selectable rarity tiers across the top.
- The **target rarity** can be pushed above the material's native rarity by spending alkahest.
- Cost formula (see §Alkahest Cost below).
- Rarity cannot be pushed below the material's native rarity (the material "floors" it).
- Rarity cannot exceed the player's current progression ceiling (unlocked by dungeon depth).

#### 4. Modifier Slots (optional, unlockable)
- Initially: 0 modifier slots available (controlled by `GAME_CONFIG.forge.baseModifierSlots`).
- Will be unlocked by the **Temple** tech tree (future system, not yet built) — up to a hard cap of 2 slots (`GAME_CONFIG.forge.maxModifierSlots`).
- Each additional modifier slot also increases the forge's alkahest cost by a flat `GAME_CONFIG.forge.modifierSlotCost` (default: 50 alkahest per filled slot).
- Drag a mod fragment (future item) into a slot to guarantee a specific modifier on the output.
- At MVP launch: **0 slots visible** — the modifier ring area is hidden or shows a locked placeholder.  Slots appear once Temple is built and the first Temple upgrade is purchased.

---

## Item Breakdown System

### Concept

Any procedural item from `bankInventory` can be fed into the Forge's Break Down tab.  The item is consumed and contributes **charge** to its material's progress meter.  When a meter reaches its threshold, the player receives **1 material fragment** of that type and the meter resets (excess charge carries over).

This is the tertiary path for acquiring material fragments (after dungeon drops and, eventually, gold purchase) — purpose-built for converting junk equipment into targeted crafting inputs.

### Charge Contribution

Charge contributed per item is determined by the item's **rarity**, not its stats or value, so any item of the same rarity is interchangeable as breakdown fodder:

```ts
// GAME_CONFIG.forge.breakdown.chargePerRarity
junk:        5
common:      10
uncommon:    20
rare:        40
veryRare:    80
magical:     160
elite:       240
epic:        400
legendary:   800
mythic:      1_600
mythicc:     3_200
artifact:    6_400
// ... continues doubling
```

Bonus multipliers (all stack multiplicatively):
- **Unique item**: `×uniqueBreakdownMultiplier` (default `1.5`)
- **Set item**: `×setBreakdownMultiplier` (default `1.3`)
- **Nexus upgrade** `FORGE_BREAKDOWN_EFFICIENCY`: adds `+nexusChargeBonus%` per tier to all charge contributions
- **Research** (future Temple system): similar additive bonus, separate track

Only items with a known `materialId` (i.e. procedural items) can be broken down.  Unique and set items can be broken down but contribute to the material their `materialId` references (which may be `undefined` for some uniques — those are excluded from breakdown).

### Charge Thresholds

The threshold to earn 1 fragment scales by material rarity so low-tier fragments are cheap to grind and high-tier ones require genuine commitment:

```ts
// GAME_CONFIG.forge.breakdown.thresholdByRarity
junk:        50     // ~5 junk items
common:      100    // ~10 common items, or ~3 uncommon
uncommon:    200    // ~10 uncommon items
rare:        400
veryRare:    800
magical:     1_600
elite:       3_200
epic:        8_000
legendary:   20_000
mythic:      50_000
// beyond: not intended as a normal breakdown target — fragment drops are the source
```

### Persistence

Progress meters live in game state as:

```ts
// GameState (types/index.ts)
materialChargeProgress: Record<string, number>  // materialId → current charge accumulated
```

This is **save-persisted** alongside `materialStash` — progress is never lost on run death or return to town.  There are no diminishing returns across runs.

### Charge Meter UI

- One row per material that has any charge progress (`> 0`) or that you currently hold in stash.
- Each row: material name, rarity badge, progress bar, `current / threshold` label.
- When a meter fills: bar flashes, fragment reward pops in with the same stash-merge toast as dungeon drops, meter resets to carry-over amount.
- Empty meters for materials you've never interacted with are hidden (not cluttering the panel with 30 rows).

### Config

```ts
// GAME_CONFIG.forge.breakdown
breakdown: {
  enabled: true,
  carryOverExcess: true,          // leftover charge after threshold carries into the next meter cycle
  chargePerRarity: { ... },       // see table above
  thresholdByRarity: { ... },     // see table above
  uniqueBreakdownMultiplier: 1.5, // charge bonus for unique items
  setBreakdownMultiplier: 1.3,    // charge bonus for set items
  // Nexus upgrade hook — the actual upgrade definition lives in src/data/nexus/
  // This controls which nexus upgrade ID is read for the efficiency bonus
  nexusUpgradeId: 'FORGE_BREAKDOWN_EFFICIENCY',
  // Per-tier bonus applied to all charge contributions (0.20 = +20% per nexus tier)
  nexusChargeBonus: 0.20,
  // Research hook (future Temple system) — same shape, separate upgrade ID
  researchUpgradeId: 'FORGE_BREAKDOWN_RESEARCH',
  researchChargeBonus: 0.15,      // +15% per research tier
}
```

### Nexus Upgrade

A new entry in the Nexus **Fortune** category (alongside `ALKAHEST_YIELD`):

```
FORGE_BREAKDOWN_EFFICIENCY
  Description: "Items broken down at the Forge yield more charge per piece."
  Cost: baseCost 50 (common→epic rarity progression)
  Bonus: +20% charge per tier
  Max tiers: 5 (up to +100% — doubles the effective breakdown rate at max)
```

This is independent of the Research track — they stack.

---

A forge "recipe" is simply the explicit inputs to `generateItem`:

```ts
interface ForgeRecipe {
  materialId: string       // e.g. "mithril"
  baseTemplateId: string   // e.g. "weapon.sword"
  targetRarity: ItemRarity // e.g. "epic"  — may exceed material's native rarity
  modifierIds?: string[]   // optional locked modifiers
}
```

This maps directly onto the existing `generateItem(depth, type, minRarity, maxRarity, 0, material, modifiers)` call — we just pin `type`, `material`, and `rarity` to remove all randomness.  A dedicated `forgeItem(recipe: ForgeRecipe): Item` function wraps this.

---

## Alkahest Cost

Alkahest pays for **certainty** and for **rarity elevation** above the material's native tier.  There is **no cap** on how many tiers you can elevate — the exponential curve self-regulates.

```
baseCost   = GAME_CONFIG.forge.baseCost                 // 25 — flat cost at native rarity
steps      = rarityIndex(targetRarity) - rarityIndex(material.rarity)  // 0-based elevation
modCost    = filledModSlots * GAME_CONFIG.forge.modifierSlotCost        // 50 per slot

elevationCost  = baseCost * (elevationBase ^ steps)     // elevationBase = 1.8
totalAlkahest  = baseCost + elevationCost + modCost
```

If using a **stash fragment** instead of a gold-purchased material, apply the discount:
```
totalAlkahest *= GAME_CONFIG.forge.stashCostMultiplier  // 0.85 — 15% off
```

Concrete examples (no mods, no stash discount):

| Elevation steps | Elevation cost | Total alkahest |
|---|---|---|
| 0 (native rarity) | 25 | **50** |
| +1 | 45 | **70** |
| +2 | 81 | **106** |
| +3 | 146 | **171** |
| +5 | 473 | **498** |
| +10 | 3,571 | **3,596** |
| +15 | 26,940 | **26,965** |

The cost is **shown live** in the preview panel before the player confirms, so there's no surprise.

---

## The Anvil Animation

The anvil is the centerpiece and the only interactive action button.

- **Idle state**: anvil glows faintly, hammer rests on it; glow pulses when all required slots are filled.
- **Strike animation**: player clicks → hammer swings down in a short looping strike animation (2–3 hits) → sparks/glow burst → item materializes in the preview slot.
- **Locked state** (missing inputs): anvil is dim, cursor changes to "not allowed", tooltip explains what's missing.
- Implementation: Framer Motion + a CSS keyframe for the hammer swing.  The anvil icon can be `GiAnvil` from `react-icons/gi`, swapping to a strike variant mid-animation.

---

## Item Preview

The live preview panel (below the anvil) shows the item that *would* be forged given the current selections, updating reactively as inputs change.

- Renders an `ItemCard` (or equivalent) in a "ghost" / semi-transparent state while uncommitted.
- Shows: item name, rarity badge, type icon, all stats, value.
- On forge: the ghost snaps to full opacity with a glow-in animation, then the item lands in the bank (or overflow if full).

---

## Materials as Loot

Material fragments drop as dungeon loot and are the **primary** path for Forge crafting.  The full design lives in [MATERIAL_FRAGMENTS.md](./MATERIAL_FRAGMENTS.md).  Key points for the Forge:

- Fragments are stored in `materialStash: Record<string, number>` — separate from `bankInventory`.
- They auto-merge on town return (never trigger overflow).
- The Forge Material Slot reads directly from `materialStash`.
- Gold-buy (secondary fallback) is disabled at MVP; will be unlocked per tier by the **Temple** system when it is eventually built.

---

## Forge Access & Progression

- The Forge building appears in the Town Hub alongside Market Hall, Bank, Nexus, etc.
- Initial access: **always available** from the start (like the bank).
- **Rarity gate**: A target rarity whose `RARITY_CONFIGS[rarity].minFloor` exceeds the player's deepest floor reached is greyed out in the picker, regardless of alkahest available.  Controlled by `GAME_CONFIG.forge.respectFloorGate`.
- **Gold-buy unlock**: Fully disabled at MVP (`goldBuyEnabled: false`).  The Forge is stash-only until the **Temple** system is built.  Flipping `goldBuyEnabled` to `true` enables the Buy tab and the Temple-gated tier unlock system.  The `goldPrices` map is designed now so the hook is ready.  Materials at `celestial`+ have `null` prices and are permanently stash-only.
- **Modifier slots**: 0 at launch (`baseModifierSlots: 0`) and not visible in MVP UI.  The Temple system will unlock them (up to `maxModifierSlots: 2`) when it ships.

---

## Data & Code Changes Required

### New files
| Path | Purpose |
|---|---|
| `src/systems/forge/forgeSystem.ts` | `forgeItem(recipe)`, `breakDownItem(itemId)`, `getMaterialChargeProgress()` |
| `src/components/ui/ForgeModal.tsx` | Full forge UI — both Craft and Break Down tabs |
| `src/components/ui/ForgeModal.css` | Styles |

### Modified files
| Path | Change |
|---|---|
| `src/data/buildings.ts` | Add Forge building entry to the town layout |
| `src/components/screens/TownHubScreen.tsx` | Wire up `<ForgeModal>` |
| `src/store/gameStore` (or slice) | `forgeItem` action; `breakDownItem` action; `materialChargeProgress` state + persistence |
| `src/config/gameConfig.ts` | Add `forge` section: cost params, breakdown config, gold-buy config |
| `src/data/nexus/` | Add `FORGE_BREAKDOWN_EFFICIENCY` upgrade definition |

### No new item types needed
The output of the forge is a standard `ProceduralItemV3`.  No schema migration or new hydration paths required.

---

## Decided / Open Items

### Resolved
- **Item Breakdown** ✅ — Procedural items break down into per-material charge.  Meter fills → 1 fragment.  Charge persists across runs.  Improved by `FORGE_BREAKDOWN_EFFICIENCY` Nexus upgrade (+20%/tier, 5 tiers) and future Research system (+15%/tier).  Config in `GAME_CONFIG.forge.breakdown`.
- **Gold-buy gating** ✅ — `goldBuyEnabled: false` at MVP — Buy tab hidden entirely.  Flip to `true` when Temple ships; `goldPrices` map is ready.  Materials at `celestial`+ are permanently stash-only (`null` price).
- **Rarity cap** ✅ — No hard cap.  Exponential alkahest curve (`elevationBase: 1.8`) self-regulates.  +15 tiers costs ~27k alkahest.
- **Fragment scrapping** ✅ — Fragments convert to alkahest at the same `items.alkahestConversionRate` applied against `baseFragmentValue × material.valueMultiplier`.
- **Forge progression** ✅ — No separate Forge level system.  Modifier slots and gold-buy paths are Temple-gated future features.
- **Modifier slots at launch** ✅ — 0 slots, not shown in MVP UI.  Temple unlocks them later (cap: 2).
- **Materials as loot** ✅ — Fragment drops are in scope alongside the Forge MVP (see [MATERIAL_FRAGMENTS.md](./MATERIAL_FRAGMENTS.md)).

### Still open
- **Temple system** — Not yet designed.  Needs its own design doc covering: upgrade tree structure, currency, which upgrades unlock Forge gold-buy per tier and modifier slots, and any other Forge-adjacent unlocks.
- **Set / Unique item forging** — Eventually allow crafting set or unique items using a blueprint as the mold.  Out of scope for MVP.
- **Teleport crystal forging** — Fits naturally as a consumable recipe tab in the Forge.  Scope for a later sprint.
