import type { DungeonEvent } from '@/types'
import { GiBearFace } from 'react-icons/gi'

export const PRIMAL_AVATAR: DungeonEvent = {
  id: 'primal-avatar',
  type: 'boss',
  title: 'Primal Avatar',
  description: 'The living embodiment of nature\'s rage. It shifts between predator forms - bear, wolf, eagle, snake - adapting to every threat.',
  choices: [
    {
      text: 'Fight all forms',
      outcome: {
        text: 'Each form brings new dangers! Bear strength, wolf pack tactics, eagle swoops, serpent venom!',
        effects: [
          { type: 'damage', target: 'all', value: 402 },
          { type: 'xp', value: 1635 },
          { type: 'gold', value: 2453 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 32 },
        ],
      },
    },
    {
      text: 'Pacify the avatar (Druid bonus)',
      requirements: {
        class: 'Druid',
      },
      outcome: {
        text: 'You speak to nature\'s heart! The avatar recognizes a kindred spirit!',
        effects: [
          { type: 'damage', target: 'all', value: 335 },
          { type: 'xp', value: 1755 },
          { type: 'gold', value: 2633 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 40 },
        ],
      },
    },
    {
      text: 'Adapt faster (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 66,
      },
      outcome: {
        text: 'You counter each form before it shifts! Your adaptability exceeds the avatar\'s!',
        effects: [
          { type: 'damage', target: 'random', value: 348 },
          { type: 'xp', value: 1780 },
          { type: 'gold', value: 2670 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 41 },
        ],
      },
    },
  ],
  depth: 57,
  icon: GiBearFace,
}
