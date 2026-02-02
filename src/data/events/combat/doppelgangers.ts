import type { DungeonEvent } from '@/types'
import { GiDuality } from 'react-icons/gi'

export const DOPPELGANGERS: DungeonEvent = {
  id: 'doppelgangers',
  type: 'combat',
  title: 'Doppelgangers',
  description: 'Shapeshifters take your form and mirror your abilities!',
  choices: [
    {
      text: 'Fight yourself',
      outcome: {
        text: 'They know your every move!',
        effects: [
          { type: 'damage', target: 'weakest', value: 54 },
          { type: 'xp', value: 258 },
          { type: 'gold', value: 178 },
        ],
      },
    },
    {
      text: 'Unpredictable strikes (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You surprise your copy!',
        effects: [
          { type: 'damage', target: 'weakest', value: 43 },
          { type: 'xp', value: 278 },
          { type: 'gold', value: 198 },
        ],
      },
    },
  ],
  depth: 40,
  icon: GiDuality,
}
