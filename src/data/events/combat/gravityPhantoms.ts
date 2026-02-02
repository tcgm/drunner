import type { DungeonEvent } from '@/types'
import { GiFalling } from 'react-icons/gi'

export const GRAVITY_PHANTOMS: DungeonEvent = {
  id: 'gravity-phantoms',
  type: 'combat',
  title: 'Gravity Phantoms',
  description: 'Spirits that manipulate gravitational forces!',
  choices: [
    {
      text: 'Fight the crushing force',
      outcome: {
        text: 'You are pressed into the ground!',
        effects: [
          { type: 'damage', target: 'weakest', value: 112 },
          { type: 'xp', value: 594 },
          { type: 'gold', value: 457 },
        ],
      },
    },
    {
      text: 'Adapt to weightlessness (Speed check)',
      requirements: { stat: 'speed', minValue: 167 },
      outcome: {
        text: 'You float and strike freely!',
        effects: [
          { type: 'damage', target: 'weakest', value: 101 },
          { type: 'xp', value: 614 },
          { type: 'gold', value: 477 },
        ],
      },
    },
  ],
  depth: 69,
  icon: GiFalling,
}
