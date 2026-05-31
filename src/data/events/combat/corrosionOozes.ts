import type { DungeonEvent } from '@/types'
import { GiAcid } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const CORROSION_OOZES: DungeonEvent = {
  id: 'corrosion-oozes',
  type: 'combat',
  tags: [TAGS.OOZE, TAGS.ACID, TAGS.CAVE],
  title: 'Corrosion Oozes',
  description: 'Living acids that dissolve anything they touch!',
  choices: [
    {
      text: 'Strike them',
      outcome: {
        text: 'They melt your weapons!',
        effects: [
          { type: 'damage', target: 'random', value: 45 },
          { type: 'xp', value: 227 },
          { type: 'gold', value: 155 },
        ],
      },
    },
    {
      text: 'Use magic from distance (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Spells evaporate them!',
        effects: [
          { type: 'damage', target: 'random', value: 34 },
          { type: 'xp', value: 247 },
          { type: 'gold', value: 175 },
        ],
      },
    },
  ],
  depth: 34,
  icon: GiAcid,
}
