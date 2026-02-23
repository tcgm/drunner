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
    description: 'Holiday Cheer (2 pieces): +20 Luck, +10 Charisma per piece',
    stats: { luck: 20, charisma: 10 },
  },
  4: {
    description: "Season's Bounty (4 pieces): +30 Luck, +20 Charisma, +10 Speed per piece",
    stats: { luck: 30, charisma: 20, speed: 10 },
  },
  6: {
    description: 'Christmas Magic (Full Set): +50 Luck, +40 Charisma, +30 Speed, +40 Max HP per piece',
    stats: { luck: 50, charisma: 40, speed: 30, maxHp: 40 },
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
