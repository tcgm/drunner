import type { DungeonEvent } from '@/types'
import { GiCarnivorousPlant } from 'react-icons/gi'

export const SNAP_VINES: DungeonEvent = {
  id: 'snap-vines',
  type: 'combat',
  title: 'Snap Vines',
  description: 'Carnivorous plants lash out with thorny tendrils!',
  choices: [
    {
      text: 'Hack through them',
      outcome: {
        text: 'Thorns pierce your skin!',
        effects: [
          { type: 'damage', target: 'random', value: 11 },
          { type: 'xp', value: 42 },
          { type: 'gold', value: 24 },
        ],
      },
    },
    {
      text: 'Evade the vines (Speed check)',
      requirements: { stat: 'speed', minValue: 14 },
      outcome: {
        text: 'You slip past safely!',
        effects: [
          { type: 'damage', target: 'random', value: 6 },
          { type: 'xp', value: 52 },
          { type: 'gold', value: 30 },
        ],
      },
    },
  ],
  depth: 5,
  icon: GiCarnivorousPlant,
}
