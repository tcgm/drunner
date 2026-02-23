/**
 * Santa Set - Effects System
 *
 * Contains:
 * 1. SET_BONUSES - Passive stat boosts for equipping multiple pieces (2, 4, 6 pieces)
 * 2. SET_UNIQUE_EFFECT - Triggered effect when ANY Santa piece rolls as unique
 */

import type { UniqueEffectDefinition } from '@/systems/items/uniqueEffects'
import type { SetBonus } from '@/data/items/sets'

/**
 * PASSIVE Set Bonuses - stat boosts for equipping multiple pieces (always active)
 */
export const SANTA_SET_BONUSES: Record<number, SetBonus> = {
  2: {
    description: 'Holiday Cheer (2 pieces): +2 Luck, +1 Charisma per piece',
    stats: { luck: 2, charisma: 1 },
  },
  4: {
    description: "Season's Bounty (4 pieces): +3 Luck, +2 Charisma, +1 Speed per piece",
    stats: { luck: 3, charisma: 2, speed: 1 },
  },
  6: {
    description: 'Christmas Magic (Full Set): +5 Luck, +4 Charisma, +3 Speed, +4 Max HP per piece',
    stats: { luck: 5, charisma: 4, speed: 3, maxHp: 4 },
  },
}

/**
 * TRIGGERED Set-wide unique effect - applies when ANY Santa piece rolls as unique
 */
export const SANTA_SET_UNIQUE_EFFECT: UniqueEffectDefinition = {
  triggers: ['onBossDefeat'],
  description: (m) => `Gift of Giving: 30% chance to restore ${Math.floor(15 * m)}% Max HP to the hero after defeating a boss`,
  handler: (context) => {
    const { party, sourceHero, effectMultiplier = 1.0 } = context

    if (!sourceHero || !sourceHero.isAlive) {
      return null
    }

    // 30% chance to trigger
    if (Math.random() > 0.3) {
      return null
    }

    const healAmount = Math.floor(sourceHero.stats.maxHp * 0.15 * effectMultiplier)
    sourceHero.stats.hp = Math.min(
      sourceHero.stats.hp + healAmount,
      sourceHero.stats.maxHp,
    )

    return {
      party,
      message: `${sourceHero.name}'s Gift of Giving restores ${healAmount} HP!`,
      additionalEffects: [{
        type: 'heal',
        target: [sourceHero.id],
        value: healAmount,
        description: `Gift of Giving restores ${healAmount} HP to ${sourceHero.name}!`,
      }],
    }
  },
}
