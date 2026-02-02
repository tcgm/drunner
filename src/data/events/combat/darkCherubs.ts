import type { DungeonEvent } from '@/types'
import { GiFluffyWing } from 'react-icons/gi'

export const DARK_CHERUBS: DungeonEvent = {
  id: 'dark-cherubs',
  type: 'combat',
  title: 'Dark Cherubs',
  description: 'Corrupted angel children fire arrows of shadow!',
  choices: [
    {
      text: 'Dodge their arrows',
      outcome: {
        text: 'Shadow arrows sap your strength!',
        effects: [
          { type: 'damage', target: 'weakest', value: 35 },
          { type: 'xp', value: 140 },
          { type: 'gold', value: 88 },
        ],
      },
    },
    {
      text: 'Purify them (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'You restore their innocence!',
        effects: [
          { type: 'damage', target: 'weakest', value: 25 },
          { type: 'xp', value: 155 },
          { type: 'gold', value: 99 },
        ],
      },
    },
  ],
  depth: 23,
  icon: GiFluffyWing,
}
