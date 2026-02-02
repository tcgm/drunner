import type { DungeonEvent } from '@/types'
import { GiFrostfire } from 'react-icons/gi'

export const DUALIST_ELEMENTAL: DungeonEvent = {
  id: 'dualist-elemental',
  type: 'boss',
  title: 'Dualist Elemental',
  description: 'Fire and ice fused into one being. One half burns while the other freezes. Both deadly, both impossible to resist.',
  choices: [
    {
      text: 'Endure both extremes',
      outcome: {
        text: 'Burning and freezing simultaneously! Your body cannot survive both!',
        effects: [
          { type: 'damage', target: 'all', value: 468 },
          { type: 'xp', value: 1915 },
          { type: 'gold', value: 2873 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 38 },
        ],
      },
    },
    {
      text: 'Separate the halves (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You split them apart! Alone, each half is manageable!',
        effects: [
          { type: 'damage', target: 'all', value: 405 },
          { type: 'xp', value: 2045 },
          { type: 'gold', value: 3068 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 49 },
        ],
      },
    },
    {
      text: 'Adapt constantly (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 72,
      },
      outcome: {
        text: 'You resist both elements! Your fortitude is unbreakable!',
        effects: [
          { type: 'damage', target: 'strongest', value: 418 },
          { type: 'xp', value: 2070 },
          { type: 'gold', value: 3105 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 50 },
        ],
      },
    },
  ],
  depth: 65,
  icon: GiFrostfire,
}
