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
  2: { description: 'Magical Affinity (2 pieces): +3 Magic Power, +2 Wisdom per piece', stats: { magicPower: 3, wisdom: 2 } },
  4: { description: 'Arcane Mastery (4 pieces): +5 Magic Power, +3 Wisdom, +2 Charisma per piece', stats: { magicPower: 5, wisdom: 3, charisma: 2 } },
  6: { description: 'Supreme Sorcery (Full Set): +8 Magic Power, +5 Wisdom, +4 Charisma, +2 Speed per piece', stats: { magicPower: 8, wisdom: 5, charisma: 4, speed: 2 } },
}

/**
 * TRIGGERED Set-wide unique effect - applies when ANY Arcane piece rolls as unique
 * Individual pieces can override by defining uniqueEffect in their item definition
 */
export const ARCANE_SET_UNIQUE_EFFECT: UniqueEffectDefinition = {
  triggers: ['onCombatStart'],
  description: (m) => `Arcane Surge: 25% chance to gain +${Math.floor(80 * m)}% Magic Power for the battle`,
  handler: (context) => {
    const { party, sourceHero, effectMultiplier = 1.0 } = context
    
    if (!sourceHero || !sourceHero.isAlive) {
      return null
    }
    
    // 25% chance to trigger
    if (Math.random() > 0.25) {
      return null
    }
    
    // Apply magic power surge (temporary for combat)
    const baseMagicPower = sourceHero.stats.magicPower ?? 0
    const magicBoost = Math.floor(baseMagicPower * 0.8 * effectMultiplier)
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
