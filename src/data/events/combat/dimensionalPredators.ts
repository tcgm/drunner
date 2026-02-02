import type { DungeonEvent } from '@/types'
import { GiAbstract014 } from 'react-icons/gi'

export const DIMENSIONAL_PREDATORS: DungeonEvent = {
  id: 'dimensional-predators',
  type: 'combat',
  title: 'Dimensional Predators',
  description: 'Creatures that hunt across multiple dimensions phase in for the kill!',
  choices: [
    {
      text: 'Fight across dimensions',
      outcome: {
        text: 'They attack from impossible angles!',
        effects: [
          { type: 'damage', target: 'random', value: 72 },
          { type: 'xp', value: 360 },
          { type: 'gold', value: 260 },
        ],
      },
    },
    {
      text: 'Anchor reality (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You lock them in one dimension!',
        effects: [
          { type: 'damage', target: 'random', value: 61 },
          { type: 'xp', value: 380 },
          { type: 'gold', value: 280 },
        ],
      },
    },
  ],
  depth: 52,
  icon: GiAbstract014,
}
