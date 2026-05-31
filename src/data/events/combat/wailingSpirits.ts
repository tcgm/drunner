import type { DungeonEvent } from '@/types'
import { GiGhost } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const WAILING_SPIRITS: DungeonEvent = {
  id: 'wailing-spirits',
  type: 'combat',
  tags: [TAGS.SPIRIT, TAGS.UNDEAD, TAGS.ETHEREAL],
  title: 'Wailing Spirits',
  description: 'Ghostly forms shriek and wail, chilling you to the bone!',
  choices: [
    {
      text: 'Fight through fear',
      outcome: {
        text: 'You steel yourself and attack!',
        effects: [
          { type: 'damage', target: 'all', value: 11 },
          { type: 'xp', value: 44 },
          { type: 'gold', value: 23 },
        ],
      },
    },
    {
      text: 'Banish them (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Holy power disperses the spirits!',
        effects: [
          { type: 'damage', target: 'all', value: 6 },
          { type: 'xp', value: 54 },
          { type: 'gold', value: 31 },
        ],
      },
    },
  ],
  depth: 9,
  icon: GiGhost,
}
