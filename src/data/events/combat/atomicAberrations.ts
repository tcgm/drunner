import type { DungeonEvent } from '@/types'
import { GiRadioactive } from 'react-icons/gi'

export const ATOMIC_ABERRATIONS: DungeonEvent = {
  id: 'atomic-aberrations',
  type: 'combat',
  title: 'Atomic Aberrations',
  description: 'Mutated horrors that emit deadly radiation!',
  choices: [
    {
      text: 'Fight through radiation',
      outcome: {
        text: 'Your cells burn with energy!',
        effects: [
          { type: 'damage', target: 'all', value: 118 },
          { type: 'xp', value: 627 },
          { type: 'gold', value: 483 },
        ],
      },
    },
    {
      text: 'Shield yourself (Defense check)',
      requirements: { stat: 'defense', minValue: 173 },
      outcome: {
        text: 'You deflect the radiation!',
        effects: [
          { type: 'damage', target: 'all', value: 107 },
          { type: 'xp', value: 647 },
          { type: 'gold', value: 503 },
        ],
      },
    },
  ],
  depth: 72,
  icon: GiRadioactive,
}
