import type { DungeonEvent } from '@/types'
import { GiSeaSerpent } from 'react-icons/gi'

export const BASILISKS: DungeonEvent = {
  id: 'basilisks',
  type: 'combat',
  title: 'Basilisks',
  description: 'Serpentine creatures with petrifying gazes slither toward you!',
  choices: [
    {
      text: 'Avert eyes and fight',
      outcome: {
        text: 'You fight blind to avoid their gaze!',
        effects: [
          { type: 'damage', target: 'random', value: 30 },
          { type: 'xp', value: 125 },
          { type: 'gold', value: 78 },
        ],
      },
    },
    {
      text: 'Use reflection (Defense check)',
      requirements: { stat: 'defense', minValue: 50 },
      outcome: {
        text: 'You turn their gaze against them!',
        effects: [
          { type: 'damage', target: 'random', value: 21 },
          { type: 'xp', value: 145 },
          { type: 'gold', value: 93 },
        ],
      },
    },
  ],
  depth: 20,
  icon: GiSeaSerpent,
}
