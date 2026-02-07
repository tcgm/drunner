import type { Consumable, ItemRarity } from '@/types'
import type { ConsumableV3 } from '@/types/items-v3'
import { v4 as uuidv4 } from 'uuid'
import { hydrateItem } from '@/utils/itemHydration'
import { 
  ALL_CONSUMABLE_BASES, 
  getConsumableBaseById, 
  getRandomConsumableBase, 
  getRandomPotionBase,
  type ConsumableBase,
  ALL_POTION_BASES 
} from '../../data/consumables/bases'
import { ALL_FOOD_BASES } from '../../data/consumables/food'
import { ALL_SUPPLY_BASES } from '../../data/consumables/supplies'
import { ALL_SIZES, getSizeById, getRandomSize, type ConsumableSize } from '../../data/consumables/sizes'
import { ALL_POTENCIES, getPotencyById, getRandomPotency, type ConsumablePotency } from '../../data/consumables/potencies'
import { getRarityConfig } from '@/systems/rarity/raritySystem'

/**
 * Determine consumable type from base
 */
function getConsumableType(base: ConsumableBase): 'potion' | 'food' | 'supply' {
  if (ALL_FOOD_BASES.includes(base)) return 'food'
  if (ALL_SUPPLY_BASES.includes(base)) return 'supply'
  return 'potion'
}

/**
 * Generate a consumable by combining base + size + potency + rarity
 * Returns V3 format - stores only IDs, derives everything at hydration
 */
export function generateConsumable(
  baseId?: string,
  sizeId?: string,
  potencyId?: string,
  rarity?: ItemRarity,
  floor?: number
): Consumable {
  // Select base
  let base: ConsumableBase = baseId 
    ? getConsumableBaseById(baseId) || getRandomConsumableBase()
    : getRandomConsumableBase()
  
  // Phoenix Down can only be rare or higher
  if (base.id === 'phoenix-down' && rarity && !['rare', 'epic', 'legendary', 'mythic'].includes(rarity)) {
    // Re-roll to a different base if rarity is too low
    // Use ALL_POTION_BASES if the original base was a potion, otherwise use ALL_CONSUMABLE_BASES
    const isPotionBase = ALL_POTION_BASES.some(b => b.id === base.id)
    const alternativeBases = isPotionBase
      ? ALL_POTION_BASES.filter(b => b.id !== 'phoenix-down')
      : ALL_CONSUMABLE_BASES.filter(b => b.id !== 'phoenix-down')
    base = alternativeBases[Math.floor(Math.random() * alternativeBases.length)]
  }
  
  // Select size
  const size: ConsumableSize = sizeId
    ? getSizeById(sizeId) || getRandomSize()
    : getRandomSize()
  
  // Select potency
  const potency: ConsumablePotency = potencyId
    ? getPotencyById(potencyId) || getRandomPotency()
    : getRandomPotency()
  
  // Select rarity (default to common if not specified)
  const finalRarity: ItemRarity = rarity || 'common'
  
  // Create V3 consumable - store only IDs
  const v3Item: ConsumableV3 = {
    version: 3,
    id: uuidv4(),
    itemType: 'consumable',
    baseId: base.id,
    sizeId: size.id,
    potencyId: potency.id,
    rarity: finalRarity,
    stackCount: 1
  }

  // Hydrate and return as Consumable
  return hydrateItem(v3Item) as Consumable
}

/**
 * Generate consumable based on floor depth (affects size, potency, and rarity)
 */
