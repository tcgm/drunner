import type { DungeonEvent } from '@/types'
import { GiAbstract066 } from 'react-icons/gi'

export const ABSOLUTE_DESTROYERS: DungeonEvent = {
  id: 'absolute-destroyers',
  type: 'combat',
  title: 'Absolute Destroyers',
  description: 'Beings whose sole purpose is total annihilation!',
  choices: [
    {
      text: 'Resist annihilation',
      outcome: {
        text: 'Absolute destruction approaches!',
        effects: [
          { type: 'damage', target: 'all', value: 150 },
          { type: 'xp', value: 790 },
          { type: 'gold', value: 650 },
        ],
      },
    },
    {
      text: 'Preservation force (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine preservation counters destruction!',
        effects: [
          { type: 'damage', target: 'all', value: 139 },
          { type: 'xp', value: 810 },
          { type: 'gold', value: 670 },
        ],
      },
    },
  ],
  depth: 91,
  icon: GiAbstract066,
}
