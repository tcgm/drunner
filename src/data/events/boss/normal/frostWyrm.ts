import type { DungeonEvent } from '@/types'
import { GiIceSpear } from 'react-icons/gi'

export const FROST_WYRM: DungeonEvent = {
  id: 'frost-wyrm',
  type: 'boss',
  title: 'Frost Wyrm',
  description: 'An undead dragon of ice and death. Its breath freezes all life, and frost spreads from its very presence.',
  choices: [
    {
      text: 'Endure the cold',
      outcome: {
        text: 'Freezing breath and necrotic energy assault you! You\'re frozen solid!',
        effects: [
          { type: 'damage', target: 'all', value: 335 },
          { type: 'xp', value: 1240 },
          { type: 'gold', value: 1860 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 26 },
        ],
      },
    },
    {
      text: 'Destroy with fire (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Flames melt the ice! The wyrm dissolves into mist!',
        effects: [
          { type: 'damage', target: 'all', value: 262 },
          { type: 'xp', value: 1330 },
          { type: 'gold', value: 1995 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 31 },
        ],
      },
    },
    {
      text: 'Lay to rest (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Divine power frees it from undeath! It thanks you as it fades!',
        effects: [
          { type: 'damage', target: 'all', value: 250 },
          { type: 'xp', value: 1360 },
          { type: 'gold', value: 2040 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 32 },
        ],
      },
    },
  ],
  depth: 47,
  icon: GiIceSpear,
}
