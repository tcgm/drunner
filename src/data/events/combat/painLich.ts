import type { DungeonEvent } from '@/types'
import { GiCrownOfThorns } from 'react-icons/gi'

export const PAIN_LICH: DungeonEvent = {
  id: 'pain-lich',
  type: 'combat',
  title: 'Pain Lich',
  description: 'An undead sorcerer sustained by suffering attacks with agony magic!',
  choices: [
    {
      text: 'Endure the pain',
      outcome: {
        text: 'Waves of agony assault you!',
        effects: [
          { type: 'damage', target: 'all', value: 104 },
          { type: 'xp', value: 545 },
          { type: 'gold', value: 420 },
        ],
      },
    },
    {
      text: 'Holy purification (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine grace ends their suffering!',
        effects: [
          { type: 'damage', target: 'all', value: 93 },
          { type: 'xp', value: 565 },
          { type: 'gold', value: 440 },
        ],
      },
    },
  ],
  depth: 68,
  icon: GiCrownOfThorns,
}
