import type { DungeonEvent } from '@/types'
import { GiAbstract071 } from 'react-icons/gi'

export const REALITY_EATERS: DungeonEvent = {
  id: 'reality-eaters',
  type: 'combat',
  title: 'Reality Eaters',
  description: 'Cosmic devourers that consume the fabric of reality itself!',
  choices: [
    {
      text: 'Defend reality',
      outcome: {
        text: 'They eat holes in existence!',
        effects: [
          { type: 'damage', target: 'weakest', value: 162 },
          { type: 'xp', value: 835 },
          { type: 'gold', value: 695 },
        ],
      },
    },
    {
      text: 'Reality weaving (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You repair reality faster than they eat!',
        effects: [
          { type: 'damage', target: 'weakest', value: 151 },
          { type: 'xp', value: 855 },
          { type: 'gold', value: 715 },
        ],
      },
    },
  ],
  depth: 93,
  icon: GiAbstract071,
}
