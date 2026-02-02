import type { DungeonEvent } from '@/types'
import { GiFloatingPlatforms } from 'react-icons/gi'

export const DIMENSION_RIPPER: DungeonEvent = {
  id: 'dimension-ripper',
  type: 'boss',
  title: 'Dimension Ripper',
  description: 'A creature that exists in multiple dimensions simultaneously. It attacks from angles that don\'t exist in normal space.',
  choices: [
    {
      text: 'Fight in 3D space',
      outcome: {
        text: 'It strikes from impossible directions! You cannot defend angles you cannot perceive!',
        effects: [
          { type: 'damage', target: 'random', value: 518 },
          { type: 'xp', value: 2145 },
          { type: 'gold', value: 3218 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 41 },
        ],
      },
    },
    {
      text: 'Perceive all dimensions (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 79,
      },
      outcome: {
        text: 'You expand your awareness! Now you can strike back!',
        effects: [
          { type: 'damage', target: 'all', value: 452 },
          { type: 'xp', value: 2275 },
          { type: 'gold', value: 3413 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 56 },
        ],
      },
    },
    {
      text: 'Collapse dimensions (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You fold space! All dimensions become one! The ripper is trapped!',
        effects: [
          { type: 'damage', target: 'all', value: 465 },
          { type: 'xp', value: 2300 },
          { type: 'gold', value: 3450 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 57 },
        ],
      },
    },
  ],
  depth: 72,
  icon: GiFloatingPlatforms,
}
