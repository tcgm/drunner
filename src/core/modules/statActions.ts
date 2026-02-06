/**
 * Stat actions module
 * Handles stat recalculation, migration, and death penalty calculations
 */

import type { Hero } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { calculateMaxHp } from '@/utils/heroUtils'
import { sanitizeHeroStats } from './middleware'

/**
 * Apply death penalty to a party of heroes
 */
export function applyPenaltyToParty(party: (Hero | null)[]): (Hero | null)[] {
  console.log('applyPenaltyToParty called with party:', party.map(h => h ? { name: h.name, level: h.level } : null))

  return party.map(hero => {
    if (!hero) return null

    const newHero = { ...hero }

    switch (GAME_CONFIG.deathPenalty.type) {
      case 'halve-levels':
        // Halve level (min 1)
        {
          const oldLevel = hero.level
          newHero.level = Math.max(1, Math.floor(hero.level / 2))
          console.log(`Halving level for ${hero.name}: ${oldLevel} → ${newHero.level}`)
          newHero.xp = 0
          // Recalculate stats based on new level using class-specific stat gains
          const levelDifference = hero.level - newHero.level
          const gains = hero.class.statGains
          newHero.stats = { ...hero.stats }
          newHero.stats.attack = Math.max(hero.class.baseStats.attack, hero.stats.attack - (levelDifference * gains.attack))
          newHero.stats.defense = Math.max(hero.class.baseStats.defense, hero.stats.defense - (levelDifference * gains.defense))
          newHero.stats.speed = Math.max(hero.class.baseStats.speed, hero.stats.speed - (levelDifference * gains.speed))
          newHero.stats.luck = Math.max(hero.class.baseStats.luck, hero.stats.luck - (levelDifference * gains.luck))
          newHero.stats.wisdom = Math.max(hero.class.baseStats.wisdom, hero.stats.wisdom - (levelDifference * gains.wisdom))
          newHero.stats.charisma = Math.max(hero.class.baseStats.charisma, hero.stats.charisma - (levelDifference * gains.charisma))
          if (gains.magicPower !== undefined && hero.stats.magicPower !== undefined) {
            newHero.stats.magicPower = Math.max(hero.class.baseStats.magicPower || 0, hero.stats.magicPower - (levelDifference * gains.magicPower))
          }
          newHero.stats.maxHp = calculateMaxHp(newHero.level, hero.class.baseStats.defense)
          newHero.stats.hp = newHero.stats.maxHp
          newHero.isAlive = true // Revive on penalty
          break
        }

      case 'reset-levels':
        // Reset to level 1
        newHero.level = 1
        newHero.xp = 0
        newHero.stats = {
          hp: calculateMaxHp(1, hero.class.baseStats.defense),
          maxHp: calculateMaxHp(1, hero.class.baseStats.defense),
          attack: hero.class.baseStats.attack,
          defense: hero.class.baseStats.defense,
          speed: hero.class.baseStats.speed,
          luck: hero.class.baseStats.luck,
          magicPower: hero.class.baseStats.magicPower,
          wisdom: hero.class.baseStats.wisdom || 0,
          charisma: hero.class.baseStats.charisma || 0,
        }
        break

      case 'lose-equipment':
        // Keep levels but reset equipment
        newHero.equipment = {
          weapon: null,
          armor: null,
          helmet: null,
          boots: null,
          accessory1: null,
          accessory2: null,
        }
        newHero.stats = { ...hero.stats }
        newHero.stats.hp = newHero.stats.maxHp
        break

      case 'none':
      default:
        // Just revive with full HP
        newHero.stats = { ...hero.stats }
        newHero.stats.hp = newHero.stats.maxHp
        break
    }

    newHero.isAlive = true
    return sanitizeHeroStats(newHero)
  })
}
