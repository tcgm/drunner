import type { DungeonEvent } from '@/types'
import { GiSpiralThrust } from 'react-icons/gi'

export const CHAOS_WARRIORS: DungeonEvent = {
  id: 'chaos-warriors',
  type: 'combat',
  title: 'Chaos Warriors',
  description: 'Champions corrupted by raw chaos energy attack erratically!',
  choices: [
    {
      text: 'Match their chaos',
      outcome: {
        text: 'Their unpredictable strikes hit hard!',
        effects: [
          { type: 'damage', target: 'random', value: 49 },
          { type: 'xp', value: 245 },
          { type: 'gold', value: 168 },
        ],
      },
    },
    {
      text: 'Disciplined combat (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'Your training prevails!',
        effects: [
          { type: 'damage', target: 'random', value: 38 },
          { type: 'xp', value: 265 },
          { type: 'gold', value: 188 },
        ],
      },
    },
  ],
  depth: 37,
  icon: GiSpiralThrust,
}
