import type { DungeonEvent } from '@/types'
import { GiCloak } from 'react-icons/gi'

export const SHADOW_THIEVES: DungeonEvent = {
  id: 'shadow-thieves',
  type: 'combat',
  title: 'Shadow Thieves',
  description: 'Cloaked rogues emerge from darkness to rob and attack!',
  choices: [
    {
      text: 'Chase them down',
      outcome: {
        text: 'They vanish into shadows!',
        effects: [
          { type: 'damage', target: 'weakest', value: 19 },
          { type: 'xp', value: 77 },
          { type: 'gold', value: 46 },
        ],
      },
    },
    {
      text: 'Counter-stealth (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You outmaneuver them!',
        effects: [
          { type: 'damage', target: 'weakest', value: 13 },
          { type: 'xp', value: 92 },
          { type: 'gold', value: 56 },
        ],
      },
    },
  ],
  depth: 13,
  icon: GiCloak,
}
