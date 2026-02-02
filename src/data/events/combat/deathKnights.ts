import type { DungeonEvent } from '@/types'
import { GiCrownedSkull } from 'react-icons/gi'

export const DEATH_KNIGHTS: DungeonEvent = {
  id: 'death-knights',
  type: 'combat',
  title: 'Death Knights',
  description: 'Undead warriors wielding cursed blades march forth!',
  choices: [
    {
      text: 'Battle them',
      outcome: {
        text: 'Their cursed weapons drain life!',
        effects: [
          { type: 'damage', target: 'random', value: 38 },
          { type: 'xp', value: 170 },
          { type: 'gold', value: 118 },
        ],
      },
    },
    {
      text: 'Holy smite (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine power shatters their curse!',
        effects: [
          { type: 'damage', target: 'random', value: 28 },
          { type: 'xp', value: 190 },
          { type: 'gold', value: 138 },
        ],
      },
    },
  ],
  depth: 26,
  icon: GiCrownedSkull,
}
