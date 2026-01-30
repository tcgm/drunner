import type { DungeonEvent } from '@/types'
import { GiTwoCoins } from 'react-icons/gi'

export const LUCKY_COIN_FLIP: DungeonEvent = {
  id: 'lucky-coin-flip',
  type: 'choice',
  title: 'Mysterious Stranger',
  description: 'A hooded figure offers a wager: flip their magic coin. Heads you win big, tails you get nothing.',
  choices: [
    {
      text: 'Accept the wager (Luck check)',
      successChance: 0.45, // Slightly less than fair
      statModifier: 'luck',
      successOutcome: {
        text: 'Heads! The coin glows and transforms into an incredible treasure!',
        effects: [
          { type: 'gold', value: 400 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'epic', // Lucky wins are amazing
            rarityBoost: 20
          },
          { type: 'xp', value: 150 },
        ],
      },
      failureOutcome: {
        text: 'Tails. The stranger laughs and disappears with the coin.',
        effects: [
          { type: 'xp', value: 30 },
        ],
      },
    },
    {
      text: 'Cheat with magic (Mage)',
      requirements: {
        class: 'Mage',
      },
      possibleOutcomes: [
        {
          weight: 70,
          outcome: {
            text: 'Your magic influences the flip! The stranger doesn\'t notice!',
            effects: [
              { type: 'gold', value: 350 },
              { 
                type: 'item', 
                itemType: 'random',
                minRarity: 'rare',
                rarityBoost: 15
              },
              { type: 'xp', value: 120 },
            ],
          },
        },
        {
          weight: 30,
          outcome: {
            text: 'The stranger catches you! They curse you and leave!',
            effects: [
              { type: 'damage', target: 'random', value: 25 },
              { type: 'xp', value: 40 },
            ],
          },
        },
      ],
    },
    {
      text: 'Decline politely',
      outcome: {
        text: 'The stranger respects your caution and offers a small gift.',
        effects: [
          { type: 'gold', value: 100 },
          { 
            type: 'item', 
            itemType: 'random',
            maxRarity: 'uncommon' // Safe option, low reward
          },
        ],
      },
    },
  ],
  depth: 8,
  icon: GiTwoCoins,
}
