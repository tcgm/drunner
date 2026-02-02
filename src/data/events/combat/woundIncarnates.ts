import type { DungeonEvent } from '@/types'
import { GiBleedingWound } from 'react-icons/gi'

export const WOUND_INCARNATES: DungeonEvent = {
  id: 'wound-incarnates',
  type: 'combat',
  title: 'Wound Incarnates',
  description: 'Living injuries that inflict themselves upon reality!',
  choices: [
    {
      text: 'Endure the wounds',
      outcome: {
        text: 'Injuries manifest from nothing!',
        effects: [
          { type: 'damage', target: 'weakest', value: 116 },
          { type: 'xp', value: 605 },
          { type: 'gold', value: 485 },
        ],
      },
    },
    {
      text: 'Healing surge (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine healing negates wounds!',
        effects: [
          { type: 'damage', target: 'weakest', value: 105 },
          { type: 'xp', value: 625 },
          { type: 'gold', value: 505 },
        ],
      },
    },
  ],
  depth: 77,
  icon: GiBleedingWound,
}
