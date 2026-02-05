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
  2: { description: 'Dragon Blood (2 pieces): +50 HP, +10 Defense', stats: { maxHp: 50, defense: 10 } },
  4: { description: 'Dragon Might (4 pieces): +100 HP, +25 Defense, +30 Attack', stats: { maxHp: 100, defense: 25, attack: 30 } },
  6: { description: 'Ancient Dragon (Full Set): +200 HP, +50 Defense, +60 Attack, +40 Magic Power', stats: { maxHp: 200, defense: 50, attack: 60, magicPower: 40 } },
}

/**
 * TRIGGERED Set-wide unique effect - applies when ANY Draconic piece rolls as unique
 * Individual pieces can override by defining uniqueEffect in their item definition
 */
export const DRACONIC_SET_UNIQUE_EFFECT: UniqueEffectDefinition = {
  triggers: ['onDamageTaken'],
  description: "Dragon's Wrath: 30% chance to retaliate with fire damage when hit",
  handler: (context) => {
    const { party, sourceHero, damageAmount } = context
    
    if (!sourceHero || !sourceHero.isAlive || !damageAmount) {
      return null
    }
    
    // 30% chance to trigger
    if (Math.random() > 0.3) {
      return null
    }
    
    // Retaliation damage scales with attack and magic power
    const baseMagicPower = sourceHero.stats.magicPower ?? 0
    const retaliationDamage = Math.floor((sourceHero.stats.attack * 0.5) + (baseMagicPower * 0.3))
    
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
