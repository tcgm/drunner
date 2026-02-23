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
    description: 'Showgirl Charm (2 pieces): +2 Charisma, +1 Speed per piece', 
    stats: { charisma: 2, speed: 1 } 
  },
  4: { 
    description: 'Casino Darling (4 pieces): +3 Charisma, +2 Speed, +1 Luck per piece', 
    stats: { charisma: 3, speed: 2, luck: 1 } 
  },
  6: { 
    description: 'Irresistible Allure (Full Set): +5 Charisma, +4 Speed, +3 Luck, +2 Defense per piece', 
    stats: { charisma: 5, speed: 4, luck: 3, defense: 2 } 
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
