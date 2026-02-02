import type { DungeonEvent } from '@/types'
import { GiHornedSkull } from 'react-icons/gi'

export const SKULL_SWARM: DungeonEvent = {
  id: 'skull-swarm',
  type: 'combat',
  title: 'Skull Swarm',
  description: 'Floating skulls cackle and bite with phantom teeth!',
  choices: [
    {
      text: 'Smash them',
      outcome: {
        text: 'You shatter the animated skulls!',
        effects: [
          { type: 'damage', target: 'all', value: 12 },
          { type: 'xp', value: 43 },
          { type: 'gold', value: 22 },
        ],
      },
    },
    {
      text: 'Holy power (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine light disperses them!',
        effects: [
          { type: 'damage', target: 'all', value: 6 },
          { type: 'xp', value: 53 },
          { type: 'gold', value: 30 },
        ],
      },
    },
  ],
  depth: 5,
  icon: GiHornedSkull,
}
