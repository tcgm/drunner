import type { Hero, Stats, Item } from '@/types'
import { calculateEffectModifiers } from '@/systems/effects'
import { getItemSetName, getSetBonuses } from '@data/items/sets'
import { MATERIALS_BY_RARITY } from '@data/items/materials'
import { getEffectMultiplier } from '@/systems/items/uniqueEffects'

/**
 * Calculate total stats for a hero including equipment and active effects
 */
export function calculateTotalStats(hero: Hero): Stats {
  const baseStats = { ...hero.stats }
  
  // Add equipment bonuses
  const equipmentStats = calculateEquipmentStats(hero)
  
  // Add out-of-combat timed effect modifiers (activeEffects)
  const effectModifiers = calculateEffectModifiers(hero)

  // Add in-combat buff/debuff modifiers (combatEffects)
  // Values are already signed: buffs store positive values, debuffs store negative values.
  // No sign flip needed  -  just sum them directly.
  const combatModifiers: Partial<Stats> = {}
  for (const effect of (hero.combatEffects || [])) {
    if ((effect.type === 'buff' || effect.type === 'debuff') && effect.stat && effect.value !== undefined) {
      const key = effect.stat as keyof Stats
      combatModifiers[key] = ((combatModifiers[key] as number) || 0) + effect.value
    }
  }
  
  // Combine all stat sources
  return {
    hp: baseStats.hp, // HP is not modified by equipment or effects
    maxHp: baseStats.maxHp + (equipmentStats.maxHp || 0) + (effectModifiers.maxHp || 0) + (combatModifiers.maxHp || 0),
    attack: baseStats.attack + (equipmentStats.attack || 0) + (effectModifiers.attack || 0) + (combatModifiers.attack || 0),
    defense: baseStats.defense + (equipmentStats.defense || 0) + (effectModifiers.defense || 0) + (combatModifiers.defense || 0),
    speed: baseStats.speed + (equipmentStats.speed || 0) + (effectModifiers.speed || 0) + (combatModifiers.speed || 0),
    luck: baseStats.luck + (equipmentStats.luck || 0) + (effectModifiers.luck || 0) + (combatModifiers.luck || 0),
    wisdom: baseStats.wisdom + (equipmentStats.wisdom || 0) + (effectModifiers.wisdom || 0) + (combatModifiers.wisdom || 0),
    charisma: baseStats.charisma + (equipmentStats.charisma || 0) + (effectModifiers.charisma || 0) + (combatModifiers.charisma || 0),
    magicPower: baseStats.magicPower 
      ? baseStats.magicPower + (equipmentStats.magicPower || 0) + (effectModifiers.magicPower || 0) + (combatModifiers.magicPower || 0)
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
  // 1. Named set bonuses — each equipped piece contributes the current tier's bonus
  //    scaled by that piece's own rarity multiplier (stacks across all pieces).
  const setCounts: Record<string, number> = {}
  equippedItems.forEach(item => {
    const setName = getItemSetName(item.name)
    if (setName) {
      setCounts[setName] = (setCounts[setName] || 0) + 1
    }
  })

  // Apply per-item set bonuses: each piece contributes bonus × its rarity multiplier
  equippedItems.forEach(item => {
    const setName = getItemSetName(item.name)
    if (!setName) return
    const count = setCounts[setName]
    const setBonus = getSetBonuses(setName, count)
    if (!setBonus?.stats) return
    const mult = getEffectMultiplier(item.rarity, item.isUnique ?? false)
    const s = setBonus.stats
    if (s.attack)     equipmentStats.attack     = (equipmentStats.attack     || 0) + Math.floor(s.attack     * mult)
    if (s.defense)    equipmentStats.defense    = (equipmentStats.defense    || 0) + Math.floor(s.defense    * mult)
    if (s.speed)      equipmentStats.speed      = (equipmentStats.speed      || 0) + Math.floor(s.speed      * mult)
    if (s.luck)       equipmentStats.luck       = (equipmentStats.luck       || 0) + Math.floor(s.luck       * mult)
    if (s.maxHp)      equipmentStats.maxHp      = (equipmentStats.maxHp      || 0) + Math.floor(s.maxHp      * mult)
    if (s.wisdom)     equipmentStats.wisdom     = (equipmentStats.wisdom     || 0) + Math.floor(s.wisdom     * mult)
    if (s.charisma)   equipmentStats.charisma   = (equipmentStats.charisma   || 0) + Math.floor(s.charisma   * mult)
    if (s.magicPower && equipmentStats.magicPower !== undefined) {
      equipmentStats.magicPower = (equipmentStats.magicPower || 0) + Math.floor(s.magicPower * mult)
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
