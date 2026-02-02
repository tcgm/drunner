import type { DungeonEvent } from '@/types'
import { GiGreaves } from 'react-icons/gi'

export const IRON_AUTOMATONS: DungeonEvent = {
  id: 'iron-automatons',
  type: 'combat',
  title: 'Iron Automatons',
  description: 'Mechanical warriors programmed for combat!',
  choices: [
    {
      text: 'Fight their efficiency',
      outcome: {
        text: 'Precise strikes hit hard!',
        effects: [
          { type: 'damage', target: 'all', value: 32 },
          { type: 'xp', value: 125 },
          { type: 'gold', value: 78 },
        ],
      },
    },
    {
      text: 'Exploit weaknesses (Strength check)',
      requirements: { stat: 'attack', minValue: 49 },
      outcome: {
        text: 'You tear apart their joints!',
        effects: [
          { type: 'damage', target: 'all', value: 24 },
          { type: 'xp', value: 140 },
          { type: 'gold', value: 88 },
        ],
      },
    },
  ],
  depth: 25,
  icon: GiGreaves,
}
