import type { DungeonEvent } from '@/types'
import { GiLightningArc } from 'react-icons/gi'

export const STORM_TYRANT: DungeonEvent = {
  id: 'storm-tyrant',
  type: 'boss',
  title: 'Storm Tyrant',
  description: 'The elemental lord of all tempests. It is the hurricane, the tornado, the thunderstorm made flesh. Weather obeys its whim.',
  choices: [
    {
      text: 'Endure the tempest',
      outcome: {
        text: 'The mother of all storms! Lightning, wind, and rain devastate you!',
        effects: [
          { type: 'damage', target: 'all', value: 572 },
          { type: 'xp', value: 2410 },
          { type: 'gold', value: 3615 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 46 },
        ],
      },
    },
    {
      text: 'Calm the storm (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You command perfect stillness! The tyrant has no power in calm!',
        effects: [
          { type: 'damage', target: 'all', value: 512 },
          { type: 'xp', value: 2540 },
          { type: 'gold', value: 3810 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 64 },
        ],
      },
    },
    {
      text: 'Weather the storm (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 78,
      },
      outcome: {
        text: 'Your fortitude is unshakeable! No storm can break you!',
        effects: [
          { type: 'damage', target: 'strongest', value: 525 },
          { type: 'xp', value: 2565 },
          { type: 'gold', value: 3848 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 65 },
        ],
      },
    },
  ],
  depth: 81,
  icon: GiLightningArc,
}
