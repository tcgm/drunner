import type { Consumable, ItemRarity } from '@/types'
import { v4 as uuidv4 } from 'uuid'
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
    base = ALL_CONSUMABLE_BASES.filter(b => b.id !== 'phoenix-down')[Math.floor(Math.random() * (ALL_CONSUMABLE_BASES.length - 1))]
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
  const rarityConfig = getRarityConfig(finalRarity)
  const rarityMultiplier = rarityConfig.statMultiplierBase
  
  // Apply floor scaling to base value (0.5% per floor, max 3x at floor 400)
  const floorMultiplier = floor ? Math.min(1 + (floor * 0.005), 3.0) : 1.0
  
  // Calculate final values for all effects
  const scaledEffects = base.effects.map(effect => ({
    type: effect.type,
    value: Math.floor(effect.value * floorMultiplier * size.multiplier * potency.multiplier * rarityMultiplier),
    stat: effect.stat,
    duration: effect.duration,
    target: effect.target,
  }))
  
  const value = Math.floor(base.baseGoldValue * floorMultiplier * size.valueMultiplier * potency.valueMultiplier * rarityMultiplier)
  
  // Determine consumable type from base
  const consumableType = getConsumableType(base)
  
  // Generate name (potency and size prefixes, with rarity if not common)
  const rarityPrefix = finalRarity !== 'common' ? `${rarityConfig.name} ` : ''
  const potencyPrefix = potency.prefix ? `${potency.prefix} ` : ''
  const suffix = consumableType === 'potion' ? 'Potion' : ''
  const name = `${rarityPrefix}${potencyPrefix}${size.prefix} ${base.name}${suffix ? ' ' + suffix : ''}`
  
  // Generate description from effects
  const effectDescriptions = scaledEffects.map(effect => {
    if (effect.type === 'heal') {
      return `Restores ${effect.value} HP`
    } else if (effect.type === 'hot') {
      return `Restores ${effect.value} HP per event for ${effect.duration || 3} events`
    } else if (effect.type === 'revive') {
      return `Resurrects a fallen hero with ${effect.value} HP`
    } else if (effect.type === 'buff') {
      return `Increases ${effect.stat} by ${effect.value} for ${effect.duration} events`
    }
    return ''
  }).filter(Boolean).join(', then ')
  
  const qualityDesc = potency.id !== 'normal' ? `, ${potency.name.toLowerCase()} concentration` : ''
  const description = `${effectDescriptions}. ${size.name} size${qualityDesc}, ${finalRarity} quality.`
  
  return {
    id: uuidv4(),
    name,
    description,
    type: 'consumable',
    rarity: finalRarity,
    stats: {},
    value,
    icon: base.icon,
    consumableType,
    effects: scaledEffects,
    usableInCombat: base.usableInCombat,
    usableOutOfCombat: base.usableOutOfCombat,
    stackable: true,
    stackCount: 1,
    // Store generation metadata
    baseId: base.id,
    sizeId: size.id,
    potencyId: potency.id,
  }
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
