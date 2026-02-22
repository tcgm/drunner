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
    description: 'Holiday Cheer (2 pieces): +20 Luck, +15 Charisma',
    stats: { luck: 20, charisma: 15 },
  },
  4: {
    description: "Season's Bounty (4 pieces): +40 Luck, +35 Charisma, +20 Speed",
    stats: { luck: 40, charisma: 35, speed: 20 },
  },
  6: {
    description: 'Christmas Magic (Full Set): +70 Luck, +60 Charisma, +45 Speed, +50 Max HP',
    stats: { luck: 70, charisma: 60, speed: 45, maxHp: 50 },
  },
}

/**
 * TRIGGERED Set-wide unique effect - applies when ANY Santa piece rolls as unique
 */
export const SANTA_SET_UNIQUE_EFFECT: UniqueEffectDefinition = {
  triggers: ['onBossDefeat'],
  description: "Gift of Giving: 30% chance to restore 15% Max HP to the hero after defeating a boss",
  handler: (context) => {
    const { party, sourceHero } = context

    if (!sourceHero || !sourceHero.isAlive) {
      return null
    }

    // 30% chance to trigger
    if (Math.random() > 0.3) {
      return null
    }

    const healAmount = Math.floor(sourceHero.stats.maxHp * 0.15)
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
