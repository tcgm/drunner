import type { DungeonEvent } from '@/types'
import { GiBlackHoleBolas } from 'react-icons/gi'

export const EVENT_HORIZON_BEASTS: DungeonEvent = {
  id: 'event-horizon-beasts',
  type: 'combat',
  title: 'Event Horizon Beasts',
  description: 'Creatures born at the edge of black holes!',
  choices: [
    {
      text: 'Escape their pull',
      outcome: {
        text: 'Gravity crushes you!',
        effects: [
          { type: 'damage', target: 'random', value: 137 },
          { type: 'xp', value: 733 },
          { type: 'gold', value: 567 },
        ],
      },
    },
    {
      text: 'Counter gravity (Strength check)',
      requirements: { stat: 'attack', minValue: 187 },
      outcome: {
        text: 'You tear free from their grasp!',
        effects: [
          { type: 'damage', target: 'random', value: 126 },
          { type: 'xp', value: 753 },
          { type: 'gold', value: 587 },
        ],
      },
    },
  ],
  depth: 76,
  icon: GiBlackHoleBolas,
}
