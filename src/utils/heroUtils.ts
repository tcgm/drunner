import type { Hero, HeroClass, Stats } from '@/types'
import { v4 as uuidv4 } from 'uuid'

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
    magicPower: baseStats.magicPower ? baseStats.magicPower + levelBonus : undefined,
  }
  
  return {
    id: uuidv4(),
    name,
    class: heroClass,
    level,
    xp: 0,
    stats,
    equipment: {
      weapon: null,
      armor: null,
      helmet: null,
      boots: null,
      accessory1: null,
      accessory2: null,
    },
    abilities: [...heroClass.abilities],
    isAlive: true,
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
    const statIncrease = levelGain * 5
    
    return {
      ...hero,
      level: newLevel,
      xp: remainingXp,
      stats: {
        ...hero.stats,
        maxHp: calculateMaxHp(newLevel, hero.class.baseStats.defense),
        attack: hero.stats.attack + statIncrease,
        defense: hero.stats.defense + statIncrease,
        speed: hero.stats.speed + statIncrease,
        luck: hero.stats.luck + statIncrease,
        magicPower: hero.stats.magicPower ? hero.stats.magicPower + statIncrease : undefined,
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
  return {
    ...hero,
    stats: {
      ...hero.stats,
      hp: Math.min(hero.stats.hp + amount, hero.stats.maxHp),
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
