import type { DungeonEvent } from '@/types'
import { GiDeadWood } from 'react-icons/gi'

export const WITHER_TREES: DungeonEvent = {
  id: 'wither-trees',
  type: 'combat',
  title: 'Wither Trees',
  description: 'Corrupted treants spread death and decay!',
  choices: [
    {
      text: 'Chop them down',
      outcome: {
        text: 'Their roots spread poison!',
        effects: [
          { type: 'damage', target: 'all', value: 9 },
          { type: 'xp', value: 36 },
          { type: 'gold', value: 19 },
        ],
      },
    },
    {
      text: 'Burn them (Strength check)',
      requirements: { stat: 'attack', minValue: 8 },
      outcome: {
        text: 'Fire purges the corruption!',
        effects: [
          { type: 'damage', target: 'all', value: 5 },
          { type: 'xp', value: 46 },
          { type: 'gold', value: 25 },
        ],
      },
    },
  ],
  depth: 3,
  icon: GiDeadWood,
}
