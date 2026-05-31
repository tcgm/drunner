import type { DungeonEvent } from '@/types'
import { GiLightningTear } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const STORM_LORDS: DungeonEvent = {
  id: 'storm-lords',
  type: 'combat',
  tags: [TAGS.HUMANOID, TAGS.LIGHTNING, TAGS.ELEMENTAL, TAGS.STORM],
  title: 'Storm Lords',
  description: 'Elemental masters of thunder and lightning unleash devastating bolts!',
  choices: [
    {
      text: 'Weather the storm',
      outcome: {
        text: 'Lightning strikes repeatedly!',
        effects: [
          { type: 'damage', target: 'random', value: 48 },
          { type: 'xp', value: 240 },
          { type: 'gold', value: 165 },
        ],
      },
    },
    {
      text: 'Magic shield (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You deflect their storm magic!',
        effects: [
          { type: 'damage', target: 'random', value: 37 },
          { type: 'xp', value: 260 },
          { type: 'gold', value: 185 },
        ],
      },
    },
  ],
  depth: 37,
  icon: GiLightningTear,
}
