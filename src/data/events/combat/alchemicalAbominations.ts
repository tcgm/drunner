import type { DungeonEvent } from '@/types'
import { GiSpiralBottle } from 'react-icons/gi'

export const ALCHEMICAL_ABOMINATIONS: DungeonEvent = {
  id: 'alchemical-abominations',
  type: 'combat',
  title: 'Alchemical Abominations',
  description: 'Failed experiments bubble and gurgle as they attack!',
  choices: [
    {
      text: 'Destroy them',
      outcome: {
        text: 'They explode in chemical reactions!',
        effects: [
          { type: 'damage', target: 'all', value: 17 },
          { type: 'xp', value: 73 },
          { type: 'gold', value: 44 },
        ],
      },
    },
    {
      text: 'Contain reactions (Defense check)',
      requirements: { stat: 'defense', minValue: 31 },
      outcome: {
        text: 'You minimize the explosions!',
        effects: [
          { type: 'damage', target: 'all', value: 12 },
          { type: 'xp', value: 88 },
          { type: 'gold', value: 54 },
        ],
      },
    },
  ],
  depth: 12,
  icon: GiSpiralBottle,
}
