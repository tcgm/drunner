import type { DungeonEvent } from '@/types'
import { GiVileFluid } from 'react-icons/gi'

export const PLAGUE_ZOMBIES: DungeonEvent = {
  id: 'plague-zombies',
  type: 'combat',
  title: 'Plague Zombies',
  description: 'Disease-ridden corpses shamble forward, oozing infection!',
  choices: [
    {
      text: 'Fight them off',
      outcome: {
        text: 'Their touch spreads sickness!',
        effects: [
          { type: 'damage', target: 'random', value: 20 },
          { type: 'xp', value: 80 },
          { type: 'gold', value: 47 },
        ],
      },
    },
    {
      text: 'Purify them (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Holy light cleanses the plague!',
        effects: [
          { type: 'damage', target: 'random', value: 13 },
          { type: 'xp', value: 95 },
          { type: 'gold', value: 57 },
        ],
      },
    },
  ],
  depth: 14,
  icon: GiVileFluid,
}
