import type { DungeonEvent } from '@/types'
import { GiMineWagon } from 'react-icons/gi'

export const IRON_CONSTRUCTS: DungeonEvent = {
  id: 'iron-constructs',
  type: 'combat',
  title: 'Iron Constructs',
  description: 'Heavy metal automatons march forward with grinding gears!',
  choices: [
    {
      text: 'Smash them',
      outcome: {
        text: 'You pound the iron plating!',
        effects: [
          { type: 'damage', target: 'strongest', value: 22 },
          { type: 'xp', value: 85 },
          { type: 'gold', value: 50 },
        ],
      },
    },
    {
      text: 'Target joints (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You disable their mechanisms!',
        effects: [
          { type: 'damage', target: 'strongest', value: 15 },
          { type: 'xp', value: 100 },
          { type: 'gold', value: 60 },
        ],
      },
    },
  ],
  depth: 13,
  icon: GiMineWagon,
}
