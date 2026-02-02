import type { DungeonEvent } from '@/types'
import { GiCrystalBall } from 'react-icons/gi'

export const ARCANE_CONSTRUCTS: DungeonEvent = {
  id: 'arcane-constructs',
  type: 'combat',
  title: 'Arcane Constructs',
  description: 'Magical automatons powered by pure arcane energy!',
  choices: [
    {
      text: 'Destroy them',
      outcome: {
        text: 'They explode in magical force!',
        effects: [
          { type: 'damage', target: 'all', value: 46 },
          { type: 'xp', value: 235 },
          { type: 'gold', value: 160 },
        ],
      },
    },
    {
      text: 'Dispel magic (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You shut down their power source!',
        effects: [
          { type: 'damage', target: 'all', value: 35 },
          { type: 'xp', value: 255 },
          { type: 'gold', value: 180 },
        ],
      },
    },
  ],
  depth: 35,
  icon: GiCrystalBall,
}
