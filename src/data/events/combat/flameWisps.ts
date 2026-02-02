import type { DungeonEvent } from '@/types'
import { GiBurningEye } from 'react-icons/gi'

export const FLAME_WISPS: DungeonEvent = {
  id: 'flame-wisps',
  type: 'combat',
  title: 'Flame Wisps',
  description: 'Dancing lights of fire dart around, leaving burn marks!',
  choices: [
    {
      text: 'Catch and smother',
      outcome: {
        text: 'You extinguish the fiery sprites!',
        effects: [
          { type: 'damage', target: 'weakest', value: 18 },
          { type: 'xp', value: 75 },
          { type: 'gold', value: 45 },
        ],
      },
    },
    {
      text: 'Quick reactions (Speed check)',
      requirements: { stat: 'speed', minValue: 29 },
      outcome: {
        text: 'You catch them before they burn you!',
        effects: [
          { type: 'damage', target: 'weakest', value: 13 },
          { type: 'xp', value: 90 },
          { type: 'gold', value: 55 },
        ],
      },
    },
  ],
  depth: 11,
  icon: GiBurningEye,
}
