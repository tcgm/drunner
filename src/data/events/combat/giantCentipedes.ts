import type { DungeonEvent } from '@/types'
import { GiCentipede } from 'react-icons/gi'

export const GIANT_CENTIPEDES: DungeonEvent = {
  id: 'giant-centipedes',
  type: 'combat',
  title: 'Giant Centipedes',
  description: 'Massive centipedes with hundreds of legs surge forward!',
  choices: [
    {
      text: 'Strike them down',
      outcome: {
        text: 'You battle the writhing arthropods!',
        effects: [
          { type: 'damage', target: 'random', value: 12 },
          { type: 'xp', value: 40 },
          { type: 'gold', value: 20 },
        ],
      },
    },
    {
      text: 'Sever segments (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You slice them into pieces!',
        effects: [
          { type: 'damage', target: 'random', value: 7 },
          { type: 'xp', value: 50 },
          { type: 'gold', value: 28 },
        ],
      },
    },
  ],
  depth: 4,
  icon: GiCentipede,
}
