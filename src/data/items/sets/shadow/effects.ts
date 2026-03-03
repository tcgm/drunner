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
  2: { description: 'Shadow Step (2 pieces): +20 Speed, +20 Luck per piece', stats: { speed: 20, luck: 20 } },
  4: { description: 'Veil of Night (4 pieces): +40 Speed, +30 Luck, +30 Attack per piece', stats: { speed: 40, luck: 30, attack: 30 } },
  6: { description: 'Master Assassin (Full Set): +70 Speed, +50 Luck, +50 Attack, +30 Wisdom per piece', stats: { speed: 70, luck: 50, attack: 50, wisdom: 30 } },
}

/**
 * TRIGGERED Set-wide unique effect - applies when ANY Shadow piece rolls as unique
 * Individual pieces can override by defining uniqueEffect in their item definition
 */
export const SHADOW_SET_UNIQUE_EFFECT: UniqueEffectDefinition = {
  triggers: ['onCombatStart'],
  description: (m) => `Assassin's Mark: 35% chance to gain +${Math.floor(100 * m)}% Luck for the battle`,
  handler: (context) => {
    const { party, sourceHero, effectMultiplier = 1.0, currentDepth } = context
    
    if (!sourceHero || !sourceHero.isAlive) {
      return null
    }
    
    // 35% chance to trigger
    if (Math.random() > 0.35) {
      return null
    }
    
    // Double luck for the battle (1-event TimedEffect - works in both events and combat)
    const luckBoost = Math.floor(sourceHero.stats.luck * effectMultiplier)
    const depth = currentDepth ?? 0
    const duration = 1
    if (!sourceHero.activeEffects) sourceHero.activeEffects = []
    sourceHero.activeEffects.push({
      id: `shadow-mark-luck-${Date.now()}`,
      type: 'buff',
      name: "Assassin's Mark",
      description: `+${luckBoost} Luck from Assassin's Mark`,
      stat: 'luck',
      modifier: luckBoost,
      duration,
      appliedAtDepth: depth,
      expiresAtDepth: depth + duration,
      isPermanent: false,
    })
    
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
