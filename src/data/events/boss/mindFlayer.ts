import type { DungeonEvent } from '@/types'
import { GiEyeMonster } from 'react-icons/gi'

export const MIND_FLAYER: DungeonEvent = {
  id: 'mind-flayer',
  type: 'boss',
  title: 'Mind Flayer',
  description: 'An illithid emerges from the shadows, its tentacles writhing around its aberrant face. You feel its psychic presence probing your mind.',
  choices: [
    {
      text: 'Resist its power',
      outcome: {
        text: 'The mind flayer\'s psychic assault is overwhelming! Your thoughts turn against you!',
        effects: [
          { type: 'damage', target: 'all', value: 138 },
          { type: 'xp', value: 495 },
          { type: 'gold', value: 645 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 19 },
        ],
      },
    },
    {
      text: 'Mental fortress (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 31,
      },
      outcome: {
        text: 'Your mind is an impenetrable fortress! The flayer recoils in shock!',
        effects: [
          { type: 'damage', target: 'random', value: 102 },
          { type: 'xp', value: 538 },
          { type: 'gold', value: 703 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Sever the tentacles (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'Your quick blades slice off its tentacles! It can\'t fight or use psionics!',
        effects: [
          { type: 'damage', target: 'weakest', value: 95 },
          { type: 'xp', value: 533 },
          { type: 'gold', value: 698 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 22 },
        ],
      },
    },
  ],
  depth: 26,
  icon: GiEyeMonster,
}
