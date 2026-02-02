import type { DungeonEvent } from '@/types'
import { GiAbstract025 } from 'react-icons/gi'

export const PRIMORDIAL_TITANS: DungeonEvent = {
  id: 'primordial-titans',
  type: 'combat',
  title: 'Primordial Titans',
  description: 'Ancient beings that predate reality itself awaken!',
  choices: [
    {
      text: 'Challenge the primordials',
      outcome: {
        text: 'Their age-old power crushes you!',
        effects: [
          { type: 'damage', target: 'all', value: 140 },
          { type: 'xp', value: 740 },
          { type: 'gold', value: 590 },
        ],
      },
    },
    {
      text: 'Ancient strength (Strength check)',
      requirements: { stat: 'strength', minValue: 205 },
      outcome: {
        text: 'Your power rivals theirs!',
        effects: [
          { type: 'damage', target: 'all', value: 129 },
          { type: 'xp', value: 760 },
          { type: 'gold', value: 610 },
        ],
      },
    },
  ],
  depth: 85,
  icon: GiAbstract025,
}
