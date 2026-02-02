import type { DungeonEvent } from '@/types'
import { GiPoisonGas } from 'react-icons/gi'

export const TOXIC_FUNGI: DungeonEvent = {
  id: 'toxic-fungi',
  type: 'combat',
  title: 'Toxic Fungi',
  description: 'Mushroom monsters release poisonous spores!',
  choices: [
    {
      text: 'Crush them quickly',
      outcome: {
        text: 'Spores choke your lungs!',
        effects: [
          { type: 'damage', target: 'weakest', value: 12 },
          { type: 'xp', value: 44 },
          { type: 'gold', value: 26 },
        ],
      },
    },
    {
      text: 'Hold your breath (Defense check)',
      requirements: { stat: 'defense', minValue: 18 },
      outcome: {
        text: 'You avoid the spores!',
        effects: [
          { type: 'damage', target: 'weakest', value: 7 },
          { type: 'xp', value: 54 },
          { type: 'gold', value: 32 },
        ],
      },
    },
  ],
  depth: 6,
  icon: GiPoisonGas,
}
