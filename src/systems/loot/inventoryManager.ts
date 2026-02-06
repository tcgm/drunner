import type { Hero, Item } from '@/types'
import { getItemSetName, getSetBonuses } from '@data/items/sets'
import { MATERIALS_BY_RARITY } from '@data/items/materials'
import { GAME_CONFIG } from '@/config/gameConfig'
import { getSlotById } from '@/config/slotConfig'
import { slotAcceptsItemType } from '@/config/slotConfig'

/**
 * Check if a hero can equip an item in a specific slot
 */
export function canEquipItem(_hero: Hero, item: Item, slotId: string): boolean {
  return slotAcceptsItemType(slotId, item.type)
}

/**
 * Equip an item to a hero, returning the replaced item if any
 */
export function equipItem(hero: Hero, item: Item, slotId: string): { hero: Hero; replacedItem: Item | null } {
  if (!canEquipItem(hero, item, slotId)) {
    return { hero, replacedItem: null }
  }

  const updatedHero = { ...hero }
  updatedHero.slots = { ...hero.slots }
  
  // Get the item being replaced (if any)
  const replacedItem = updatedHero.slots[slotId] as Item | null
  
  // Equip new item
  updatedHero.slots[slotId] = item
  
  // Note: We don't recalculate stats here anymore.
  // Stats are calculated on-demand using calculateTotalStats which includes equipment + effects.
  // hero.stats should only contain base stats (class + level).
  
  return { hero: updatedHero, replacedItem }
}

/**
 * Unequip an item from a hero
 */
export function unequipItem(hero: Hero, slotId: string): { hero: Hero; item: Item | null } {
  const item = hero.slots[slotId] ?? null
  
  const updatedHero = { ...hero }
  updatedHero.slots = { ...hero.slots }
  updatedHero.slots[slotId] = null
  
  // Note: We don't recalculate stats here anymore.
  // Stats are calculated on-demand using calculateTotalStats which includes equipment + effects.
  // hero.stats should only contain base stats (class + level).
  
  return { hero: updatedHero, item }
}

/**
 * Calculate hero stats including equipment bonuses and set bonuses
 */
/**
 * Recalculate hero's base stats from class + level only (no equipment or effects)
 * This is what gets stored in hero.stats.
 * For total stats with equipment and effects, use calculateTotalStats from @/utils/statCalculator
 */
export function calculateStatsWithEquipment(hero: Hero) {
  // Calculate pure base stats from class + level (no equipment)
  const levelBonus = hero.level - 1
  const gains = hero.class.statGains
  const baseMaxHp = GAME_CONFIG.hero.baseHp + (hero.level * GAME_CONFIG.hero.hpPerLevel) + (hero.class.baseStats.defense * GAME_CONFIG.hero.hpPerDefense)

  const stats = {
    hp: hero.stats.hp, // Keep current HP
    maxHp: baseMaxHp,
    attack: hero.class.baseStats.attack + (levelBonus * gains.attack),
    defense: hero.class.baseStats.defense + (levelBonus * gains.defense),
    speed: hero.class.baseStats.speed + (levelBonus * gains.speed),
    luck: hero.class.baseStats.luck + (levelBonus * gains.luck),
    wisdom: hero.class.baseStats.wisdom + (levelBonus * gains.wisdom),
    charisma: hero.class.baseStats.charisma + (levelBonus * gains.charisma),
    magicPower: gains.magicPower !== undefined && hero.class.baseStats.magicPower !== undefined
      ? hero.class.baseStats.magicPower + (levelBonus * gains.magicPower)
      : undefined,
  }
  
  // Ensure HP doesn't exceed maxHp
  stats.hp = Math.min(stats.hp, stats.maxHp)
  
  return stats
}

/**
 * Sell an item for gold
 */
export function sellItem(item: Item): number {
  return item.value
}

/**
 * Determine which item is better for a slot
 */
export function getBestItemForSlot(
  currentItem: Item | null,
  newItem: Item
): Item {
  if (!currentItem) return newItem
  
  // Simple comparison: sum of all stat values
  const currentPower = Object.values(currentItem.stats || {}).reduce((sum, val) => sum + (val || 0), 0)
  const newPower = Object.values(newItem.stats || {}).reduce((sum, val) => sum + (val || 0), 0)
  
  return newPower > currentPower ? newItem : currentItem
}
