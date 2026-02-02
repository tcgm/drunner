import type { DungeonEvent } from '@/types'
import { GiAbstract023 } from 'react-icons/gi'

export const NULL_ZONES: DungeonEvent = {
  id: 'null-zones',
  type: 'combat',
  title: 'Null Zones',
  description: 'Areas of negation given form attack to nullify existence!',
  choices: [
    {
      text: 'Fight the void',
      outcome: {
        text: 'They negate your being!',
        effects: [
          { type: 'damage', target: 'random', value: 106 },
          { type: 'xp', value: 560 },
          { type: 'gold', value: 430 },
        ],
      },
    },
    {
      text: 'Affirm existence (Defense check)',
      requirements: { stat: 'defense', minValue: 155 },
      outcome: {
        text: 'You refuse negation!',
        effects: [
          { type: 'damage', target: 'random', value: 95 },
          { type: 'xp', value: 580 },
          { type: 'gold', value: 450 },
        ],
      },
    },
  ],
  depth: 68,
  icon: GiAbstract023,
}
