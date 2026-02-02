import type { DungeonEvent } from '@/types'
import { GiSandSnake } from 'react-icons/gi'

export const SAND_VIPERS: DungeonEvent = {
  id: 'sand-vipers',
  type: 'combat',
  title: 'Sand Vipers',
  description: 'Camouflaged serpents strike from dusty corners!',
  choices: [
    {
      text: 'Fight them',
      outcome: {
        text: 'Their bites inject venom!',
        effects: [
          { type: 'damage', target: 'random', value: 15 },
          { type: 'xp', value: 51 },
          { type: 'gold', value: 29 },
        ],
      },
    },
    {
      text: 'Spot them first (Speed check)',
      requirements: { stat: 'speed', minValue: 17 },
      outcome: {
        text: 'You strike before they can!',
        effects: [
          { type: 'damage', target: 'random', value: 10 },
          { type: 'xp', value: 61 },
          { type: 'gold', value: 35 },
        ],
      },
    },
  ],
  depth: 10,
  icon: GiSandSnake,
}
