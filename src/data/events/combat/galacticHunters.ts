import type { DungeonEvent } from '@/types'
import { GiCometSpark } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const GALACTIC_HUNTERS: DungeonEvent = {
  id: 'galactic-hunters',
  type: 'combat',
  tags: [TAGS.COSMIC, TAGS.ABERRATION, TAGS.COSMIC_ENV],
  title: 'Galactic Hunters',
  description: 'Predators that hunt across galaxies set their sights on you!',
  choices: [
    {
      text: 'Become the prey',
      outcome: {
        text: 'They never miss their mark!',
        effects: [
          { type: 'damage', target: 'weakest', value: 112 },
          { type: 'xp', value: 590 },
          { type: 'gold', value: 470 },
        ],
      },
    },
    {
      text: 'Become the hunter (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You turn the tables!',
        effects: [
          { type: 'damage', target: 'weakest', value: 101 },
          { type: 'xp', value: 610 },
          { type: 'gold', value: 490 },
        ],
      },
    },
  ],
  depth: 75,
  icon: GiCometSpark,
}
