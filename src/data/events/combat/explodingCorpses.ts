import type { DungeonEvent } from '@/types'
import { GiMineExplosion } from 'react-icons/gi'

export const EXPLODING_CORPSES: DungeonEvent = {
  id: 'exploding-corpses',
  type: 'combat',
  title: 'Exploding Corpses',
  description: 'Bloated bodies lurch forward, ready to detonate!',
  choices: [
    {
      text: 'Fight up close',
      outcome: {
        text: 'They explode as you strike them!',
        effects: [
          { type: 'damage', target: 'all', value: 15 },
          { type: 'xp', value: 46 },
          { type: 'gold', value: 24 },
        ],
      },
    },
    {
      text: 'Keep distance (Speed check)',
      requirements: { stat: 'speed', minValue: 13 },
      outcome: {
        text: 'You trigger them from afar!',
        effects: [
          { type: 'damage', target: 'all', value: 8 },
          { type: 'xp', value: 56 },
          { type: 'gold', value: 32 },
        ],
      },
    },
  ],
  depth: 8,
  icon: GiMineExplosion,
}
