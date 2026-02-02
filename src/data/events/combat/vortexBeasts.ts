import type { DungeonEvent } from '@/types'
import { GiVortex } from 'react-icons/gi'

export const VORTEX_BEASTS: DungeonEvent = {
  id: 'vortex-beasts',
  type: 'combat',
  title: 'Vortex Beasts',
  description: 'Creatures made of swirling energy tear at reality!',
  choices: [
    {
      text: 'Pierce the vortex',
      outcome: {
        text: 'You are pulled into chaos!',
        effects: [
          { type: 'damage', target: 'random', value: 91 },
          { type: 'xp', value: 483 },
          { type: 'gold', value: 365 },
        ],
      },
    },
    {
      text: 'Stabilize reality (Strength check)',
      requirements: { stat: 'strength', minValue: 142 },
      outcome: {
        text: 'You force them to solidify!',
        effects: [
          { type: 'damage', target: 'random', value: 80 },
          { type: 'xp', value: 503 },
          { type: 'gold', value: 385 },
        ],
      },
    },
  ],
  depth: 61,
  icon: GiVortex,
}
