import type { DungeonEvent } from '@/types'
import { GiAbstract064 } from 'react-icons/gi'

export const INFINITY_BEASTS: DungeonEvent = {
  id: 'infinity-beasts',
  type: 'combat',
  title: 'Infinity Beasts',
  description: 'Creatures of infinite size and power condensed into finite form!',
  choices: [
    {
      text: 'Fight the infinite',
      outcome: {
        text: 'Their endless power overwhelms!',
        effects: [
          { type: 'damage', target: 'strongest', value: 155 },
          { type: 'xp', value: 805 },
          { type: 'gold', value: 665 },
        ],
      },
    },
    {
      text: 'Finite precision (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You strike their single weakness!',
        effects: [
          { type: 'damage', target: 'strongest', value: 144 },
          { type: 'xp', value: 825 },
          { type: 'gold', value: 685 },
        ],
      },
    },
  ],
  depth: 89,
  icon: GiAbstract064,
}
