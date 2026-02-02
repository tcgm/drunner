import type { DungeonEvent } from '@/types'
import { GiClawHammer } from 'react-icons/gi'

export const IRON_TITANS: DungeonEvent = {
  id: 'iron-titans',
  type: 'combat',
  title: 'Iron Titans',
  description: 'Colossal metal warriors swing building-sized weapons!',
  choices: [
    {
      text: 'Fight defensively',
      outcome: {
        text: 'Each blow shakes the ground!',
        effects: [
          { type: 'damage', target: 'all', value: 39 },
          { type: 'xp', value: 178 },
          { type: 'gold', value: 124 },
        ],
      },
    },
    {
      text: 'Weathering stance (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'You stand firm against their might!',
        effects: [
          { type: 'damage', target: 'all', value: 29 },
          { type: 'xp', value: 198 },
          { type: 'gold', value: 144 },
        ],
      },
    },
  ],
  depth: 26,
  icon: GiClawHammer,
}
