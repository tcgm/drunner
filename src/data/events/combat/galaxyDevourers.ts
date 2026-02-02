import type { DungeonEvent } from '@/types'
import { GiGalaxy } from 'react-icons/gi'

export const GALAXY_DEVOURERS: DungeonEvent = {
  id: 'galaxy-devourers',
  type: 'combat',
  title: 'Galaxy Devourers',
  description: 'Cosmic horrors that consume entire star systems!',
  choices: [
    {
      text: 'Challenge their hunger',
      outcome: {
        text: 'They attempt to devour you!',
        effects: [
          { type: 'damage', target: 'all', value: 177 },
          { type: 'xp', value: 936 },
          { type: 'gold', value: 742 },
        ],
      },
    },
    {
      text: 'Sever their connection (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'You cut off their cosmic feeding!',
        effects: [
          { type: 'damage', target: 'all', value: 166 },
          { type: 'xp', value: 956 },
          { type: 'gold', value: 762 },
        ],
      },
    },
  ],
  depth: 94,
  icon: GiGalaxy,
}
