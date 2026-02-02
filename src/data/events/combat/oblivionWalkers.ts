import type { DungeonEvent } from '@/types'
import { GiAbstract052 } from 'react-icons/gi'

export const OBLIVION_WALKERS: DungeonEvent = {
  id: 'oblivion-walkers',
  type: 'combat',
  title: 'Oblivion Walkers',
  description: 'Beings that walk between existence and non-existence!',
  choices: [
    {
      text: 'Face oblivion',
      outcome: {
        text: 'They erase you from reality!',
        effects: [
          { type: 'damage', target: 'random', value: 158 },
          { type: 'xp', value: 820 },
          { type: 'gold', value: 680 },
        ],
      },
    },
    {
      text: 'Exist defiantly (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'Your will to exist prevails!',
        effects: [
          { type: 'damage', target: 'random', value: 147 },
          { type: 'xp', value: 840 },
          { type: 'gold', value: 700 },
        ],
      },
    },
  ],
  depth: 92,
  icon: GiAbstract052,
}
