import type { DungeonEvent } from '@/types'
import { GiVenomFlask } from 'react-icons/gi'

export const POISON_BLOOM: DungeonEvent = {
  id: 'poison-bloom',
  type: 'combat',
  title: 'Poison Bloom',
  description: 'Toxic flowers release clouds of lethal pollen!',
  choices: [
    {
      text: 'Burn them',
      outcome: {
        text: 'The smoke still poisons you!',
        effects: [
          { type: 'damage', target: 'all', value: 20 },
          { type: 'xp', value: 105 },
          { type: 'gold', value: 63 },
        ],
      },
    },
    {
      text: 'Hold breath (Defense check)',
      requirements: { stat: 'defense', minValue: 48 },
      outcome: {
        text: 'You avoid inhaling the toxins!',
        effects: [
          { type: 'damage', target: 'all', value: 14 },
          { type: 'xp', value: 125 },
          { type: 'gold', value: 78 },
        ],
      },
    },
  ],
  depth: 15,
  icon: GiVenomFlask,
}
