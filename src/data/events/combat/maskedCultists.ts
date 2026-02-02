import type { DungeonEvent } from '@/types'
import { GiCeremonialMask } from 'react-icons/gi'

export const MASKED_CULTISTS: DungeonEvent = {
  id: 'masked-cultists',
  type: 'combat',
  title: 'Masked Cultists',
  description: 'Hooded figures in disturbing masks chant ominously!',
  choices: [
    {
      text: 'Break their ritual',
      outcome: {
        text: 'You disrupt their dark ceremony!',
        effects: [
          { type: 'damage', target: 'random', value: 16 },
          { type: 'xp', value: 68 },
          { type: 'gold', value: 40 },
        ],
      },
    },
    {
      text: 'Intimidate them (Strength check)',
      requirements: { stat: 'strength', minValue: 28 },
      outcome: {
        text: 'They flee in terror!',
        effects: [
          { type: 'damage', target: 'random', value: 11 },
          { type: 'xp', value: 83 },
          { type: 'gold', value: 50 },
        ],
      },
    },
  ],
  depth: 11,
  icon: GiCeremonialMask,
}
