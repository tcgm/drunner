import type { DungeonEvent } from '@/types'
import { GiAbstract117 } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const STAR_SPAWN: DungeonEvent = {
  id: 'star-spawn',
  type: 'combat',
  tags: [TAGS.COSMIC, TAGS.ABERRATION, TAGS.COSMIC_ENV],
  title: 'Star Spawn',
  description: 'Children of dying stars radiate lethal cosmic energy!',
  choices: [
    {
      text: 'Withstand stellar radiation',
      outcome: {
        text: 'Cosmic rays burn through you!',
        effects: [
          { type: 'damage', target: 'strongest', value: 74 },
          { type: 'xp', value: 365 },
          { type: 'gold', value: 263 },
        ],
      },
    },
    {
      text: 'Protective magic (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Magical shields absorb radiation!',
        effects: [
          { type: 'damage', target: 'strongest', value: 63 },
          { type: 'xp', value: 385 },
          { type: 'gold', value: 283 },
        ],
      },
    },
  ],
  depth: 53,
  icon: GiAbstract117,
}
