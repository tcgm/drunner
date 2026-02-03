import type { DungeonEvent } from '@/types'
import { GiDarkSquad } from 'react-icons/gi'

export const SHADOW_PARLIAMENT: DungeonEvent = {
  id: 'shadow-parliament',
  type: 'boss',
  title: 'Shadow Parliament',
  description: 'Thirteen shadow beings that share one consciousness. Destroy one and the others grow stronger. All must fall together.',
  choices: [
    {
      text: 'Fight them individually',
      outcome: {
        text: 'Each fallen shadow empowers the rest! The last one is unstoppable!',
        effects: [
          { type: 'damage', target: 'all', value: 558 },
          { type: 'xp', value: 2285 },
          { type: 'gold', value: 3428 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 45 },
        ],
      },
    },
    {
      text: 'Destroy all at once (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'One massive spell obliterates them simultaneously! The parliament falls!',
        effects: [
          { type: 'damage', target: 'all', value: 498 },
          { type: 'xp', value: 2415 },
          { type: 'gold', value: 3623 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 62 },
        ],
      },
    },
    {
      text: 'Sever the connection (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 84,
      },
      outcome: {
        text: 'You break their shared consciousness! Alone, each is vulnerable!',
        effects: [
          { type: 'damage', target: 'random', value: 512 },
          { type: 'xp', value: 2445 },
          { type: 'gold', value: 3668 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 63 },
        ],
      },
    },
  ],
  depth: 79,
  icon: GiDarkSquad,
}
