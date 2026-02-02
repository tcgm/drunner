import type { DungeonEvent } from '@/types'
import { GiCrownedExplosion } from 'react-icons/gi'

export const VOID_EMPEROR: DungeonEvent = {
  id: 'void-emperor',
  type: 'boss',
  title: 'Void Emperor',
  description: 'A being that exists between existence and non-existence. It seeks to unmake reality itself, spreading entropy and nothingness.',
  choices: [
    {
      text: 'Resist the void',
      outcome: {
        text: 'Existence itself unravels around you! The void tears at your very being!',
        effects: [
          { type: 'damage', target: 'all', value: 350 },
          { type: 'xp', value: 1300 },
          { type: 'gold', value: 1950 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 27 },
        ],
      },
    },
    {
      text: 'Assert reality (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 56,
      },
      outcome: {
        text: 'Your will defines what is real! The emperor cannot unmake you!',
        effects: [
          { type: 'damage', target: 'weakest', value: 292 },
          { type: 'xp', value: 1395 },
          { type: 'gold', value: 2095 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 33 },
        ],
      },
    },
    {
      text: 'Fill the void (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You flood the emptiness with creation magic! The emperor dissolves!',
        effects: [
          { type: 'damage', target: 'all', value: 255 },
          { type: 'xp', value: 1420 },
          { type: 'gold', value: 2130 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 35 },
        ],
      },
    },
  ],
  depth: 50,
  icon: GiCrownedExplosion,
}
