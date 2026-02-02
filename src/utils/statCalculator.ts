import type { Hero, Stats, Item } from '@/types'
import { calculateEffectModifiers } from '@/systems/effects'

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
  
  // Iterate through all slots
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
