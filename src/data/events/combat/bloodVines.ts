import type { DungeonEvent } from '@/types'
import { GiThornyVine } from 'react-icons/gi'

export const BLOOD_VINES: DungeonEvent = {
  id: 'blood-vines',
  type: 'combat',
  title: 'Blood Vines',
  description: 'Crimson tendrils burst from the walls, seeking to drain life!',
  choices: [
    {
      text: 'Cut through them',
      outcome: {
        text: 'They regenerate as they feed!',
        effects: [
          { type: 'damage', target: 'all', value: 35 },
          { type: 'xp', value: 165 },
          { type: 'gold', value: 115 },
        ],
      },
    },
    {
      text: 'Fire purge (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Flames consume the vines!',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
          { type: 'xp', value: 185 },
          { type: 'gold', value: 135 },
        ],
      },
    },
  ],
  depth: 27,
  icon: GiThornyVine,
}
