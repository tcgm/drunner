import type { DungeonEvent } from '@/types'
import { GiWindHole } from 'react-icons/gi'

export const BREATH_STEALERS: DungeonEvent = {
  id: 'breath-stealers',
  type: 'combat',
  title: 'Breath Stealers',
  description: 'Ghostly beings that inhale your very life force!',
  choices: [
    {
      text: 'Fight while holding breath',
      outcome: {
        text: 'You gasp and they drain you!',
        effects: [
          { type: 'damage', target: 'random', value: 18 },
          { type: 'xp', value: 84 },
          { type: 'gold', value: 51 },
        ],
      },
    },
    {
      text: 'Use speed to escape (Speed check)',
      requirements: { stat: 'speed', minValue: 35 },
      outcome: {
        text: 'You evade their inhaling!',
        effects: [
          { type: 'damage', target: 'random', value: 13 },
          { type: 'xp', value: 99 },
          { type: 'gold', value: 61 },
        ],
      },
    },
  ],
  depth: 16,
  icon: GiWindHole,
}
