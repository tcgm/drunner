import type { DungeonEvent } from '@/types'
import { GiIceBolt } from 'react-icons/gi'

export const FROST_WRAITHS: DungeonEvent = {
  id: 'frost-wraiths',
  type: 'combat',
  title: 'Frost Wraiths',
  description: 'Ghostly beings emanate deadly cold!',
  choices: [
    {
      text: 'Endure the freeze',
      outcome: {
        text: 'Frostbite spreads rapidly!',
        effects: [
          { type: 'damage', target: 'all', value: 43 },
          { type: 'xp', value: 215 },
          { type: 'gold', value: 147 },
        ],
      },
    },
    {
      text: 'Banish with warmth (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine warmth melts them!',
        effects: [
          { type: 'damage', target: 'all', value: 32 },
          { type: 'xp', value: 235 },
          { type: 'gold', value: 167 },
        ],
      },
    },
  ],
  depth: 31,
  icon: GiIceBolt,
}
