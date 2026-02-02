import type { DungeonEvent } from '@/types'
import { GiImplosion } from 'react-icons/gi'

export const VOID_HORROR: DungeonEvent = {
  id: 'void-horror',
  type: 'boss',
  title: 'Void Horror',
  description: 'A tear in reality itself takes horrific form. This aberration from the void hungers to unmake all existence. Looking at it causes your mind to reel.',
  choices: [
    {
      text: 'Confront the horror',
      outcome: {
        text: 'Your sanity frays as you battle! The void tears at your very soul!',
        effects: [
          { type: 'damage', target: 'all', value: 135 },
          { type: 'xp', value: 490 },
          { type: 'gold', value: 640 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 19 },
        ],
      },
    },
    {
      text: 'Seal the rift (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You close the tear in reality! The horror is pulled back into the void!',
        effects: [
          { type: 'damage', target: 'all', value: 98 },
          { type: 'xp', value: 535 },
          { type: 'gold', value: 700 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Steel your mind (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 30,
      },
      outcome: {
        text: 'Your mental fortitude protects you! The horror has no power over you!',
        effects: [
          { type: 'damage', target: 'weakest', value: 105 },
          { type: 'xp', value: 525 },
          { type: 'gold', value: 690 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 22 },
        ],
      },
    },
  ],
  depth: 28,
  icon: GiImplosion,
}
