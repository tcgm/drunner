import type { DungeonEvent } from '@/types'
import { GiSpinningSword } from 'react-icons/gi'

export const REALITY_SLASHERS: DungeonEvent = {
  id: 'reality-slashers',
  type: 'combat',
  title: 'Reality Slashers',
  description: 'Beings that cut through the fabric of reality itself!',
  choices: [
    {
      text: 'Dodge reality cuts',
      outcome: {
        text: 'Wounds that transcend physicality!',
        effects: [
          { type: 'damage', target: 'weakest', value: 108 },
          { type: 'xp', value: 570 },
          { type: 'gold', value: 450 },
        ],
      },
    },
    {
      text: 'Impossible reflexes (Speed check)',
      requirements: { stat: 'speed', minValue: 175 },
      outcome: {
        text: 'You move between reality cuts!',
        effects: [
          { type: 'damage', target: 'weakest', value: 97 },
          { type: 'xp', value: 590 },
          { type: 'gold', value: 470 },
        ],
      },
    },
  ],
  depth: 72,
  icon: GiSpinningSword,
}
