import type { DungeonEvent } from '@/types'
import { GiSpikedTail } from 'react-icons/gi'

export const BEHEMOTH_KING: DungeonEvent = {
  id: 'behemoth-king',
  type: 'boss',
  title: 'Behemoth King',
  description: 'The largest beast to ever walk the earth. Each footstep causes earthquakes. Its roar alone can kill.',
  choices: [
    {
      text: 'Face the titan',
      outcome: {
        text: 'Massive beyond belief! You\'re crushed beneath impossible size!',
        effects: [
          { type: 'damage', target: 'all', value: 492 },
          { type: 'xp', value: 1985 },
          { type: 'gold', value: 2978 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 39 },
        ],
      },
    },
    {
      text: 'Strike vital points (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'Precision over power! You strike nerves and arteries! The behemoth falls!',
        effects: [
          { type: 'damage', target: 'weakest', value: 428 },
          { type: 'xp', value: 2120 },
          { type: 'gold', value: 3180 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 53 },
        ],
      },
    },
    {
      text: 'Match strength with strength (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 73,
      },
      outcome: {
        text: 'You topple the king! Size means nothing before absolute power!',
        effects: [
          { type: 'damage', target: 'strongest', value: 442 },
          { type: 'xp', value: 2145 },
          { type: 'gold', value: 3218 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 54 },
        ],
      },
    },
  ],
  depth: 70,
  icon: GiSpikedTail,
}
