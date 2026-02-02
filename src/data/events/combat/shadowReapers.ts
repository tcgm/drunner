import type { DungeonEvent } from '@/types'
import { GiWingCloak } from 'react-icons/gi'

export const SHADOW_REAPERS: DungeonEvent = {
  id: 'shadow-reapers',
  type: 'combat',
  title: 'Shadow Reapers',
  description: 'Cloaked figures wielding scythes harvest souls!',
  choices: [
    {
      text: 'Face death itself',
      outcome: {
        text: 'Their scythes reap life energy!',
        effects: [
          { type: 'damage', target: 'strongest', value: 56 },
          { type: 'xp', value: 272 },
          { type: 'gold', value: 192 },
        ],
      },
    },
    {
      text: 'Life affirmation (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine vitality shields you!',
        effects: [
          { type: 'damage', target: 'strongest', value: 45 },
          { type: 'xp', value: 292 },
          { type: 'gold', value: 208 },
        ],
      },
    },
  ],
  depth: 42,
  icon: GiWingCloak,
}
