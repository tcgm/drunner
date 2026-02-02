import type { DungeonEvent } from '@/types'
import { GiDaggerRose } from 'react-icons/gi'

export const THORN_DANCERS: DungeonEvent = {
  id: 'thorn-dancers',
  type: 'combat',
  title: 'Thorn Dancers',
  description: 'Graceful fey beings dance through combat, their movements deadly!',
  choices: [
    {
      text: 'Chase them',
      outcome: {
        text: 'Their dance keeps you off-balance!',
        effects: [
          { type: 'damage', target: 'weakest', value: 28 },
          { type: 'xp', value: 119 },
          { type: 'gold', value: 74 },
        ],
      },
    },
    {
      text: 'Predict patterns (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You anticipate their movements!',
        effects: [
          { type: 'damage', target: 'weakest', value: 20 },
          { type: 'xp', value: 139 },
          { type: 'gold', value: 89 },
        ],
      },
    },
  ],
  depth: 19,
  icon: GiDaggerRose,
}
