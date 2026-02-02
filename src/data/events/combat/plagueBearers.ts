import type { DungeonEvent } from '@/types'
import { GiVileFluid } from 'react-icons/gi'

export const PLAGUE_BEARERS: DungeonEvent = {
  id: 'plague-bearers',
  type: 'combat',
  title: 'Plague Bearers',
  description: 'Diseased creatures spread pestilence with every touch!',
  choices: [
    {
      text: 'Fight despite infection',
      outcome: {
        text: 'Disease weakens you badly!',
        effects: [
          { type: 'damage', target: 'all', value: 54 },
          { type: 'xp', value: 270 },
          { type: 'gold', value: 195 },
        ],
      },
    },
    {
      text: 'Purify them (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Holy light cleanses disease!',
        effects: [
          { type: 'damage', target: 'all', value: 43 },
          { type: 'xp', value: 290 },
          { type: 'gold', value: 215 },
        ],
      },
    },
  ],
  depth: 32,
  icon: GiVileFluid,
}
