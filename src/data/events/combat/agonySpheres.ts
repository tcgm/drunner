import type { DungeonEvent } from '@/types'
import { GiSpikeball } from 'react-icons/gi'

export const AGONY_SPHERES: DungeonEvent = {
  id: 'agony-spheres',
  type: 'combat',
  title: 'Agony Spheres',
  description: 'Orbs of concentrated suffering attack your mind!',
  choices: [
    {
      text: 'Resist the pain',
      outcome: {
        text: 'Agony overwhelms your senses!',
        effects: [
          { type: 'damage', target: 'all', value: 129 },
          { type: 'xp', value: 689 },
          { type: 'gold', value: 533 },
        ],
      },
    },
    {
      text: 'Dispel the suffering (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Peace counters agony!',
        effects: [
          { type: 'damage', target: 'all', value: 118 },
          { type: 'xp', value: 709 },
          { type: 'gold', value: 553 },
        ],
      },
    },
  ],
  depth: 74,
  icon: GiSpikeball,
}
