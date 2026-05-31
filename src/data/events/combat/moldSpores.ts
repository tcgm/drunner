import type { DungeonEvent } from '@/types'
import { GiMushroomCloud } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const MOLD_SPORES: DungeonEvent = {
  id: 'mold-spores',
  type: 'combat',
  tags: [TAGS.FUNGUS, TAGS.PLANT, TAGS.CAVE, TAGS.SWAMP],
  title: 'Mold Spores',
  description: 'Thick clouds of aggressive spores fill the corridor!',
  choices: [
    {
      text: 'Push through',
      outcome: {
        text: 'You inhale some of the toxic spores!',
        effects: [
          { type: 'damage', target: 'all', value: 11 },
          { type: 'xp', value: 34 },
          { type: 'gold', value: 15 },
        ],
      },
    },
    {
      text: 'Cover mouth (Defense check)',
      requirements: { stat: 'defense', minValue: 14 },
      outcome: {
        text: 'You minimize exposure to the spores!',
        effects: [
          { type: 'damage', target: 'all', value: 6 },
          { type: 'xp', value: 44 },
          { type: 'gold', value: 23 },
        ],
      },
    },
  ],
  depth: 3,
  icon: GiMushroomCloud,
}
