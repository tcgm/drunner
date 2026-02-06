import type { Hero, Stats, Item } from '@/types'
import { calculateEffectModifiers } from '@/systems/effects'
import { getItemSetName, getSetBonuses } from '@data/items/sets'
import { MATERIALS_BY_RARITY } from '@data/items/materials'

/**
 * Calculate total stats for a hero including equipment and active effects
 */
export function calculateTotalStats(hero: Hero): Stats {
  const baseStats = { ...hero.stats }
  
  // Add equipment bonuses
  const equipmentStats = calculateEquipmentStats(hero)
  
  // Add effect modifiers
  const effectModifiers = calculateEffectModifiers(hero)
  
  // Combine all stat sources
  return {
    hp: baseStats.hp, // HP is not modified by equipment or effects
    maxHp: baseStats.maxHp + (equipmentStats.maxHp || 0) + (effectModifiers.maxHp || 0),
    attack: baseStats.attack + (equipmentStats.attack || 0) + (effectModifiers.attack || 0),
    defense: baseStats.defense + (equipmentStats.defense || 0) + (effectModifiers.defense || 0),
    speed: baseStats.speed + (equipmentStats.speed || 0) + (effectModifiers.speed || 0),
    luck: baseStats.luck + (equipmentStats.luck || 0) + (effectModifiers.luck || 0),
    wisdom: baseStats.wisdom + (equipmentStats.wisdom || 0) + (effectModifiers.wisdom || 0),
    charisma: baseStats.charisma + (equipmentStats.charisma || 0) + (effectModifiers.charisma || 0),
    magicPower: baseStats.magicPower 
      ? baseStats.magicPower + (equipmentStats.magicPower || 0) + (effectModifiers.magicPower || 0)
      : undefined,
  }
}

/**
 * Calculate stats provided by all equipped items
 */
export function calculateEquipmentStats(hero: Hero): Partial<Stats> {
  const equipmentStats: Partial<Stats> = {}
  
  // Track equipped items for set bonus detection
  const equippedItems = Object.values(hero.slots)
    .filter(item => item !== null && 'stats' in item) as Item[]

  // Iterate through all slots and sum base item stats
  for (const [slotId, item] of Object.entries(hero.slots)) {
    // Only process items (not consumables) with stats
    if (item && 'stats' in item && item.stats) {
      for (const [stat, value] of Object.entries(item.stats)) {
        if (value !== undefined) {
          const key = stat as keyof Stats
          equipmentStats[key] = (equipmentStats[key] || 0) + value
        }
      }
    }
  }
  
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
      if (setBonus.stats.attack) equipmentStats.attack = (equipmentStats.attack || 0) + setBonus.stats.attack
      if (setBonus.stats.defense) equipmentStats.defense = (equipmentStats.defense || 0) + setBonus.stats.defense
      if (setBonus.stats.speed) equipmentStats.speed = (equipmentStats.speed || 0) + setBonus.stats.speed
      if (setBonus.stats.luck) equipmentStats.luck = (equipmentStats.luck || 0) + setBonus.stats.luck
      if (setBonus.stats.maxHp) equipmentStats.maxHp = (equipmentStats.maxHp || 0) + setBonus.stats.maxHp
      if (setBonus.stats.wisdom) equipmentStats.wisdom = (equipmentStats.wisdom || 0) + setBonus.stats.wisdom
      if (setBonus.stats.charisma) equipmentStats.charisma = (equipmentStats.charisma || 0) + setBonus.stats.charisma
      if (setBonus.stats.magicPower && equipmentStats.magicPower !== undefined) {
        equipmentStats.magicPower = (equipmentStats.magicPower || 0) + setBonus.stats.magicPower
      }
    }
  })

  // 2. Material set bonus - check if 4+ items are the same material
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
      equipmentStats.defense = (equipmentStats.defense || 0) + 5
      equipmentStats.attack = (equipmentStats.attack || 0) + 5
      equipmentStats.luck = (equipmentStats.luck || 0) + 3
      break // Only apply once even if multiple material sets
    }
  }

  return equipmentStats
}

/**
 * Get a hero's effective attack stat (base + equipment + effects)
 */
export function getEffectiveAttack(hero: Hero): number {
  return calculateTotalStats(hero).attack
}

/**
 * Get a hero's effective defense stat (base + equipment + effects)
 */
export function getEffectiveDefense(hero: Hero): number {
  return calculateTotalStats(hero).defense
}

/**
 * Get a hero's effective speed stat (base + equipment + effects)
 */
export function getEffectiveSpeed(hero: Hero): number {
  return calculateTotalStats(hero).speed
}

/**
 * Get a hero's effective luck stat (base + equipment + effects)
 */
export function getEffectiveLuck(hero: Hero): number {
  return calculateTotalStats(hero).luck
}

/**
 * Get a hero's effective max HP (base + equipment + effects)
 */
export function getEffectiveMaxHp(hero: Hero): number {
  return calculateTotalStats(hero).maxHp
}

/**
 * Get formatted stat breakdown for display
 */
export function getStatBreakdown(hero: Hero): {
  stat: keyof Stats
  base: number
  equipment: number
  effects: number
  total: number
}[] {
  const baseStats = hero.stats
  const equipmentStats = calculateEquipmentStats(hero)
  const effectModifiers = calculateEffectModifiers(hero)
  const totalStats = calculateTotalStats(hero)
  
  const stats: (keyof Stats)[] = ['attack', 'defense', 'speed', 'luck', 'maxHp']
  if (hero.stats.magicPower !== undefined) {
    stats.push('magicPower')
  }
  
  return stats.map((stat) => ({
    stat,
    base: baseStats[stat] as number,
    equipment: equipmentStats[stat] || 0,
    effects: effectModifiers[stat] || 0,
    total: totalStats[stat] as number,
  }))
}
