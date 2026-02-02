import type { DungeonEvent } from '@/types'
import { GiElectric } from 'react-icons/gi'

export const STATIC_SHADES: DungeonEvent = {
  id: 'static-shades',
  type: 'combat',
  title: 'Static Shades',
  description: 'Ghostly beings made of pure electricity!',
  choices: [
    {
      text: 'Ground them',
      outcome: {
        text: 'Electric shocks paralyze you!',
        effects: [
          { type: 'damage', target: 'strongest', value: 87 },
          { type: 'xp', value: 433 },
          { type: 'gold', value: 318 },
        ],
      },
    },
    {
      text: 'Dodge their arcs (Speed check)',
      requirements: { stat: 'speed', minValue: 135 },
      outcome: {
        text: 'You avoid their lightning!',
        effects: [
          { type: 'damage', target: 'strongest', value: 76 },
          { type: 'xp', value: 453 },
          { type: 'gold', value: 338 },
        ],
      },
    },
  ],
  depth: 56,
  icon: GiElectric,
}
