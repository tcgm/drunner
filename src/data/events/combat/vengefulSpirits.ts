import type { DungeonEvent } from '@/types'
import { GiWingedSword } from 'react-icons/gi'

export const VENGEFUL_SPIRITS: DungeonEvent = {
  id: 'vengeful-spirits',
  type: 'combat',
  title: 'Vengeful Spirits',
  description: 'Angry ghosts seek revenge on the living!',
  choices: [
    {
      text: 'Endure their wrath',
      outcome: {
        text: 'Their hatred burns you!',
        effects: [
          { type: 'damage', target: 'random', value: 38 },
          { type: 'xp', value: 158 },
          { type: 'gold', value: 100 },
        ],
      },
    },
    {
      text: 'Put them to rest (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'They find peace!',
        effects: [
          { type: 'damage', target: 'random', value: 29 },
          { type: 'xp', value: 173 },
          { type: 'gold', value: 111 },
        ],
      },
    },
  ],
  depth: 29,
  icon: GiWingedSword,
}
