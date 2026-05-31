import type { DungeonEvent } from '@/types'
import { GiStarSwirl } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const ASTRAL_HORRORS: DungeonEvent = {
  id: 'astral-horrors',
  type: 'combat',
  tags: [TAGS.COSMIC, TAGS.ABERRATION, TAGS.ETHEREAL],
  title: 'Astral Horrors',
  description: 'Creatures from beyond the veil phase in and out of reality!',
  choices: [
    {
      text: 'Attack when solid',
      outcome: {
        text: 'They phase through your attacks!',
        effects: [
          { type: 'damage', target: 'weakest', value: 33 },
          { type: 'xp', value: 132 },
          { type: 'gold', value: 82 },
        ],
      },
    },
    {
      text: 'Magic disruption (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You anchor them to reality!',
        effects: [
          { type: 'damage', target: 'weakest', value: 24 },
          { type: 'xp', value: 148 },
          { type: 'gold', value: 95 },
        ],
      },
    },
  ],
  depth: 18,
  icon: GiStarSwirl,
}
