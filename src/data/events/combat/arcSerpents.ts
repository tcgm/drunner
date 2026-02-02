import type { DungeonEvent } from '@/types'
import { GiLightningHelix } from 'react-icons/gi'

export const ARC_SERPENTS: DungeonEvent = {
  id: 'arc-serpents',
  type: 'combat',
  title: 'Arc Serpents',
  description: 'Electric snakes coil and strike with lightning fangs!',
  choices: [
    {
      text: 'Ground the electricity',
      outcome: {
        text: 'Lightning courses through you!',
        effects: [
          { type: 'damage', target: 'weakest', value: 94 },
          { type: 'xp', value: 498 },
          { type: 'gold', value: 377 },
        ],
      },
    },
    {
      text: 'Insulate yourself (Defense check)',
      requirements: { stat: 'defense', minValue: 146 },
      outcome: {
        text: 'You deflect the current!',
        effects: [
          { type: 'damage', target: 'weakest', value: 83 },
          { type: 'xp', value: 518 },
          { type: 'gold', value: 397 },
        ],
      },
    },
  ],
  depth: 59,
  icon: GiLightningHelix,
}
