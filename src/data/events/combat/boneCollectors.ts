import type { DungeonEvent } from '@/types'
import { GiBoneKnife } from 'react-icons/gi'

export const BONE_COLLECTORS: DungeonEvent = {
  id: 'bone-collectors',
  type: 'combat',
  title: 'Bone Collectors',
  description: 'Cloaked figures wielding bone weapons advance silently!',
  choices: [
    {
      text: 'Engage in combat',
      outcome: {
        text: 'You fight the sinister collectors!',
        effects: [
          { type: 'damage', target: 'strongest', value: 11 },
          { type: 'xp', value: 40 },
          { type: 'gold', value: 20 },
        ],
      },
    },
    {
      text: 'Power through (Strength check)',
      requirements: { stat: 'strength', minValue: 13 },
      outcome: {
        text: 'You overpower their defenses!',
        effects: [
          { type: 'damage', target: 'strongest', value: 7 },
          { type: 'xp', value: 50 },
          { type: 'gold', value: 28 },
        ],
      },
    },
  ],
  depth: 4,
  icon: GiBoneKnife,
}
