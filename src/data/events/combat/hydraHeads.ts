import type { DungeonEvent } from '@/types'
import { GiSnakeBite } from 'react-icons/gi'

export const HYDRA_HEADS: DungeonEvent = {
  id: 'hydra-heads',
  type: 'combat',
  title: 'Hydra Heads',
  description: 'Multiple serpent heads strike from a writhing mass!',
  choices: [
    {
      text: 'Sever the heads',
      outcome: {
        text: 'More grow back as you cut!',
        effects: [
          { type: 'damage', target: 'all', value: 27 },
          { type: 'xp', value: 117 },
          { type: 'gold', value: 72 },
        ],
      },
    },
    {
      text: 'Cauterize wounds (Strength check)',
      requirements: { stat: 'strength', minValue: 52 },
      outcome: {
        text: 'You prevent regeneration!',
        effects: [
          { type: 'damage', target: 'all', value: 19 },
          { type: 'xp', value: 137 },
          { type: 'gold', value: 87 },
        ],
      },
    },
  ],
  depth: 17,
  icon: GiSnakeBite,
}
