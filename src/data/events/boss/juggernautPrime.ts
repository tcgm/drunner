import type { DungeonEvent } from '@/types'
import { GiMountedKnight } from 'react-icons/gi'

export const JUGGERNAUT_PRIME: DungeonEvent = {
  id: 'juggernaut-prime',
  type: 'boss',
  title: 'Juggernaut Prime',
  description: 'An unstoppable force in armor made from collapsing universes. It has never been stopped. It cannot be stopped. It will not be stopped.',
  choices: [
    {
      text: 'Try to stop it',
      outcome: {
        text: 'Futile! It crushes through all resistance! The unstoppable cannot stop!',
        effects: [
          { type: 'damage', target: 'all', value: 685 },
          { type: 'xp', value: 2825 },
          { type: 'gold', value: 4238 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 56 },
        ],
      },
    },
    {
      text: 'Become immovable (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 85,
      },
      outcome: {
        text: 'Unstoppable meets immovable! The paradox destroys the juggernaut!',
        effects: [
          { type: 'damage', target: 'all', value: 658 },
          { type: 'xp', value: 2985 },
          { type: 'gold', value: 4478 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 79 },
        ],
      },
    },
    {
      text: 'Redirect the force (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 92,
      },
      outcome: {
        text: 'You channel its momentum! The juggernaut destroys itself!',
        effects: [
          { type: 'damage', target: 'strongest', value: 672 },
          { type: 'xp', value: 3015 },
          { type: 'gold', value: 4523 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 80 },
        ],
      },
    },
  ],
  depth: 92,
  icon: GiMountedKnight,
}
