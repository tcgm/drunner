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
 * Equip an item to a hero
 */
export function equipItem(hero: Hero, item: Item, slotId: string): Hero {
  if (!canEquipItem(hero, item, slotId)) {
    return hero
  }

  const updatedHero = { ...hero }
  updatedHero.slots = { ...hero.slots }
  
  // Equip new item (old item is automatically replaced)
  updatedHero.slots[slotId] = item
  
  // Recalculate stats
  updatedHero.stats = calculateStatsWithEquipment(updatedHero)
  
  return updatedHero
}

/**
 * Unequip an item from a hero
 */
export function unequipItem(hero: Hero, slotId: string): { hero: Hero; item: Item | null } {
  const item = hero.slots[slotId] ?? null
  
  const updatedHero = { ...hero }
  updatedHero.slots = { ...hero.slots }
  updatedHero.slots[slotId] = null
  
  // Recalculate stats
  updatedHero.stats = calculateStatsWithEquipment(updatedHero)
  
  return { hero: updatedHero, item }
}

/**
 * Calculate hero stats including equipment bonuses and set bonuses
 */
export function calculateStatsWithEquipment(hero: Hero) {
  const baseStats = { ...hero.stats }
  
  // Start with base stats (without equipment)
  const levelBonus = (hero.level - 1) * GAME_CONFIG.hero.statGainPerLevel
  const stats = {
    hp: baseStats.hp, // Keep current HP
    maxHp: GAME_CONFIG.hero.baseHp + (hero.level * GAME_CONFIG.hero.hpPerLevel) + (hero.class.baseStats.defense * GAME_CONFIG.hero.hpPerDefense),
    attack: hero.class.baseStats.attack + levelBonus,
    defense: hero.class.baseStats.defense + levelBonus,
    speed: hero.class.baseStats.speed + levelBonus,
    luck: hero.class.baseStats.luck + levelBonus,
    wisdom: hero.class.baseStats.wisdom + levelBonus,
    charisma: hero.class.baseStats.charisma + levelBonus,
    magicPower: hero.class.baseStats.magicPower 
      ? hero.class.baseStats.magicPower + levelBonus 
      : undefined,
  }
  
  // Track equipped items for set bonus detection
  const equippedItems = Object.values(hero.slots)
    .filter(item => item !== null && 'stats' in item) as Item[]
  
  // Add equipment bonuses
  equippedItems.forEach(item => {
    if (item.stats) {
      if (item.stats.attack) stats.attack += item.stats.attack
      if (item.stats.defense) stats.defense += item.stats.defense
      if (item.stats.speed) stats.speed += item.stats.speed
      if (item.stats.luck) stats.luck += item.stats.luck
      if (item.stats.maxHp) stats.maxHp += item.stats.maxHp
      if (item.stats.wisdom) stats.wisdom += item.stats.wisdom
      if (item.stats.charisma) stats.charisma += item.stats.charisma
      if (item.stats.magicPower && stats.magicPower !== undefined) {
        stats.magicPower += item.stats.magicPower
      }
    }
  })
  
  // Calculate set bonuses
  // 1. Named set bonuses (e.g., Kitsune set)
  const setCounts: Record<string, number> = {}
  equippedItems.forEach(item => {
    const setName = getItemSetName(item.name)
    if (setName) {
      setCounts[setName] = (setCounts[setName] || 0) + 1
    }
  })
  
  // Apply named set bonuses
  Object.entries(setCounts).forEach(([setName, count]) => {
    const setBonus = getSetBonuses(setName, count)
    if (setBonus?.stats) {
      if (setBonus.stats.attack) stats.attack += setBonus.stats.attack
      if (setBonus.stats.defense) stats.defense += setBonus.stats.defense
      if (setBonus.stats.speed) stats.speed += setBonus.stats.speed
      if (setBonus.stats.luck) stats.luck += setBonus.stats.luck
      if (setBonus.stats.maxHp) stats.maxHp += setBonus.stats.maxHp
      if (setBonus.stats.wisdom) stats.wisdom += setBonus.stats.wisdom
      if (setBonus.stats.charisma) stats.charisma += setBonus.stats.charisma
      if (setBonus.stats.magicPower && stats.magicPower !== undefined) {
        stats.magicPower += setBonus.stats.magicPower
      }
    }
  })
  
  // 2. Material set bonus - check if all items are the same material
  const materialCounts: Record<string, number> = {}
  equippedItems.forEach(item => {
    // Extract material from item name (e.g., "Iron Sword" -> "Iron")
    const words = item.name.split(' ')
    if (words.length > 1) {
      const potentialMaterial = words[0]
      // Check if this matches any known material
      for (const materials of Object.values(MATERIALS_BY_RARITY)) {
        if (materials.some(m => m.prefix === potentialMaterial)) {
          materialCounts[potentialMaterial] = (materialCounts[potentialMaterial] || 0) + 1
          break
        }
      }
    }
  })
  
  // Apply material set bonus if 4+ pieces of same material
  for (const count of Object.values(materialCounts)) {
    if (count >= 4) {
      // Small bonus for matching material set
      stats.defense += 5
      stats.attack += 5
      stats.luck += 3
      break // Only apply once even if multiple material sets
    }
  }
  
  // Ensure HP doesn't exceed new maxHp
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
