import type { DungeonEvent } from '@/types'
import { GiDeathSkull } from 'react-icons/gi'

export const DEATH_PRIESTS: DungeonEvent = {
  id: 'death-priests',
  type: 'combat',
  title: 'Death Priests',
  description: 'Hooded cultists chant dark prayers as they summon necrotic energy!',
  choices: [
    {
      text: 'Interrupt their ritual',
      outcome: {
        text: 'You disrupt their spellcasting!',
        effects: [
          { type: 'damage', target: 'random', value: 18 },
          { type: 'xp', value: 75 },
          { type: 'gold', value: 45 },
        ],
      },
    },
    {
      text: 'Counter with holy power (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine energy overwhelms them!',
        effects: [
          { type: 'damage', target: 'random', value: 12 },
          { type: 'xp', value: 90 },
          { type: 'gold', value: 55 },
        ],
      },
    },
  ],
  depth: 11,
  icon: GiDeathSkull,
}
