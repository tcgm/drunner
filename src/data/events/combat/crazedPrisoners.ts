import type { DungeonEvent } from '@/types'
import { GiPunch } from 'react-icons/gi'

export const CRAZED_PRISONERS: DungeonEvent = {
  id: 'crazed-prisoners',
  type: 'combat',
  title: 'Crazed Prisoners',
  description: 'Wild-eyed inmates attack with makeshift weapons!',
  choices: [
    {
      text: 'Subdue them',
      outcome: {
        text: 'You fight off the frenzied prisoners!',
        effects: [
          { type: 'damage', target: 'weakest', value: 11 },
          { type: 'xp', value: 36 },
          { type: 'gold', value: 18 },
        ],
      },
    },
    {
      text: 'Overpower them (Strength check)',
      requirements: { stat: 'attack', minValue: 14 },
      outcome: {
        text: 'You restrain them quickly!',
        effects: [
          { type: 'damage', target: 'weakest', value: 6 },
          { type: 'xp', value: 46 },
          { type: 'gold', value: 26 },
        ],
      },
    },
  ],
  depth: 10,
  icon: GiPunch,
}
