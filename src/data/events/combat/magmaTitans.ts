import type { DungeonEvent } from '@/types'
import { GiBoilingBubbles } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const MAGMA_TITANS: DungeonEvent = {
  id: 'magma-titans',
  type: 'combat',
  tags: [TAGS.ELEMENTAL, TAGS.FIRE, TAGS.VOLCANIC, TAGS.TITAN],
  title: 'Magma Titans',
  description: 'Giants made of molten rock wade through pools of lava!',
  choices: [
    {
      text: 'Engage them',
      outcome: {
        text: 'Intense heat melts your equipment!',
        effects: [
          { type: 'damage', target: 'strongest', value: 66 },
          { type: 'xp', value: 300 },
          { type: 'gold', value: 217 },
        ],
      },
    },
    {
      text: 'Cooling magic (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Ice magic solidifies the magma!',
        effects: [
          { type: 'damage', target: 'strongest', value: 55 },
          { type: 'xp', value: 320 },
          { type: 'gold', value: 220 },
        ],
      },
    },
  ],
  depth: 47,
  icon: GiBoilingBubbles,
}
