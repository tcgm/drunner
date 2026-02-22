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
    description: 'Showgirl Charm (2 pieces): +15 Charisma, +10 Speed', 
    stats: { charisma: 15, speed: 10 } 
  },
  4: { 
    description: 'Casino Darling (4 pieces): +35 Charisma, +25 Speed, +15 Luck', 
    stats: { charisma: 35, speed: 25, luck: 15 } 
  },
  6: { 
    description: 'Irresistible Allure (Full Set): +60 Charisma, +50 Speed, +30 Luck, +20 Defense', 
    stats: { charisma: 60, speed: 50, luck: 30, defense: 20 } 
  },
}

/**
 * TRIGGERED Set-wide unique effect - applies when ANY Bunny piece rolls as unique
 */
export const BUNNY_SET_UNIQUE_EFFECT: UniqueEffectDefinition = {
  triggers: ['onCombatStart'],
  description: 'Captivating Presence: 25% chance to gain +50% Charisma for the battle',
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
