import type { DungeonEvent } from '@/types'
import { GiCaveEntrance } from 'react-icons/gi'

export const CAVE_LURKERS: DungeonEvent = {
  id: 'cave-lurkers',
  type: 'combat',
  title: 'Cave Lurkers',
  description: 'Pale humanoids with oversized eyes crawl from ceiling cracks!',
  choices: [
    {
      text: 'Fight them',
      outcome: {
        text: 'You battle the cave dwellers!',
        effects: [
          { type: 'damage', target: 'random', value: 12 },
          { type: 'xp', value: 42 },
          { type: 'gold', value: 21 },
        ],
      },
    },
    {
      text: 'Use bright light (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'The light blinds them!',
        effects: [
          { type: 'damage', target: 'random', value: 7 },
          { type: 'xp', value: 52 },
          { type: 'gold', value: 29 },
        ],
      },
    },
  ],
  depth: 9,
  icon: GiCaveEntrance,
}
