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
  2: { description: 'Fox Spirit (2 pieces): +10 Speed, +10 Luck per piece', stats: { speed: 10, luck: 10 } },
  4: { description: 'Fox Cunning (4 pieces): +20 Speed, +10 Luck, +20 Magic Power per piece', stats: { speed: 20, luck: 10, magicPower: 20 } },
  6: { description: 'Nine-Tailed Power (Full Set): +30 Speed, +20 Luck, +40 Magic Power, +20 Attack per piece', stats: { speed: 30, luck: 20, magicPower: 40, attack: 20 } },
}

/**
 * TRIGGERED Set-wide unique effect - applies when ANY Kitsune piece rolls as unique
 * Individual pieces can override by defining uniqueEffect in their item definition
 */
export const KITSUNE_SET_UNIQUE_EFFECT: UniqueEffectDefinition = {
  triggers: ['onCombatStart'],
  description: (m) => `Fox Spirit: 20% chance to gain +${Math.floor(50 * m)}% Speed for the battle`,
  handler: (context) => {
    const { party, sourceHero, effectMultiplier = 1.0, currentDepth } = context
    
    if (!sourceHero || !sourceHero.isAlive) {
      return null
    }
    
    // 20% chance to trigger
    if (Math.random() > 0.2) {
      return null
    }
    
    // Apply speed boost (1-event TimedEffect - works in both events and combat)
    const speedBoost = Math.floor(sourceHero.stats.speed * 0.5 * effectMultiplier)
    const depth = currentDepth ?? 0
    const duration = 1
    if (!sourceHero.activeEffects) sourceHero.activeEffects = []
    sourceHero.activeEffects.push({
      id: `kitsune-speed-${Date.now()}`,
      type: 'buff',
      name: 'Fox Spirit',
      description: `+${speedBoost} Speed from Fox Spirit`,
      stat: 'speed',
      modifier: speedBoost,
      duration,
      appliedAtDepth: depth,
      expiresAtDepth: depth + duration,
      isPermanent: false,
    })
    
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
