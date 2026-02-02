import type { DungeonEvent } from '@/types'
import { GiSwapBag } from 'react-icons/gi'

export const BODY_SNATCHERS: DungeonEvent = {
  id: 'body-snatchers',
  type: 'combat',
  title: 'Body Snatchers',
  description: 'Parasites that try to steal your physical form!',
  choices: [
    {
      text: 'Resist possession',
      outcome: {
        text: 'They partially take control!',
        effects: [
          { type: 'damage', target: 'weakest', value: 44 },
          { type: 'xp', value: 231 },
          { type: 'gold', value: 158 },
        ],
      },
    },
    {
      text: 'Mental fortitude (Defense check)',
      requirements: { stat: 'defense', minValue: 85 },
      outcome: {
        text: 'Your will repels them!',
        effects: [
          { type: 'damage', target: 'weakest', value: 33 },
          { type: 'xp', value: 251 },
          { type: 'gold', value: 178 },
        ],
      },
    },
  ],
  depth: 37,
  icon: GiSwapBag,
}
