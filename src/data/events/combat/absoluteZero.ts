import type { DungeonEvent } from '@/types'
import { GiFrozenOrb } from 'react-icons/gi'

export const ABSOLUTE_ZERO: DungeonEvent = {
  id: 'absolute-zero',
  type: 'combat',
  title: 'Absolute Zero',
  description: 'A cold so intense it stops molecular motion!',
  choices: [
    {
      text: 'Endure the cold',
      outcome: {
        text: 'Your body begins to freeze!',
        effects: [
          { type: 'damage', target: 'all', value: 84 },
          { type: 'xp', value: 418 },
          { type: 'gold', value: 307 },
        ],
      },
    },
    {
      text: 'Generate heat (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Fire magic counters the freeze!',
        effects: [
          { type: 'damage', target: 'all', value: 73 },
          { type: 'xp', value: 438 },
          { type: 'gold', value: 327 },
        ],
      },
    },
  ],
  depth: 53,
  icon: GiFrozenOrb,
}
