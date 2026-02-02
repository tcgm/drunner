import type { DungeonEvent } from '@/types'
import { GiAbstract045 } from 'react-icons/gi'

export const UNIVERSE_EATERS: DungeonEvent = {
  id: 'universe-eaters',
  type: 'combat',
  title: 'Universe Eaters',
  description: 'Cosmic entities that consume entire universes turn their hunger on you!',
  choices: [
    {
      text: 'Resist consumption',
      outcome: {
        text: 'They devour reality itself!',
        effects: [
          { type: 'damage', target: 'all', value: 145 },
          { type: 'xp', value: 750 },
          { type: 'gold', value: 600 },
        ],
      },
    },
    {
      text: 'Cosmic resistance (Defense check)',
      requirements: { stat: 'defense', minValue: 185 },
      outcome: {
        text: 'You remain unconsumable!',
        effects: [
          { type: 'damage', target: 'all', value: 134 },
          { type: 'xp', value: 770 },
          { type: 'gold', value: 620 },
        ],
      },
    },
  ],
  depth: 87,
  icon: GiAbstract045,
}
