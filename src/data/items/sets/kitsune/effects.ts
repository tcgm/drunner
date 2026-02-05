/**
 * Kitsune Set - Effects System
 * 
 * Contains:
 * 1. SET_BONUSES - Passive stat boosts for equipping multiple pieces (2, 4, 6 pieces)
 * 2. SET_UNIQUE_EFFECT - Triggered effect when ANY Kitsune piece rolls as unique (15% chance)
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
export const KITSUNE_SET_BONUSES: Record<number, SetBonus> = {
  2: { description: 'Fox Spirit (2 pieces): +10 Speed, +5 Luck', stats: { speed: 10, luck: 5 } },
  4: { description: 'Fox Cunning (4 pieces): +20 Speed, +15 Luck, +20 Magic Power', stats: { speed: 20, luck: 15, magicPower: 20 } },
  6: { description: 'Nine-Tailed Power (Full Set): +40 Speed, +30 Luck, +50 Magic Power, +30 Attack', stats: { speed: 40, luck: 30, magicPower: 50, attack: 30 } },
}

/**
 * TRIGGERED Set-wide unique effect - applies when ANY Kitsune piece rolls as unique
 * Individual pieces can override by defining uniqueEffect in their item definition
 */
export const KITSUNE_SET_UNIQUE_EFFECT: UniqueEffectDefinition = {
  triggers: ['onCombatStart'],
  description: 'Fox Spirit: 20% chance to gain +50% Speed for the battle',
  handler: (context) => {
    const { party, sourceHero } = context
    
    if (!sourceHero || !sourceHero.isAlive) {
      return null
    }
    
    // 20% chance to trigger
    if (Math.random() > 0.2) {
      return null
    }
    
    // Apply speed boost (temporary for combat)
    const speedBoost = Math.floor(sourceHero.stats.speed * 0.5)
    sourceHero.stats.speed += speedBoost
    
    return {
      party,
      message: `${sourceHero.name}'s Fox Spirit awakens! (+${speedBoost} Speed)`,
      additionalEffects: [{
        type: 'status',
        target: [sourceHero.id],
        description: `Fox Spirit grants ${sourceHero.name} ${speedBoost} bonus Speed!`
      }]
    }
  }
}
