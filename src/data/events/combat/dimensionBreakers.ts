import type { DungeonEvent } from '@/types'
import { GiArmoredPants } from 'react-icons/gi'

export const DIMENSION_BREAKERS: DungeonEvent = {
  id: 'dimension-breakers',
  type: 'combat',
  title: 'Dimension Breakers',
  description: 'Beings that shatter dimensional barriers attack from fractured realities!',
  choices: [
    {
      text: 'Fight across dimensions',
      outcome: {
        text: 'Reality splinters around you!',
        effects: [
          { type: 'damage', target: 'random', value: 110 },
          { type: 'xp', value: 580 },
          { type: 'gold', value: 460 },
        ],
      },
    },
    {
      text: 'Dimensional anchor (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You stabilize reality!',
        effects: [
          { type: 'damage', target: 'random', value: 99 },
          { type: 'xp', value: 600 },
          { type: 'gold', value: 480 },
        ],
      },
    },
  ],
  depth: 74,
  icon: GiArmoredPants,
}
