import type { DungeonEvent } from '@/types'
import { GiBatWing } from 'react-icons/gi'

export const SHADOW_BATS: DungeonEvent = {
  id: 'shadow-bats',
  type: 'combat',
  title: 'Shadow Bats',
  description: 'A swarm of dark-winged creatures fills the chamber!',
  choices: [
    {
      text: 'Swing wildly',
      outcome: {
        text: 'You hit many but they overwhelm you!',
        effects: [
          { type: 'damage', target: 'all', value: 16 },
          { type: 'xp', value: 72 },
          { type: 'gold', value: 43 },
        ],
      },
    },
    {
      text: 'Area effect (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Magic devastates the swarm!',
        effects: [
          { type: 'damage', target: 'all', value: 11 },
          { type: 'xp', value: 87 },
          { type: 'gold', value: 53 },
        ],
      },
    },
  ],
  depth: 11,
  icon: GiBatWing,
}
