import type { Hero, HeroClass, Stats } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { getEnabledSlots } from '@/config/slotConfig'

/**
 * Calculate HP based on level and base stats
 */
export function calculateMaxHp(level: number, baseDefense: number): number {
  return 50 + (level * 10) + (baseDefense * 5)
}

/**
 * Calculate XP required for next level
 */
export function calculateXpForLevel(level: number): number {
  return level * 100
}

/**
 * Create a new hero from a class template
 */
export function createHero(heroClass: HeroClass, name: string, level: number = 1): Hero {
  const { baseStats } = heroClass
  
  // Calculate stats for the given level
  const levelBonus = (level - 1) * 5
  const maxHp = calculateMaxHp(level, baseStats.defense)
  
  const stats: Stats = {
    hp: maxHp,
    maxHp,
    attack: baseStats.attack + levelBonus,
    defense: baseStats.defense + levelBonus,
    speed: baseStats.speed + levelBonus,
    luck: baseStats.luck + levelBonus,
    wisdom: baseStats.wisdom + levelBonus,
    charisma: baseStats.charisma + levelBonus,
    magicPower: baseStats.magicPower ? baseStats.magicPower + levelBonus : undefined,
  }
  
  // Initialize all slots as empty based on slot configuration
  const slots: Record<string, null> = {}
  for (const slot of getEnabledSlots()) {
    slots[slot.id] = null
  }
  
  return {
    id: uuidv4(),
    name,
    class: heroClass,
    level,
    xp: 0,
    stats,
    slots,
    abilities: [...heroClass.abilities],
    isAlive: true,
    activeEffects: [], // No active effects initially
  }
}

/**
 * Add experience to a hero and handle leveling up
 */
export function addExperience(hero: Hero, xp: number): Hero {
  const newXp = hero.xp + xp
  let newLevel = hero.level
  let remainingXp = newXp
  
  // Check for level ups
  while (remainingXp >= calculateXpForLevel(newLevel)) {
    remainingXp -= calculateXpForLevel(newLevel)
    newLevel++
  }
  
  // If leveled up, apply stat increases
  if (newLevel > hero.level) {
    const levelGain = newLevel - hero.level
    const gains = hero.class.statGains
    
    return {
      ...hero,
      level: newLevel,
      xp: remainingXp,
      stats: {
        ...hero.stats,
        maxHp: calculateMaxHp(newLevel, hero.class.baseStats.defense),
        attack: hero.stats.attack + (levelGain * gains.attack),
        defense: hero.stats.defense + (levelGain * gains.defense),
        speed: hero.stats.speed + (levelGain * gains.speed),
        luck: hero.stats.luck + (levelGain * gains.luck),
        wisdom: hero.stats.wisdom + (levelGain * gains.wisdom),
        charisma: hero.stats.charisma + (levelGain * gains.charisma),
        magicPower: gains.magicPower !== undefined && hero.stats.magicPower !== undefined
          ? hero.stats.magicPower + (levelGain * gains.magicPower)
          : hero.stats.magicPower,
      },
    }
  }
  
  return {
    ...hero,
    xp: newXp,
  }
}

/**
 * Heal a hero
 */
export function healHero(hero: Hero, amount: number): Hero {
  // Import at top of function to avoid circular dependency issues
  const { calculateTotalStats } = require('@/utils/statCalculator')
  const effectiveMaxHp = calculateTotalStats(hero).maxHp
  return {
    ...hero,
    stats: {
      ...hero.stats,
      hp: Math.min(hero.stats.hp + amount, effectiveMaxHp),
    },
  }
}

/**
 * Damage a hero
 */
export function damageHero(hero: Hero, amount: number): Hero {
  const newHp = Math.max(0, hero.stats.hp - amount)
  
  return {
    ...hero,
    stats: {
      ...hero.stats,
      hp: newHp,
    },
    isAlive: newHp > 0,
  }
}

/**
 * Level up a hero by 1 level
 */
export function levelUpHero(hero: Hero, maxLevel: number = 20): Hero {
  if (hero.level >= maxLevel) {
    return hero
  }

  const gains = hero.class.statGains
  const newLevel = hero.level + 1

  return {
    ...hero,
    level: newLevel,
    stats: {
      ...hero.stats,
      attack: hero.stats.attack + gains.attack,
      defense: hero.stats.defense + gains.defense,
      speed: hero.stats.speed + gains.speed,
      luck: hero.stats.luck + gains.luck,
      maxHp: hero.stats.maxHp + gains.maxHp,
      wisdom: hero.stats.wisdom + gains.wisdom,
      charisma: hero.stats.charisma + gains.charisma,
      magicPower: hero.stats.magicPower !== undefined && gains.magicPower !== undefined 
        ? hero.stats.magicPower + gains.magicPower 
        : hero.stats.magicPower,
    },
  }
}
