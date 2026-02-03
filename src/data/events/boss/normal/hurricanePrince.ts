import type { DungeonEvent } from '@/types'
import { GiTornado } from 'react-icons/gi'

export const HURRICANE_PRINCE: DungeonEvent = {
  id: 'hurricane-prince',
  type: 'boss',
  title: 'Hurricane Prince',
  description: 'An elemental lord of wind and storm. It is the eye of an eternal hurricane, commanding winds that could level cities.',
  choices: [
    {
      text: 'Brave the winds',
      outcome: {
        text: 'The hurricane tears you apart! Wind blades cut from every direction!',
        effects: [
          { type: 'damage', target: 'all', value: 435 },
          { type: 'xp', value: 1820 },
          { type: 'gold', value: 2730 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 35 },
        ],
      },
    },
    {
      text: 'Still the air (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You command absolute calm! Without wind, the prince fades!',
        effects: [
          { type: 'damage', target: 'all', value: 365 },
          { type: 'xp', value: 1950 },
          { type: 'gold', value: 2925 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 45 },
        ],
      },
    },
    {
      text: 'Strike the eye (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 68,
      },
      outcome: {
        text: 'You reach the calm center and strike! The hurricane collapses!',
        effects: [
          { type: 'damage', target: 'strongest', value: 378 },
          { type: 'xp', value: 1975 },
          { type: 'gold', value: 2963 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 46 },
        ],
      },
    },
  ],
  depth: 61,
  icon: GiTornado,
}
