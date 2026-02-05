/**
 * Arcane Set - Effects System
 * 
 * Contains:
 * 1. SET_BONUSES - Passive stat boosts for equipping multiple pieces (2, 4, 6 pieces)
 * 2. SET_UNIQUE_EFFECT - Triggered effect when ANY Arcane piece rolls as unique (15% chance)
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
export const ARCANE_SET_BONUSES: Record<number, SetBonus> = {
  2: { description: 'Magical Affinity (2 pieces): +30 Magic Power, +20 Wisdom', stats: { magicPower: 30, wisdom: 20 } },
  4: { description: 'Arcane Mastery (4 pieces): +60 Magic Power, +40 Wisdom, +30 Charisma', stats: { magicPower: 60, wisdom: 40, charisma: 30 } },
  6: { description: 'Supreme Sorcery (Full Set): +120 Magic Power, +80 Wisdom, +60 Charisma, +20 Speed', stats: { magicPower: 120, wisdom: 80, charisma: 60, speed: 20 } },
}

/**
 * TRIGGERED Set-wide unique effect - applies when ANY Arcane piece rolls as unique
 * Individual pieces can override by defining uniqueEffect in their item definition
 */
export const ARCANE_SET_UNIQUE_EFFECT: UniqueEffectDefinition = {
  triggers: ['onCombatStart'],
  description: 'Arcane Surge: 25% chance to gain +80% Magic Power for the battle',
  handler: (context) => {
    const { party, sourceHero } = context
    
    if (!sourceHero || !sourceHero.isAlive) {
      return null
    }
    
    // 25% chance to trigger
    if (Math.random() > 0.25) {
      return null
    }
    
    // Apply magic power surge (temporary for combat)
    const baseMagicPower = sourceHero.stats.magicPower ?? 0
    const magicBoost = Math.floor(baseMagicPower * 0.8)
    sourceHero.stats.magicPower = baseMagicPower + magicBoost
    
    return {
      party,
      message: `${sourceHero.name}'s Arcane Surge activates! (+${magicBoost} Magic Power)`,
      additionalEffects: [{
        type: 'status',
        target: [sourceHero.id],
        description: `Arcane energies surge through ${sourceHero.name}, granting ${magicBoost} bonus Magic Power!`
      }]
    }
  }
}
