import type { DungeonEvent } from '@/types'
import { GiAbstract094 } from 'react-icons/gi'

export const VOID_LEVIATHANS: DungeonEvent = {
  id: 'void-leviathans',
  type: 'combat',
  title: 'Void Leviathans',
  description: 'Titanic beings of pure nothingness consume all in their path!',
  choices: [
    {
      text: 'Face the void',
      outcome: {
        text: 'The emptiness swallows you!',
        effects: [
          { type: 'damage', target: 'all', value: 70 },
          { type: 'xp', value: 355 },
          { type: 'gold', value: 255 },
        ],
      },
    },
    {
      text: 'Resist annihilation (Defense check)',
      requirements: { stat: 'defense', minValue: 118 },
      outcome: {
        text: 'You refuse to be erased!',
        effects: [
          { type: 'damage', target: 'all', value: 59 },
          { type: 'xp', value: 375 },
          { type: 'gold', value: 275 },
        ],
      },
    },
  ],
  depth: 51,
  icon: GiAbstract094,
}
