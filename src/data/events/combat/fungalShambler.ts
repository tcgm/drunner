import type { DungeonEvent } from '@/types'
import { GiMushroomGills } from 'react-icons/gi'

export const FUNGAL_SHAMBLER: DungeonEvent = {
  id: 'fungal-shambler',
  type: 'combat',
  title: 'Fungal Shambler',
  description: 'A lumbering mass of mushrooms and decay approaches, releasing toxic spores!',
  choices: [
    {
      text: 'Hold your breath and fight',
      outcome: {
        text: 'You cut through the shambling fungus!',
        effects: [
          { type: 'damage', target: 'weakest', value: 12 },
          { type: 'xp', value: 45 },
          { type: 'gold', value: 22 },
        ],
      },
    },
    {
      text: 'Dodge the spores (Speed check)',
      requirements: { stat: 'speed', minValue: 10 },
      outcome: {
        text: 'You avoid the toxic cloud and strike cleanly!',
        effects: [
          { type: 'damage', target: 'weakest', value: 6 },
          { type: 'xp', value: 55 },
          { type: 'gold', value: 30 },
        ],
      },
    },
  ],
  depth: 4,
  icon: GiMushroomGills,
}
