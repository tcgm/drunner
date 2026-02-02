import type { DungeonEvent } from '@/types'
import { GiWhirlwind } from 'react-icons/gi'

export const STORM_SHADES: DungeonEvent = {
  id: 'storm-shades',
  type: 'combat',
  title: 'Storm Shades',
  description: 'Beings of crackling electricity dart through the air!',
  choices: [
    {
      text: 'Attack directly',
      outcome: {
        text: 'Lightning arcs through you!',
        effects: [
          { type: 'damage', target: 'random', value: 20 },
          { type: 'xp', value: 79 },
          { type: 'gold', value: 47 },
        ],
      },
    },
    {
      text: 'Ground yourself (Defense check)',
      requirements: { stat: 'defense', minValue: 30 },
      outcome: {
        text: 'You redirect their energy!',
        effects: [
          { type: 'damage', target: 'random', value: 14 },
          { type: 'xp', value: 94 },
          { type: 'gold', value: 57 },
        ],
      },
    },
  ],
  depth: 12,
  icon: GiWhirlwind,
}
