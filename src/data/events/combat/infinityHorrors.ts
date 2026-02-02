import type { DungeonEvent } from '@/types'
import { GiInfinity } from 'react-icons/gi'

export const INFINITY_HORRORS: DungeonEvent = {
  id: 'infinity-horrors',
  type: 'combat',
  title: 'Infinity Horrors',
  description: 'Beings from beyond infinity that defy comprehension!',
  choices: [
    {
      text: 'Accept the infinite',
      outcome: {
        text: 'Your mind expands painfully!',
        effects: [
          { type: 'damage', target: 'all', value: 192 },
          { type: 'xp', value: 982 },
          { type: 'gold', value: 780 },
        ],
      },
    },
    {
      text: 'Limit the limitless (Speed check)',
      requirements: { stat: 'speed', minValue: 205 },
      outcome: {
        text: 'You force boundaries upon them!',
        effects: [
          { type: 'damage', target: 'all', value: 181 },
          { type: 'xp', value: 1002 },
          { type: 'gold', value: 800 },
        ],
      },
    },
  ],
  depth: 97,
  icon: GiInfinity,
}
