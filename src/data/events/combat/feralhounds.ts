import type { DungeonEvent } from '@/types'
import { GiWolfHowl } from 'react-icons/gi'

export const FERAL_HOUNDS: DungeonEvent = {
  id: 'feral-hounds',
  type: 'combat',
  title: 'Feral Hounds',
  description: 'Wild dogs with matted fur and foam-flecked jaws charge forward!',
  choices: [
    {
      text: 'Stand and fight',
      outcome: {
        text: 'You battle the savage beasts!',
        effects: [
          { type: 'damage', target: 'random', value: 12 },
          { type: 'xp', value: 40 },
          { type: 'gold', value: 20 },
        ],
      },
    },
    {
      text: 'Defensive stance (Defense check)',
      requirements: { stat: 'defense', minValue: 15 },
      outcome: {
        text: 'You block their attacks and counter!',
        effects: [
          { type: 'damage', target: 'random', value: 7 },
          { type: 'xp', value: 50 },
          { type: 'gold', value: 28 },
        ],
      },
    },
  ],
  depth: 9,
  icon: GiWolfHowl,
}
