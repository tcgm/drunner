/**
 * Titan Set - Effects System
 * 
 * Contains:
 * 1. SET_BONUSES - Passive stat boosts for equipping multiple pieces (2, 4, 6 pieces)
 * 2. SET_UNIQUE_EFFECT - Triggered effect when ANY Titan piece rolls as unique (15% chance)
 * 
 * NOTE: Individual set pieces can override SET_UNIQUE_EFFECT by defining their own
 * `uniqueEffect` property directly in their respective item files (e.g., weapon.ts).
 * See kitsune/weapon.ts for an example.
 */

import type { UniqueEffectDefinition } from '@/systems/items/uniqueEffects'
import type { SetBonus } from '@/data/items/sets'

/**
 * PASSIVE Set Bonuses - stat boosts for equipping multiple pieces (always active)
 */
export const TITAN_SET_BONUSES: Record<number, SetBonus> = {
  2: { description: 'Titan Strength (2 pieces): +40 Attack, +30 Defense', stats: { attack: 40, defense: 30 } },
  4: { description: 'Titan Fortitude (4 pieces): +80 Attack, +60 Defense, +80 HP', stats: { attack: 80, defense: 60, maxHp: 80 } },
  6: { description: 'Primordial Might (Full Set): +140 Attack, +100 Defense, +150 HP', stats: { attack: 140, defense: 100, maxHp: 150 } },
}

/**
 * TRIGGERED Set-wide unique effect - applies when ANY Titan piece rolls as unique
 * Individual pieces can override by defining uniqueEffect in their item definition
 */
export const TITAN_SET_UNIQUE_EFFECT: UniqueEffectDefinition = {
  triggers: ['onDamageTaken'],
  description: 'Titan Endurance: 20% chance to reduce incoming damage by 50%',
  handler: (context) => {
    const { party, sourceHero, damageAmount } = context
    
    if (!sourceHero || !sourceHero.isAlive || !damageAmount) {
      return null
    }
    
    // 20% chance to trigger
    if (Math.random() > 0.2) {
      return null
    }
    
    const damageReduction = Math.floor(damageAmount * 0.5)
    
    return {
      party,
      message: `${sourceHero.name}'s Titan Endurance reduces damage by ${damageReduction}!`,
      additionalEffects: [{
        type: 'status',
        target: [sourceHero.id],
        description: `Titan Endurance blocks ${damageReduction} damage!`
      }]
    }
  }
}
