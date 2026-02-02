import type { DungeonEvent } from '@/types'
import { GiWhirlwind } from 'react-icons/gi'

export const TEMPEST_LORDS: DungeonEvent = {
  id: 'tempest-lords',
  type: 'combat',
  title: 'Tempest Lords',
  description: 'Elemental rulers of storms attack with wind and lightning!',
  choices: [
    {
      text: 'Weather the storm',
      outcome: {
        text: 'Lightning strikes repeatedly!',
        effects: [
          { type: 'damage', target: 'all', value: 79 },
          { type: 'xp', value: 393 },
          { type: 'gold', value: 284 },
        ],
      },
    },
    {
      text: 'Ground the lightning (Defense check)',
      requirements: { stat: 'defense', minValue: 122 },
      outcome: {
        text: 'You redirect their power!',
        effects: [
          { type: 'damage', target: 'all', value: 68 },
          { type: 'xp', value: 413 },
          { type: 'gold', value: 304 },
        ],
      },
    },
  ],
  depth: 58,
  icon: GiWhirlwind,
}
