import type { DungeonEvent } from '@/types'
import { GiSpaceNeedle } from 'react-icons/gi'

export const DIMENSION_NEEDLES: DungeonEvent = {
  id: 'dimension-needles',
  type: 'combat',
  title: 'Dimension Needles',
  description: 'Razor-thin portals slice through space itself!',
  choices: [
    {
      text: 'Dodge the rifts',
      outcome: {
        text: 'They cut through everything!',
        effects: [
          { type: 'damage', target: 'random', value: 134 },
          { type: 'xp', value: 716 },
          { type: 'gold', value: 553 },
        ],
      },
    },
    {
      text: 'Close the portals (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You seal the dimensional tears!',
        effects: [
          { type: 'damage', target: 'random', value: 123 },
          { type: 'xp', value: 736 },
          { type: 'gold', value: 573 },
        ],
      },
    },
  ],
  depth: 77,
  icon: GiSpaceNeedle,
}
