import type { DungeonEvent } from '@/types'
import { GiAbstract107 } from 'react-icons/gi'

export const APOCALYPSE_HERALDS: DungeonEvent = {
  id: 'apocalypse-heralds',
  type: 'combat',
  title: 'Apocalypse Heralds',
  description: 'Harbingers of the end times bring destruction incarnate!',
  choices: [
    {
      text: 'Face the apocalypse',
      outcome: {
        text: 'The end of all things approaches!',
        effects: [
          { type: 'damage', target: 'strongest', value: 148 },
          { type: 'xp', value: 765 },
          { type: 'gold', value: 625 },
        ],
      },
    },
    {
      text: 'Hope endures (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine hope defies the end!',
        effects: [
          { type: 'damage', target: 'strongest', value: 137 },
          { type: 'xp', value: 785 },
          { type: 'gold', value: 645 },
        ],
      },
    },
  ],
  depth: 88,
  icon: GiAbstract107,
}
