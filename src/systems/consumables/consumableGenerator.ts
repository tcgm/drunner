import type { Consumable, ItemRarity } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { ALL_CONSUMABLE_BASES, getConsumableBaseById, getRandomConsumableBase, type ConsumableBase } from '../../data/consumables/bases'
import { ALL_SIZES, getSizeById, getRandomSize, type ConsumableSize } from '../../data/consumables/sizes'
import { ALL_POTENCIES, getPotencyById, getRandomPotency, type ConsumablePotency } from '../../data/consumables/potencies'
import { getRarityConfig } from '@/systems/rarity/raritySystem'

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
  
  // Calculate final values: base × floor × size × potency × rarity
  const effectValue = Math.floor(base.baseValue * floorMultiplier * size.multiplier * potency.multiplier * rarityMultiplier)
  const value = Math.floor(base.baseGoldValue * floorMultiplier * size.valueMultiplier * potency.valueMultiplier * rarityMultiplier)
  
  // Generate name (potency and size prefixes, with rarity if not common)
  const rarityPrefix = finalRarity !== 'common' ? `${rarityConfig.name} ` : ''
  const potencyPrefix = potency.prefix ? `${potency.prefix} ` : ''
  const name = `${rarityPrefix}${potencyPrefix}${size.prefix} ${base.name} Potion`
  
  // Generate description
  const effectDesc = base.effectType === 'heal' 
    ? `Restores ${effectValue} HP`
    : base.effectType === 'revive'
      ? `Resurrects a fallen hero with ${effectValue} HP`
      : base.effectType === 'buff'
        ? `Increases ${base.stat} by ${effectValue} for ${base.duration} floors`
        : base.description
  const qualityDesc = potency.id !== 'normal' ? `, ${potency.name.toLowerCase()} concentration` : ''
  const description = `${effectDesc}. ${size.name} size${qualityDesc}, ${finalRarity} quality.`
  
  return {
    id: uuidv4(),
    name,
    description,
    type: 'consumable',
    rarity: finalRarity,
    stats: {},
    value,
    icon: base.icon,
    consumableType: 'potion',
    effect: {
      type: base.effectType,
      value: effectValue,
      stat: base.stat,
      duration: base.duration,
      target: base.target,
    },
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
