import type { DungeonEvent } from '@/types'
import { GiChainedHeart } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const BOUND_SOULS: DungeonEvent = {
  id: 'bound-souls',
  type: 'combat',
  tags: [TAGS.SPIRIT, TAGS.UNDEAD, TAGS.ETHEREAL],
  title: 'Bound Souls',
  description: 'Tortured spirits chained to the dungeon walls attack in anguish!',
  choices: [
    {
      text: 'Destroy them',
      outcome: {
        text: 'Their wails of pain drain you!',
        effects: [
          { type: 'damage', target: 'random', value: 31 },
          { type: 'xp', value: 127 },
          { type: 'gold', value: 79 },
        ],
      },
    },
    {
      text: 'Release them (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'They thank you as they dissipate!',
        effects: [
          { type: 'damage', target: 'random', value: 22 },
          { type: 'xp', value: 147 },
          { type: 'gold', value: 94 },
        ],
      },
    },
  ],
  depth: 19,
  icon: GiChainedHeart,
}