export function generateConsumableForFloor(floor: number, baseId?: string): Consumable {
  // Higher floors give better sizes
  let size: ConsumableSize
  
  if (floor >= 80) {
    size = ALL_SIZES[Math.floor(Math.random() * 2) + 4] // greater or superior
  } else if (floor >= 50) {
    size = ALL_SIZES[Math.floor(Math.random() * 3) + 3] // large, greater, or superior
  } else if (floor >= 25) {
    size = ALL_SIZES[Math.floor(Math.random() * 3) + 2] // medium, large, or greater
  } else if (floor >= 10) {
    size = ALL_SIZES[Math.floor(Math.random() * 2) + 1] // small or medium
  } else {
    size = ALL_SIZES[Math.floor(Math.random() * 2)] // tiny or small
  }
  
  // Higher floors give better potencies
  let potency: ConsumablePotency
  
  if (floor >= 70) {
    potency = ALL_POTENCIES[Math.floor(Math.random() * 3) + 4] // potent, concentrated, or pure
  } else if (floor >= 40) {
    potency = ALL_POTENCIES[Math.floor(Math.random() * 3) + 3] // strong, potent, or concentrated
  } else if (floor >= 20) {
    potency = ALL_POTENCIES[Math.floor(Math.random() * 2) + 2] // normal or strong
  } else if (floor >= 5) {
    potency = ALL_POTENCIES[Math.floor(Math.random() * 2) + 1] // weak or normal
  } else {
    potency = ALL_POTENCIES[Math.floor(Math.random() * 2)] // diluted or weak
  }
  
  // Rarity chance based on floor
  let rarity: ItemRarity = 'common'
  const rarityRoll = Math.random()
  
  if (floor >= 60 && rarityRoll < 0.05) rarity = 'legendary'
  else if (floor >= 40 && rarityRoll < 0.15) rarity = 'epic'
  else if (floor >= 20 && rarityRoll < 0.3) rarity = 'rare'
  else if (floor >= 10 && rarityRoll < 0.5) rarity = 'uncommon'
  
  return generateConsumable(baseId, size.id, potency.id, rarity, floor)
}

/**
 * Generate potion specifically for shop (only uses potion bases, excludes food/supplies)
 */
export function generatePotionForFloor(floor: number, baseId?: string): Consumable {
  // Use the same logic as generateConsumableForFloor, but force potion base if not specified
  let size: ConsumableSize
  
  if (floor >= 80) {
    size = ALL_SIZES[Math.floor(Math.random() * 2) + 4] // greater or superior
  } else if (floor >= 50) {
    size = ALL_SIZES[Math.floor(Math.random() * 3) + 3] // large, greater, or superior
  } else if (floor >= 25) {
    size = ALL_SIZES[Math.floor(Math.random() * 3) + 2] // medium, large, or greater
  } else if (floor >= 10) {
    size = ALL_SIZES[Math.floor(Math.random() * 2) + 1] // small or medium
  } else {
    size = ALL_SIZES[Math.floor(Math.random() * 2)] // tiny or small
  }
  
  // Higher floors give better potencies
  let potency: ConsumablePotency
  
  if (floor >= 70) {
    potency = ALL_POTENCIES[Math.floor(Math.random() * 3) + 4] // potent, concentrated, or pure
  } else if (floor >= 40) {
    potency = ALL_POTENCIES[Math.floor(Math.random() * 3) + 3] // strong, potent, or concentrated
  } else if (floor >= 20) {
    potency = ALL_POTENCIES[Math.floor(Math.random() * 2) + 2] // normal or strong
  } else if (floor >= 5) {
    potency = ALL_POTENCIES[Math.floor(Math.random() * 2) + 1] // weak or normal
  } else {
    potency = ALL_POTENCIES[Math.floor(Math.random() * 2)] // diluted or weak
  }
  
  // Rarity chance based on floor
  let rarity: ItemRarity = 'common'
  const rarityRoll = Math.random()
  
  if (floor >= 60 && rarityRoll < 0.05) rarity = 'legendary'
  else if (floor >= 40 && rarityRoll < 0.15) rarity = 'epic'
  else if (floor >= 20 && rarityRoll < 0.3) rarity = 'rare'
  else if (floor >= 10 && rarityRoll < 0.5) rarity = 'uncommon'
  
  // If no baseId specified, pick a random potion base (not food/supply)
  const finalBaseId = baseId || getRandomPotionBase().id
  
  return generateConsumable(finalBaseId, size.id, potency.id, rarity, floor)
}
