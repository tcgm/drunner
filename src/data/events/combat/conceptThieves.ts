import type { DungeonEvent } from '@/types'
import { GiAbstract085 } from 'react-icons/gi'

export const CONCEPT_THIEVES: DungeonEvent = {
  id: 'concept-thieves',
  type: 'combat',
  title: 'Concept Thieves',
  description: 'Entities that steal abstract ideas and identities!',
  choices: [
    {
      text: 'Protect your identity',
      outcome: {
        text: 'They steal pieces of who you are!',
        effects: [
          { type: 'damage', target: 'random', value: 163 },
          { type: 'xp', value: 871 },
          { type: 'gold', value: 677 },
        ],
      },
    },
    {
      text: 'Reinforce self (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Faith anchors your being!',
        effects: [
          { type: 'damage', target: 'random', value: 152 },
          { type: 'xp', value: 891 },
          { type: 'gold', value: 697 },
        ],
      },
    },
  ],
  depth: 85,
  icon: GiAbstract085,
}
