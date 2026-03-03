/**
 * Bunny Set - Effects System
 * 
 * Contains:
 * 1. SET_BONUSES - Passive stat boosts for equipping multiple pieces (2, 4, 6 pieces)
 * 2. SET_UNIQUE_EFFECT - Triggered effect when ANY Bunny piece rolls as unique
 */

import type { UniqueEffectDefinition } from '@/systems/items/uniqueEffects'
import type { SetBonus } from '@/data/items/sets'

/**
 * PASSIVE Set Bonuses - stat boosts for equipping multiple pieces (always active)
 */
export const BUNNY_SET_BONUSES: Record<number, SetBonus> = {
  2: { 
    description: 'Showgirl Charm (2 pieces): +20 Charisma, +10 Speed per piece', 
    stats: { charisma: 20, speed: 10 } 
  },
  4: { 
    description: 'Casino Darling (4 pieces): +30 Charisma, +20 Speed, +10 Luck per piece', 
    stats: { charisma: 30, speed: 20, luck: 10 } 
  },
  6: { 
    description: 'Irresistible Allure (Full Set): +50 Charisma, +40 Speed, +30 Luck, +20 Defense per piece', 
    stats: { charisma: 50, speed: 40, luck: 30, defense: 20 } 
  },
}

/**
 * TRIGGERED Set-wide unique effect - applies when ANY Bunny piece rolls as unique
 */
export const BUNNY_SET_UNIQUE_EFFECT: UniqueEffectDefinition = {
  triggers: ['onCombatStart'],
  description: (m) => `Captivating Presence: 25% chance to gain +${Math.floor(50 * m)}% Charisma for the battle`,
  handler: (context) => {
    const { party, sourceHero, effectMultiplier = 1.0 } = context
    
    if (!sourceHero || !sourceHero.isAlive) {
      return null
    }
    
    // 25% chance to trigger
    if (Math.random() > 0.25) {
      return null
    }
    
    // Apply charisma boost (temporary for combat)
    const charismaBoost = Math.floor(sourceHero.stats.charisma * 0.5 * effectMultiplier)
    sourceHero.stats.charisma += charismaBoost
    
    return {
      party,
      message: `${sourceHero.name}'s captivating presence dazzles everyone! (+${charismaBoost} Charisma)`,
    }
  }
}
