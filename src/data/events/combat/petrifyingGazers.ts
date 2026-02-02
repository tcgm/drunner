import type { DungeonEvent } from '@/types'
import { GiCrystalEye } from 'react-icons/gi'

export const PETRIFYING_GAZERS: DungeonEvent = {
  id: 'petrifying-gazers',
  type: 'combat',
  title: 'Petrifying Gazers',
  description: 'Multi-eyed horrors whose stare turns flesh to stone!',
  choices: [
    {
      text: 'Look away and fight blind',
      outcome: {
        text: 'You struggle without sight!',
        effects: [
          { type: 'damage', target: 'strongest', value: 29 },
          { type: 'xp', value: 118 },
          { type: 'gold', value: 74 },
        ],
      },
    },
    {
      text: 'Use a mirror (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'They petrify themselves!',
        effects: [
          { type: 'damage', target: 'strongest', value: 19 },
          { type: 'xp', value: 133 },
          { type: 'gold', value: 85 },
        ],
      },
    },
  ],
  depth: 24,
  icon: GiCrystalEye,
}
