/**
 * Shadow Set - Effects System
 * 
 * Contains:
 * 1. SET_BONUSES - Passive stat boosts for equipping multiple pieces (2, 4, 6 pieces)
 * 2. SET_UNIQUE_EFFECT - Triggered effect when ANY Shadow piece rolls as unique (15% chance)
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
export const SHADOW_SET_BONUSES: Record<number, SetBonus> = {
  2: { description: 'Shadow Step (2 pieces): +30 Speed, +20 Luck', stats: { speed: 30, luck: 20 } },
  4: { description: 'Veil of Night (4 pieces): +60 Speed, +40 Luck, +40 Attack', stats: { speed: 60, luck: 40, attack: 40 } },
  6: { description: 'Master Assassin (Full Set): +100 Speed, +80 Luck, +80 Attack, +30 Wisdom', stats: { speed: 100, luck: 80, attack: 80, wisdom: 30 } },
}

/**
 * TRIGGERED Set-wide unique effect - applies when ANY Shadow piece rolls as unique
 * Individual pieces can override by defining uniqueEffect in their item definition
 */
export const SHADOW_SET_UNIQUE_EFFECT: UniqueEffectDefinition = {
  triggers: ['onCombatStart'],
  description: 'Assassin\'s Mark: 35% chance to gain +100% Luck and guaranteed critical strikes for the first attack',
  handler: (context) => {
    const { party, sourceHero } = context
    
    if (!sourceHero || !sourceHero.isAlive) {
      return null
    }
    
    // 35% chance to trigger
    if (Math.random() > 0.35) {
      return null
    }
    
    // Double luck for the battle
    const luckBoost = sourceHero.stats.luck
    sourceHero.stats.luck += luckBoost
    
    return {
      party,
      message: `${sourceHero.name} marks their target from the shadows! (+${luckBoost} Luck)`,
      additionalEffects: [{
        type: 'status',
        target: [sourceHero.id],
        description: `${sourceHero.name}'s first strike will be devastating! (${luckBoost} bonus Luck)`
      }]
    }
  }
}
