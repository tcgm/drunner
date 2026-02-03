import type { DungeonEvent } from '@/types'
import { GiFireZone } from 'react-icons/gi'

export const MAGMA_TITAN: DungeonEvent = {
  id: 'magma-titan',
  type: 'boss',
  title: 'Magma Titan',
  description: 'A colossal being of molten rock rises from a lava pit. Its body glows white-hot, and the air shimmers with intense heat around it.',
  choices: [
    {
      text: 'Endure the heat',
      outcome: {
        text: 'The heat is unbearable! Magma sprays from its body as it attacks!',
        effects: [
          { type: 'damage', target: 'all', value: 145 },
          { type: 'xp', value: 500 },
          { type: 'gold', value: 660 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Cool it with ice (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Your ice magic causes the titan to solidify and crack apart!',
        effects: [
          { type: 'damage', target: 'all', value: 105 },
          { type: 'xp', value: 543 },
          { type: 'gold', value: 708 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Withstand the flames (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 30,
      },
      outcome: {
        text: 'Your protection holds! You strike its cooling exterior until it crumbles!',
        effects: [
          { type: 'damage', target: 'all', value: 110 },
          { type: 'xp', value: 540 },
          { type: 'gold', value: 705 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', rarityBoost: 23 },
        ],
      },
    },
  ],
  depth: 28,
  icon: GiFireZone,
}
