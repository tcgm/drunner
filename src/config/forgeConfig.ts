import type { ItemSlot, ItemRarity } from '@/types'

export const FORGE_CONFIG = {
  // MVP flags
  goldBuyEnabled: false,        // gold-buy tab hidden until Temple system ships
  respectFloorGate: true,       // rarity targets above deepest-floor-reached are greyed out
  baseModifierSlots: 0,         // modifier slots visible at launch (0 = hidden in MVP)
  maxModifierSlots: 2,          // hard cap once Temple unlocks them (future)
  modifierSlotCost: 50,         // extra alkahest per filled modifier slot
  baseCost: 25,                 // flat alkahest cost at native-rarity (no elevation)
  stashCostMultiplier: 0.85,    // 15% discount when material comes from stash

  // Rarity elevation formula: baseCost * elevationBase^steps  (steps = tiers above native)
  elevation: {
    elevationBase: 1.8,
  },

  // Material fragment drops (secondary roll alongside normal item drops)
  materialFragment: {
    baseChance: 0.15,
    chestBonus: 0.20,           // additive bonus for chest sources → 35% total
    bossDropGuaranteed: true,
    bossDropQuantity: 2,
    maxPerDrop: 1,
    maxPerChestDrop: 2,
    autoMergeOnReturn: false,
    scrappedAlkahestRate: 1.0,  // multiplier vs normal item alkahest rate (1.0 = same)
    baseFragmentValue: 40,      // base gold value for alkahest conversion
    excludedFromDrops: [
      'narrative', 'author', 'plane', 'layer', 'elder',
      'void', 'singularity', 'structural', 'realityAnchor',
    ] as const,
  },

  // Item breakdown - feeds items into per-material charge meters
  breakdown: {
    enabled: true,
    // Item types eligible for breakdown. Only these types will appear in the Break Down tab.
    allowedItemTypes: ['weapon', 'armor', 'helmet', 'boots', 'accessory1', 'accessory2'] as ItemSlot[],
    carryOverExcess: true,              // leftover charge rolls into next cycle
    uniqueBreakdownMultiplier: 1.5,
    setBreakdownMultiplier: 1.3,
    nexusUpgradeId: 'forge_breakdown_efficiency',
    nexusChargeBonus: 0.20,             // +20% charge per nexus tier
    researchUpgradeId: 'FORGE_BREAKDOWN_RESEARCH',
    researchChargeBonus: 0.15,          // +15% per research tier (future)

    // Charge contributed per item rarity (flat per item)
    chargePerRarity: {
      junk:          5,
      abundant:      8,
      common:        10,
      uncommon:      20,
      rare:          40,
      veryRare:      80,
      magical:       160,
      elite:         240,
      epic:          400,
      legendary:     800,
      mythic:        1_600,
      mythicc:       3_200,
      artifact:      6_400,
      divine:        12_800,
      celestial:     25_600,
      realityAnchor: 51_200,
      structural:    102_400,
      singularity:   204_800,
      void:          409_600,
      elder:         819_200,
      layer:         1_638_400,
      plane:         3_276_800,
      author:        6_553_600,
    } as Partial<Record<ItemRarity, number>>,

    // Charge needed to earn 1 fragment (scales with material rarity)
    thresholdByRarity: {
      junk:          50,
      abundant:      75,
      common:        100,
      uncommon:      200,
      rare:          400,
      veryRare:      800,
      magical:       1_600,
      elite:         3_200,
      epic:          8_000,
      legendary:     20_000,
      mythic:        50_000,
      mythicc:       100_000,
      artifact:      200_000,
      divine:        400_000,
      celestial:     800_000,
      realityAnchor: 1_600_000,
    } as Partial<Record<ItemRarity, number>>,
  },
} as const
