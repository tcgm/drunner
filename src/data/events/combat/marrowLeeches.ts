import type { DungeonEvent } from '@/types'
import { GiBoneKnife } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const MARROW_LEECHES: DungeonEvent = {
  id: 'marrow-leeches',
  type: 'combat',
  tags: [TAGS.UNDEAD, TAGS.INSECT, TAGS.BLOOD, TAGS.CAVE],
  title: 'Marrow Leeches',
  description: 'Parasites that drain essence from bones!',
  choices: [
    {
      text: 'Burn them off',
      outcome: {
        text: 'They burrow deeper first!',
        effects: [
          { type: 'damage', target: 'weakest', value: 42 },
          { type: 'xp', value: 221 },
          { type: 'gold', value: 152 },
        ],
      },
    },
    {
      text: 'Purge the infestation (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine power expels them!',
        effects: [
          { type: 'damage', target: 'weakest', value: 31 },
          { type: 'xp', value: 241 },
          { type: 'gold', value: 172 },
        ],
      },
    },
  ],
  depth: 35,
  icon: GiBoneKnife,
}
