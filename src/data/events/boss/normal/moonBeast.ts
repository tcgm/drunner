import type { DungeonEvent } from '@/types'
import { GiConcentricCrescents } from 'react-icons/gi'

export const MOON_BEAST: DungeonEvent = {
  id: 'moon-beast',
  type: 'boss',
  title: 'Moon Beast',
  description: 'A creature of lunar madness. Its power waxes and wanes with phases you cannot see, making it unpredictable and deadly.',
  choices: [
    {
      text: 'Fight erratically',
      outcome: {
        text: 'Its power shifts constantly! Sometimes weak, sometimes overwhelming!',
        effects: [
          { type: 'damage', target: 'random', value: 478 },
          { type: 'xp', value: 1950 },
          { type: 'gold', value: 2925 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 39 },
        ],
      },
    },
    {
      text: 'Predict the phases (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 74,
      },
      outcome: {
        text: 'You see the pattern! You strike only during weakness!',
        effects: [
          { type: 'damage', target: 'all', value: 412 },
          { type: 'xp', value: 2080 },
          { type: 'gold', value: 3120 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 51 },
        ],
      },
    },
    {
      text: 'Eclipse the moon (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You block its lunar connection! Without the moon, it\'s powerless!',
        effects: [
          { type: 'damage', target: 'all', value: 425 },
          { type: 'xp', value: 2100 },
          { type: 'gold', value: 3150 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 52 },
        ],
      },
    },
  ],
  depth: 68,
  icon: GiConcentricCrescents,
}
