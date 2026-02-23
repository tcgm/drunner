/**
 * Draconic Set - Effects System
 * 
 * Contains:
 * 1. SET_BONUSES - Passive stat boosts for equipping multiple pieces (2, 4, 6 pieces)
 * 2. SET_UNIQUE_EFFECT - Triggered effect when ANY Draconic piece rolls as unique (15% chance)
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
export const DRACONIC_SET_BONUSES: Record<number, SetBonus> = {
  2: { description: 'Dragon Blood (2 pieces): +5 HP, +1 Defense per piece', stats: { maxHp: 5, defense: 1 } },
  4: { description: 'Dragon Might (4 pieces): +9 HP, +2 Defense, +3 Attack per piece', stats: { maxHp: 9, defense: 2, attack: 3 } },
  6: { description: 'Ancient Dragon (Full Set): +14 HP, +4 Defense, +5 Attack, +3 Magic Power per piece', stats: { maxHp: 14, defense: 4, attack: 5, magicPower: 3 } },
}

/**
 * TRIGGERED Set-wide unique effect - applies when ANY Draconic piece rolls as unique
 * Individual pieces can override by defining uniqueEffect in their item definition
 */
export const DRACONIC_SET_UNIQUE_EFFECT: UniqueEffectDefinition = {
  triggers: ['onDamageTaken'],
  description: (m) => `Dragon's Wrath: 30% chance to retaliate with ${m > 1 ? 'amplified ' : ''}fire damage (50% ATK + 30% Magic Power × ${m.toFixed(1)}×) when hit`,
  handler: (context) => {
    const { party, sourceHero, damageAmount, effectMultiplier = 1.0 } = context
    
    if (!sourceHero || !sourceHero.isAlive || !damageAmount) {
      return null
    }
    
    // 30% chance to trigger
    if (Math.random() > 0.3) {
      return null
    }
    
    // Retaliation damage scales with attack and magic power
    const baseMagicPower = sourceHero.stats.magicPower ?? 0
    const retaliationDamage = Math.floor(((sourceHero.stats.attack * 0.5) + (baseMagicPower * 0.3)) * effectMultiplier)
    
    return {
      party,
      message: `${sourceHero.name}'s Dragon's Wrath retaliates with ${retaliationDamage} fire damage!`,
      additionalEffects: [{
        type: 'damage',
        target: ['enemy'], // Targets the attacker
        amount: retaliationDamage,
        description: `Dragon fire burns the attacker for ${retaliationDamage} damage!`
      }]
    }
  }
}
