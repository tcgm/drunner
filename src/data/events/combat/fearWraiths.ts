import type { DungeonEvent } from '@/types'
import { GiTerror } from 'react-icons/gi'

export const FEAR_WRAITHS: DungeonEvent = {
  id: 'fear-wraiths',
  type: 'combat',
  title: 'Fear Wraiths',
  description: 'Embodiments of terror freeze you with dread!',
  choices: [
    {
      text: 'Overcome fear',
      outcome: {
        text: 'Terror grips your heart!',
        effects: [
          { type: 'damage', target: 'weakest', value: 41 },
          { type: 'xp', value: 177 },
          { type: 'gold', value: 123 },
        ],
      },
    },
    {
      text: 'Courageous heart (Defense check)',
      requirements: { stat: 'defense', minValue: 64 },
      outcome: {
        text: 'Your bravery dispels them!',
        effects: [
          { type: 'damage', target: 'weakest', value: 31 },
          { type: 'xp', value: 197 },
          { type: 'gold', value: 143 },
        ],
      },
    },
  ],
  depth: 28,
  icon: GiTerror,
}
