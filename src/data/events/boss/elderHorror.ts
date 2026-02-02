import type { DungeonEvent } from '@/types'
import { GiCthulhuHead } from 'react-icons/gi'

export const ELDER_HORROR: DungeonEvent = {
  id: 'elder-horror',
  type: 'boss',
  title: 'Elder Horror',
  description: 'An ancient thing that predates existence. Looking upon it drives mortals mad. Its very presence distorts reality.',
  choices: [
    {
      text: 'Gaze upon madness',
      outcome: {
        text: 'Sanity shatters! Your mind breaks under cosmic horror!',
        effects: [
          { type: 'damage', target: 'all', value: 552 },
          { type: 'xp', value: 2265 },
          { type: 'gold', value: 3398 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 45 },
        ],
      },
    },
    {
      text: 'Close your eyes (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 83,
      },
      outcome: {
        text: 'You refuse to see! What you don\'t perceive cannot harm you!',
        effects: [
          { type: 'damage', target: 'all', value: 492 },
          { type: 'xp', value: 2395 },
          { type: 'gold', value: 3593 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 61 },
        ],
      },
    },
    {
      text: 'Strike blind (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'Sight is a weakness! You fight without looking and triumph!',
        effects: [
          { type: 'damage', target: 'strongest', value: 505 },
          { type: 'xp', value: 2420 },
          { type: 'gold', value: 3630 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 62 },
        ],
      },
    },
  ],
  depth: 78,
  icon: GiCthulhuHead,
}
