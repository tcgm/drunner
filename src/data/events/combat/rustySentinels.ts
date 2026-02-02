import type { DungeonEvent } from '@/types'
import { GiBroadsword } from 'react-icons/gi'

export const RUSTY_SENTINELS: DungeonEvent = {
  id: 'rusty-sentinels',
  type: 'combat',
  title: 'Rusty Sentinels',
  description: 'Ancient armored statues creak to life, brandishing corroded weapons!',
  choices: [
    {
      text: 'Attack their joints',
      outcome: {
        text: 'You strike at weak points!',
        effects: [
          { type: 'damage', target: 'strongest', value: 14 },
          { type: 'xp', value: 47 },
          { type: 'gold', value: 24 },
        ],
      },
    },
    {
      text: 'Defensive stance (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'You outlast their attacks!',
        effects: [
          { type: 'damage', target: 'strongest', value: 8 },
          { type: 'xp', value: 57 },
          { type: 'gold', value: 32 },
        ],
      },
    },
  ],
  depth: 8,
  icon: GiBroadsword,
}
