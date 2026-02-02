import type { DungeonEvent } from '@/types'
import { GiBattleGear } from 'react-icons/gi'

export const WAR_MACHINES: DungeonEvent = {
  id: 'war-machines',
  type: 'combat',
  title: 'War Machines',
  description: 'Ancient mechanical warriors designed for total destruction!',
  choices: [
    {
      text: 'Disable them',
      outcome: {
        text: 'Their weapons systems target you!',
        effects: [
          { type: 'damage', target: 'random', value: 61 },
          { type: 'xp', value: 290 },
          { type: 'gold', value: 208 },
        ],
      },
    },
    {
      text: 'Powerful blows (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'You smash their mechanisms!',
        effects: [
          { type: 'damage', target: 'random', value: 50 },
          { type: 'xp', value: 310 },
          { type: 'gold', value: 220 },
        ],
      },
    },
  ],
  depth: 45,
  icon: GiBattleGear,
}
