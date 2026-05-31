import type { DungeonEvent } from '@/types'
import { GiDragonHead } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const SHADOW_DRAGONS: DungeonEvent = {
  id: 'shadow-dragons',
  type: 'combat',
  tags: [TAGS.DRAGON, TAGS.SHADOW, TAGS.ABYSS],
  title: 'Shadow Dragons',
  description: 'Young dragons of pure darkness breathe shadowy flames!',
  choices: [
    {
      text: 'Engage them',
      outcome: {
        text: 'Shadow fire sears your soul!',
        effects: [
          { type: 'damage', target: 'strongest', value: 42 },
          { type: 'xp', value: 180 },
          { type: 'gold', value: 125 },
        ],
      },
    },
    {
      text: 'Ward against darkness (Defense check)',
      requirements: { stat: 'defense', minValue: 65 },
      outcome: {
        text: 'You resist their shadow magic!',
        effects: [
          { type: 'damage', target: 'strongest', value: 32 },
          { type: 'xp', value: 200 },
          { type: 'gold', value: 145 },
        ],
      },
    },
  ],
  depth: 29,
  icon: GiDragonHead,
}
