import type { DungeonEvent } from '@/types'
import { GiBeastEye } from 'react-icons/gi'

export const LURKING_HORRORS: DungeonEvent = {
  id: 'lurking-horrors',
  type: 'combat',
  title: 'Lurking Horrors',
  description: 'Unseen predators attack from dark corners!',
  choices: [
    {
      text: 'Face the unknown',
      outcome: {
        text: 'They strike from shadow!',
        effects: [
          { type: 'damage', target: 'weakest', value: 16 },
          { type: 'xp', value: 73 },
          { type: 'gold', value: 45 },
        ],
      },
    },
    {
      text: 'Sense their presence (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You predict their attacks!',
        effects: [
          { type: 'damage', target: 'weakest', value: 11 },
          { type: 'xp', value: 88 },
          { type: 'gold', value: 55 },
        ],
      },
    },
  ],
  depth: 14,
  icon: GiBeastEye,
}
