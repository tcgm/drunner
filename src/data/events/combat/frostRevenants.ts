import type { DungeonEvent } from '@/types'
import { GiIceCube } from 'react-icons/gi'

export const FROST_REVENANTS: DungeonEvent = {
  id: 'frost-revenants',
  type: 'combat',
  title: 'Frost Revenants',
  description: 'Undead warriors frozen in eternal winter attack with icy weapons!',
  choices: [
    {
      text: 'Shatter them',
      outcome: {
        text: 'The cold numbs your limbs!',
        effects: [
          { type: 'damage', target: 'strongest', value: 30 },
          { type: 'xp', value: 124 },
          { type: 'gold', value: 77 },
        ],
      },
    },
    {
      text: 'Resist cold (Defense check)',
      requirements: { stat: 'defense', minValue: 49 },
      outcome: {
        text: 'You endure the freezing cold!',
        effects: [
          { type: 'damage', target: 'strongest', value: 21 },
          { type: 'xp', value: 144 },
          { type: 'gold', value: 92 },
        ],
      },
    },
  ],
  depth: 18,
  icon: GiIceCube,
}
