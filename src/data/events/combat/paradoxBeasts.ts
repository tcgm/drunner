import type { DungeonEvent } from '@/types'
import { GiAbstract035 } from 'react-icons/gi'

export const PARADOX_BEASTS: DungeonEvent = {
  id: 'paradox-beasts',
  type: 'combat',
  title: 'Paradox Beasts',
  description: 'Creatures that embody logical impossibilities attack with contradictions!',
  choices: [
    {
      text: 'Accept the paradox',
      outcome: {
        text: 'Logical contradictions tear at reality!',
        effects: [
          { type: 'damage', target: 'all', value: 108 },
          { type: 'xp', value: 565 },
          { type: 'gold', value: 445 },
        ],
      },
    },
    {
      text: 'Resolve contradictions (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You impose logical order!',
        effects: [
          { type: 'damage', target: 'all', value: 97 },
          { type: 'xp', value: 585 },
          { type: 'gold', value: 465 },
        ],
      },
    },
  ],
  depth: 73,
  icon: GiAbstract035,
}
