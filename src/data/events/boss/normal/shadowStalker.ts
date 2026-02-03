import type { DungeonEvent } from '@/types'
import { GiShadowFollower } from 'react-icons/gi'

export const SHADOW_STALKER: DungeonEvent = {
  id: 'shadow-stalker',
  type: 'boss',
  title: 'Shadow Stalker',
  description: 'A living shadow detaches from the darkness, its form constantly shifting. Red eyes pierce through the gloom.',
  choices: [
    {
      text: 'Fight blind',
      outcome: {
        text: 'You swing wildly at the darkness, taking hits from unseen attacks!',
        effects: [
          { type: 'damage', target: 'all', value: 32 },
          { type: 'xp', value: 190 },
          { type: 'gold', value: 270 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 10 },
        ],
      },
    },
    {
      text: 'Create light (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Your magical light reveals the shadow\'s true form! You strike it down!',
        effects: [
          { type: 'damage', target: 'all', value: 20 },
          { type: 'xp', value: 230 },
          { type: 'gold', value: 330 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 13 },
        ],
      },
    },
    {
      text: 'Track by sound (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 9,
      },
      outcome: {
        text: 'You close your eyes and listen. Your strike lands perfectly!',
        effects: [
          { type: 'damage', target: 'random', value: 24 },
          { type: 'xp', value: 220 },
          { type: 'gold', value: 310 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 12 },
        ],
      },
    },
  ],
  depth: 6,
  icon: GiShadowFollower,
}
