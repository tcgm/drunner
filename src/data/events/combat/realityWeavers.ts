import type { DungeonEvent } from '@/types'
import { GiAbstract040 } from 'react-icons/gi'

export const REALITY_WEAVERS: DungeonEvent = {
  id: 'reality-weavers',
  type: 'combat',
  title: 'Reality Weavers',
  description: 'Entities that reshape reality itself attack your existence!',
  choices: [
    {
      text: 'Resist their power',
      outcome: {
        text: 'Reality bends around you!',
        effects: [
          { type: 'damage', target: 'all', value: 68 },
          { type: 'xp', value: 350 },
          { type: 'gold', value: 252 },
        ],
      },
    },
    {
      text: 'Existential anchor (Defense check)',
      requirements: { stat: 'defense', minValue: 115 },
      outcome: {
        text: 'You maintain your reality!',
        effects: [
          { type: 'damage', target: 'all', value: 57 },
          { type: 'xp', value: 370 },
          { type: 'gold', value: 272 },
        ],
      },
    },
  ],
  depth: 50,
  icon: GiAbstract040,
}
