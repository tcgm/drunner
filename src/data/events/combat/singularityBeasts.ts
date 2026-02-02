import type { DungeonEvent } from '@/types'
import { GiBlackHole } from 'react-icons/gi'

export const SINGULARITY_BEASTS: DungeonEvent = {
  id: 'singularity-beasts',
  type: 'combat',
  title: 'Singularity Beasts',
  description: 'Creatures containing miniature black holes pull everything toward destruction!',
  choices: [
    {
      text: 'Resist the pull',
      outcome: {
        text: 'Gravitational forces tear at you!',
        effects: [
          { type: 'damage', target: 'strongest', value: 94 },
          { type: 'xp', value: 480 },
          { type: 'gold', value: 360 },
        ],
      },
    },
    {
      text: 'Anchor yourself (Strength check)',
      requirements: { stat: 'strength', minValue: 165 },
      outcome: {
        text: 'You stand firm against gravity!',
        effects: [
          { type: 'damage', target: 'strongest', value: 83 },
          { type: 'xp', value: 500 },
          { type: 'gold', value: 380 },
        ],
      },
    },
  ],
  depth: 66,
  icon: GiBlackHole,
}
