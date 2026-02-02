import type { DungeonEvent } from '@/types'
import { GiAbstract076 } from 'react-icons/gi'

export const EXISTENCE_THREATS: DungeonEvent = {
  id: 'existence-threats',
  type: 'combat',
  title: 'Existence Threats',
  description: 'Beings whose mere presence threatens all of existence!',
  choices: [
    {
      text: 'Defend existence',
      outcome: {
        text: 'Reality fractures around them!',
        effects: [
          { type: 'damage', target: 'random', value: 152 },
          { type: 'xp', value: 780 },
          { type: 'gold', value: 640 },
        ],
      },
    },
    {
      text: 'Reality anchor (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You stabilize existence!',
        effects: [
          { type: 'damage', target: 'random', value: 141 },
          { type: 'xp', value: 800 },
          { type: 'gold', value: 660 },
        ],
      },
    },
  ],
  depth: 90,
  icon: GiAbstract076,
}
