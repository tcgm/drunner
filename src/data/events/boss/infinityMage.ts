import type { DungeonEvent } from '@/types'
import { GiMagicSwirl } from 'react-icons/gi'

export const INFINITY_MAGE: DungeonEvent = {
  id: 'infinity-mage',
  type: 'boss',
  title: 'Infinity Mage',
  description: 'A wizard who has tapped into infinite magical power. It casts endlessly without limit, each spell more devastating than the last.',
  choices: [
    {
      text: 'Survive infinite magic',
      outcome: {
        text: 'Spell after spell without end! You\'re buried under infinite power!',
        effects: [
          { type: 'damage', target: 'all', value: 612 },
          { type: 'xp', value: 2550 },
          { type: 'gold', value: 3825 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 50 },
        ],
      },
    },
    {
      text: 'Counter with infinity (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You tap your own infinite well! Endless power meets endless power!',
        effects: [
          { type: 'damage', target: 'all', value: 558 },
          { type: 'xp', value: 2710 },
          { type: 'gold', value: 4065 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 69 },
        ],
      },
    },
    {
      text: 'Find the finite (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 90,
      },
      outcome: {
        text: 'You see the source! Sever the connection and infinity becomes zero!',
        effects: [
          { type: 'damage', target: 'all', value: 572 },
          { type: 'xp', value: 2740 },
          { type: 'gold', value: 4110 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 70 },
        ],
      },
    },
  ],
  depth: 89,
  icon: GiMagicSwirl,
}
