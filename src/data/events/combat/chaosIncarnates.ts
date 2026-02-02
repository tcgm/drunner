import type { DungeonEvent } from '@/types'
import { GiAbstract053 } from 'react-icons/gi'

export const CHAOS_INCARNATES: DungeonEvent = {
  id: 'chaos-incarnates',
  type: 'combat',
  title: 'Chaos Incarnates',
  description: 'Pure chaos given form attacks with complete unpredictability!',
  choices: [
    {
      text: 'Embrace chaos',
      outcome: {
        text: 'Random devastation strikes!',
        effects: [
          { type: 'damage', target: 'all', value: 143 },
          { type: 'xp', value: 755 },
          { type: 'gold', value: 615 },
        ],
      },
    },
    {
      text: 'Impose order (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You force structure on chaos!',
        effects: [
          { type: 'damage', target: 'all', value: 132 },
          { type: 'xp', value: 775 },
          { type: 'gold', value: 635 },
        ],
      },
    },
  ],
  depth: 86,
  icon: GiAbstract053,
}
