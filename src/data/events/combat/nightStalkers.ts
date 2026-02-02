import type { DungeonEvent } from '@/types'
import { GiWingCloak } from 'react-icons/gi'

export const NIGHT_STALKERS: DungeonEvent = {
  id: 'night-stalkers',
  type: 'combat',
  title: 'Night Stalkers',
  description: 'Vampiric hunters glide silently through darkness!',
  choices: [
    {
      text: 'Face them in shadow',
      outcome: {
        text: 'They drain your blood!',
        effects: [
          { type: 'damage', target: 'weakest', value: 22 },
          { type: 'xp', value: 96 },
          { type: 'gold', value: 59 },
        ],
      },
    },
    {
      text: 'Purge the darkness (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Holy light repels them!',
        effects: [
          { type: 'damage', target: 'weakest', value: 17 },
          { type: 'xp', value: 111 },
          { type: 'gold', value: 69 },
        ],
      },
    },
  ],
  depth: 19,
  icon: GiWingCloak,
}
