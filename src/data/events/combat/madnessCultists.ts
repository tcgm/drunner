import type { DungeonEvent } from '@/types'
import { GiBleedingEye } from 'react-icons/gi'

export const MADNESS_CULTISTS: DungeonEvent = {
  id: 'madness-cultists',
  type: 'combat',
  title: 'Madness Cultists',
  description: 'Insane worshippers chant reality-warping words!',
  choices: [
    {
      text: 'Silence them',
      outcome: {
        text: 'You stop their maddening chants!',
        effects: [
          { type: 'damage', target: 'random', value: 19 },
          { type: 'xp', value: 77 },
          { type: 'gold', value: 46 },
        ],
      },
    },
    {
      text: 'Resist madness (Defense check)',
      requirements: { stat: 'defense', minValue: 33 },
      outcome: {
        text: 'You maintain your sanity and strike!',
        effects: [
          { type: 'damage', target: 'random', value: 13 },
          { type: 'xp', value: 92 },
          { type: 'gold', value: 56 },
        ],
      },
    },
  ],
  depth: 13,
  icon: GiBleedingEye,
}
