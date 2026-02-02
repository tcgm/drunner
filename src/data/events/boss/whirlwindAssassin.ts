import type { DungeonEvent } from '@/types'
import { GiDervishSwords } from 'react-icons/gi'

export const WHIRLWIND_ASSASSIN: DungeonEvent = {
  id: 'whirlwind-assassin',
  type: 'boss',
  title: 'Whirlwind Assassin',
  description: 'An elemental assassin that becomes a living cyclone of blades. They move with the wind itself, striking from impossible angles.',
  choices: [
    {
      text: 'Fight the storm',
      outcome: {
        text: 'Blades strike from every direction! The whirlwind cuts you to ribbons!',
        effects: [
          { type: 'damage', target: 'all', value: 170 },
          { type: 'xp', value: 685 },
          { type: 'gold', value: 995 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'legendary', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Still the air (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Your magic creates a zone of calm! Without wind, the assassin is helpless!',
        effects: [
          { type: 'damage', target: 'all', value: 135 },
          { type: 'xp', value: 752 },
          { type: 'gold', value: 1072 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Strike at the eye (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You time your strike perfectly and hit the center of the vortex!',
        effects: [
          { type: 'damage', target: 'weakest', value: 142 },
          { type: 'xp', value: 778 },
          { type: 'gold', value: 1108 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 25 },
        ],
      },
    },
  ],
  depth: 33,
  icon: GiDervishSwords,
}
