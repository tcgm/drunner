import type { DungeonEvent } from '@/types'
import { GiEvilBook } from 'react-icons/gi'

export const CURSED_TOMES: DungeonEvent = {
  id: 'cursed-tomes',
  type: 'combat',
  title: 'Cursed Tomes',
  description: 'Ancient books fly through the air, pages flapping menacingly!',
  choices: [
    {
      text: 'Tear them apart',
      outcome: {
        text: 'You rip the cursed pages!',
        effects: [
          { type: 'damage', target: 'random', value: 10 },
          { type: 'xp', value: 39 },
          { type: 'gold', value: 19 },
        ],
      },
    },
    {
      text: 'Counter-spell (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You dispel the magic!',
        effects: [
          { type: 'damage', target: 'random', value: 5 },
          { type: 'xp', value: 49 },
          { type: 'gold', value: 27 },
        ],
      },
    },
  ],
  depth: 6,
  icon: GiEvilBook,
}
