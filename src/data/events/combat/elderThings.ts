import type { DungeonEvent } from '@/types'
import { GiAbstract080 } from 'react-icons/gi'

export const ELDER_THINGS: DungeonEvent = {
  id: 'elder-things',
  type: 'combat',
  title: 'Elder Things',
  description: 'Ancient cosmic horrors that defy all natural law!',
  choices: [
    {
      text: 'Confront cosmic horror',
      outcome: {
        text: 'Sanity-breaking power overwhelms!',
        effects: [
          { type: 'damage', target: 'weakest', value: 165 },
          { type: 'xp', value: 850 },
          { type: 'gold', value: 720 },
        ],
      },
    },
    {
      text: 'Unwavering mind (Defense check)',
      requirements: { stat: 'defense', minValue: 195 },
      outcome: {
        text: 'Your mind remains unbroken!',
        effects: [
          { type: 'damage', target: 'weakest', value: 154 },
          { type: 'xp', value: 870 },
          { type: 'gold', value: 740 },
        ],
      },
    },
  ],
  depth: 95,
  icon: GiAbstract080,
}
