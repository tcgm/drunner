import type { DungeonEvent } from '@/types'
import { GiShamblingMound } from 'react-icons/gi'

export const ENTROPY_COLOSSI: DungeonEvent = {
  id: 'entropy-colossi',
  type: 'combat',
  title: 'Entropy Colossi',
  description: 'Massive beings that embody universal decay!',
  choices: [
    {
      text: 'Fight entropy itself',
      outcome: {
        text: 'Everything you touch crumbles!',
        effects: [
          { type: 'damage', target: 'all', value: 126 },
          { type: 'xp', value: 671 },
          { type: 'gold', value: 518 },
        ],
      },
    },
    {
      text: 'Preserve yourself (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine order counters chaos!',
        effects: [
          { type: 'damage', target: 'all', value: 115 },
          { type: 'xp', value: 691 },
          { type: 'gold', value: 538 },
        ],
      },
    },
  ],
  depth: 75,
  icon: GiShamblingMound,
}
