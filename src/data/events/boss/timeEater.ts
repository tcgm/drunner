import type { DungeonEvent } from '@/types'
import { GiSundial } from 'react-icons/gi'

export const TIME_EATER: DungeonEvent = {
  id: 'time-eater',
  type: 'boss',
  title: 'Time Eater',
  description: 'A being that feeds on moments. It ages you with a touch and can rewind its own wounds. Time itself warps around it.',
  choices: [
    {
      text: 'Fight against time',
      outcome: {
        text: 'Years pass in seconds! You age rapidly as it devours your timeline!',
        effects: [
          { type: 'damage', target: 'all', value: 290 },
          { type: 'xp', value: 1120 },
          { type: 'gold', value: 1680 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 22 },
        ],
      },
    },
    {
      text: 'Exist outside time (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 52,
      },
      outcome: {
        text: 'You transcend the timestream! It cannot age what doesn\'t exist in time!',
        effects: [
          { type: 'damage', target: 'weakest', value: 218 },
          { type: 'xp', value: 1240 },
          { type: 'gold', value: 1860 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 26 },
        ],
      },
    },
    {
      text: 'Trap in time loop (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You create a paradox! The time eater is caught in endless recursion!',
        effects: [
          { type: 'damage', target: 'all', value: 210 },
          { type: 'xp', value: 1265 },
          { type: 'gold', value: 1898 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 27 },
        ],
      },
    },
  ],
  depth: 43,
  icon: GiSundial,
}
