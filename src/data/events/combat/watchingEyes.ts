import type { DungeonEvent } from '@/types'
import { GiEyeMonster } from 'react-icons/gi'

export const WATCHING_EYES: DungeonEvent = {
  id: 'watching-eyes',
  type: 'combat',
  title: 'Watching Eyes',
  description: 'Disembodied eyes float and fire beams of energy!',
  choices: [
    {
      text: 'Destroy them',
      outcome: {
        text: 'You smash the malevolent eyes!',
        effects: [
          { type: 'damage', target: 'random', value: 13 },
          { type: 'xp', value: 48 },
          { type: 'gold', value: 25 },
        ],
      },
    },
    {
      text: 'Dodge beams (Speed check)',
      requirements: { stat: 'speed', minValue: 16 },
      outcome: {
        text: 'You evade their attacks!',
        effects: [
          { type: 'damage', target: 'random', value: 8 },
          { type: 'xp', value: 58 },
          { type: 'gold', value: 33 },
        ],
      },
    },
  ],
  depth: 10,
  icon: GiEyeMonster,
}
