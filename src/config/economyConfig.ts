import type { ItemSlot, ItemRarity } from '@/types'

export const ITEMS_CONFIG = {
  alkahestConversionRate: 0.35, // 35% of item value converted to alkahest when discarded
} as const

export const BANK_CONFIG = {
  startingSlots: 20, // Initial number of bank slots
  costPerSlot: 500, // Gold cost per slot when expanding
} as const

export const SHIFTY_GUY_CONFIG = {
  enabled: true,
  // Gold fee charged by the Shifty Guy as a fraction of selected items' total gold value
  goldCostPercent: 0.08, // 8% – "modest gold fee"
  // Fraction of the normal manual-discard alkahest you actually receive (Shifty Guy takes a cut)
  alkahestReturnPercent: 0.75, // 75% of what manual discarding would give
  // Item types eligible for the deal. Only these types will ever be offered.
  allowedItemTypes: ['weapon', 'armor', 'helmet', 'boots', 'accessory1', 'accessory2'] as ItemSlot[],
  // Default rarity threshold shown in the UI when the modal first opens.
  // Items AT or BELOW this rarity are pre-selected for scrapping.
  defaultRarityThreshold: 'common' as ItemRarity,
  // Default toggle states
  defaultIncludeUnique: false, // Unique items excluded by default
  defaultIncludeSet: false,    // Set items excluded by default
  defaultIncludeMods: false,   // Modded items excluded by default
} as const
