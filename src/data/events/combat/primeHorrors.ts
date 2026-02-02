import type { DungeonEvent } from '@/types'
import { GiAbstract021 } from 'react-icons/gi'

export const PRIME_HORRORS: DungeonEvent = {
  id: 'prime-horrors',
  type: 'combat',
  title: 'Prime Horrors',
  description: 'The first and oldest beings in existence attack!',
  choices: [
    {
      text: 'Challenge primordial power',
      outcome: {
        text: 'Ancient power overwhelms you!',
        effects: [
          { type: 'damage', target: 'all', value: 174 },
          { type: 'xp', value: 919 },
          { type: 'gold', value: 728 },
        ],
      },
    },
    {
      text: 'Stand as equal (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'Your strength rivals theirs!',
        effects: [
          { type: 'damage', target: 'all', value: 163 },
          { type: 'xp', value: 939 },
          { type: 'gold', value: 748 },
        ],
      },
    },
  ],
  depth: 91,
  icon: GiAbstract021,
}
