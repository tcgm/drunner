import type { DungeonEvent } from '@/types'
import { GiSpinningSword } from 'react-icons/gi'

export const VORTEX_KNIGHTS: DungeonEvent = {
  id: 'vortex-knights',
  type: 'combat',
  title: 'Vortex Knights',
  description: 'Armored warriors that create whirlwinds of blades!',
  choices: [
    {
      text: 'Weather the blade storm',
      outcome: {
        text: 'A thousand cuts bleed you!',
        effects: [
          { type: 'damage', target: 'all', value: 93 },
          { type: 'xp', value: 493 },
          { type: 'gold', value: 373 },
        ],
      },
    },
    {
      text: 'Break their formation (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'You shatter their coordination!',
        effects: [
          { type: 'damage', target: 'all', value: 82 },
          { type: 'xp', value: 513 },
          { type: 'gold', value: 393 },
        ],
      },
    },
  ],
  depth: 60,
  icon: GiSpinningSword,
}
