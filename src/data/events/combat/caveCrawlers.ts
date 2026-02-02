import type { DungeonEvent } from '@/types'
import { GiSpiderBot } from 'react-icons/gi'

export const CAVE_CRAWLERS: DungeonEvent = {
  id: 'cave-crawlers',
  type: 'combat',
  title: 'Cave Crawlers',
  description: 'Chittering insects with armored carapaces skitter across the walls!',
  choices: [
    {
      text: 'Crush them',
      outcome: {
        text: 'You stomp the crawling vermin!',
        effects: [
          { type: 'damage', target: 'all', value: 8 },
          { type: 'xp', value: 40 },
          { type: 'gold', value: 18 },
        ],
      },
    },
    {
      text: 'Use fire (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Flames consume the insects quickly!',
        effects: [
          { type: 'damage', target: 'random', value: 4 },
          { type: 'xp', value: 50 },
          { type: 'gold', value: 28 },
        ],
      },
    },
  ],
  depth: 3,
  icon: GiSpiderBot,
}
