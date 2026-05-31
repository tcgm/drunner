import type { DungeonEvent } from '@/types'
import { GiDrippingSword } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const BLOOD_GUARDIANS: DungeonEvent = {
  id: 'blood-guardians',
  type: 'combat',
  tags: [TAGS.UNDEAD, TAGS.BLOOD, TAGS.DEMON],
  title: 'Blood Guardians',
  description: 'Warriors who have bound their life force to their weapons!',
  choices: [
    {
      text: 'Cut them down',
      outcome: {
        text: 'Their blood magic empowers them!',
        effects: [
          { type: 'damage', target: 'strongest', value: 34 },
          { type: 'xp', value: 136 },
          { type: 'gold', value: 86 },
        ],
      },
    },
    {
      text: 'Sever the bond (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You break their blood magic!',
        effects: [
          { type: 'damage', target: 'strongest', value: 24 },
          { type: 'xp', value: 151 },
          { type: 'gold', value: 97 },
        ],
      },
    },
  ],
  depth: 21,
  icon: GiDrippingSword,
}
