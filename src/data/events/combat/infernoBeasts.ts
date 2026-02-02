import type { DungeonEvent } from '@/types'
import { GiFlame } from 'react-icons/gi'

export const INFERNO_BEASTS: DungeonEvent = {
  id: 'inferno-beasts',
  type: 'combat',
  title: 'Inferno Beasts',
  description: 'Creatures of living flame roar and charge!',
  choices: [
    {
      text: 'Fight through fire',
      outcome: {
        text: 'Their heat is unbearable!',
        effects: [
          { type: 'damage', target: 'all', value: 36 },
          { type: 'xp', value: 168 },
          { type: 'gold', value: 116 },
        ],
      },
    },
    {
      text: 'Resist heat (Defense check)',
      requirements: { stat: 'defense', minValue: 63 },
      outcome: {
        text: 'You endure the flames!',
        effects: [
          { type: 'damage', target: 'all', value: 26 },
          { type: 'xp', value: 188 },
          { type: 'gold', value: 136 },
        ],
      },
    },
  ],
  depth: 25,
  icon: GiFlame,
}
