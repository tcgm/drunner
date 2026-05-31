import type { DungeonEvent } from '@/types'
import { GiCrystalWand } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const CRYSTAL_GUARDIANS: DungeonEvent = {
  id: 'crystal-guardians',
  type: 'combat',
  tags: [TAGS.CONSTRUCT, TAGS.CRYSTAL, TAGS.CAVE, TAGS.UNDERGROUND],
  title: 'Crystal Guardians',
  description: 'Beings of living crystal reflect light as they advance!',
  choices: [
    {
      text: 'Shatter them',
      outcome: {
        text: 'You break through their crystalline bodies!',
        effects: [
          { type: 'damage', target: 'random', value: 19 },
          { type: 'xp', value: 78 },
          { type: 'gold', value: 46 },
        ],
      },
    },
    {
      text: 'Magic disruption (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You disrupt their crystalline structure!',
        effects: [
          { type: 'damage', target: 'random', value: 13 },
          { type: 'xp', value: 93 },
          { type: 'gold', value: 56 },
        ],
      },
    },
  ],
  depth: 12,
  icon: GiCrystalWand,
}
