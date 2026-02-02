import type { DungeonEvent } from '@/types'
import { GiBlackHoleBolas } from 'react-icons/gi'

export const GRAVITY_WEAVERS: DungeonEvent = {
  id: 'gravity-weavers',
  type: 'combat',
  title: 'Gravity Weavers',
  description: 'Beings that manipulate gravity crush and pull at you!',
  choices: [
    {
      text: 'Fight through it',
      outcome: {
        text: 'The increased gravity slows you!',
        effects: [
          { type: 'damage', target: 'strongest', value: 26 },
          { type: 'xp', value: 113 },
          { type: 'gold', value: 69 },
        ],
      },
    },
    {
      text: 'Counter magic (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You dispel their gravity field!',
        effects: [
          { type: 'damage', target: 'strongest', value: 18 },
          { type: 'xp', value: 133 },
          { type: 'gold', value: 84 },
        ],
      },
    },
  ],
  depth: 15,
  icon: GiBlackHoleBolas,
}
