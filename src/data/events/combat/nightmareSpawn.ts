import type { DungeonEvent } from '@/types'
import { GiBatMask } from 'react-icons/gi'

export const NIGHTMARE_SPAWN: DungeonEvent = {
  id: 'nightmare-spawn',
  type: 'combat',
  title: 'Nightmare Spawn',
  description: 'Manifestations of fear take physical form!',
  choices: [
    {
      text: 'Face your fears',
      outcome: {
        text: 'Your own terrors turn against you!',
        effects: [
          { type: 'damage', target: 'all', value: 26 },
          { type: 'xp', value: 114 },
          { type: 'gold', value: 70 },
        ],
      },
    },
    {
      text: 'Banish nightmares (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Holy light dispels the darkness!',
        effects: [
          { type: 'damage', target: 'all', value: 18 },
          { type: 'xp', value: 134 },
          { type: 'gold', value: 85 },
        ],
      },
    },
  ],
  depth: 16,
  icon: GiBatMask,
}
