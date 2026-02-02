import type { DungeonEvent } from '@/types'
import { GiEyestalk } from 'react-icons/gi'

export const ABERRANT_SOVEREIGN: DungeonEvent = {
  id: 'aberrant-sovereign',
  type: 'boss',
  title: 'Aberrant Sovereign',
  description: 'A thing from beyond reality that rules over all aberrations. Its form defies geometry, its existence offends nature.',
  choices: [
    {
      text: 'Perceive the impossible',
      outcome: {
        text: 'Your mind reels at impossible angles! Sanity slips away!',
        effects: [
          { type: 'damage', target: 'random', value: 488 },
          { type: 'xp', value: 1975 },
          { type: 'gold', value: 2963 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 39 },
        ],
      },
    },
    {
      text: 'Close your mind (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 75,
      },
      outcome: {
        text: 'You refuse to perceive! What you don\'t see can\'t hurt you!',
        effects: [
          { type: 'damage', target: 'all', value: 422 },
          { type: 'xp', value: 2105 },
          { type: 'gold', value: 3158 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 52 },
        ],
      },
    },
    {
      text: 'Strike blindly (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You attack without looking! Blind fury succeeds where sight fails!',
        effects: [
          { type: 'damage', target: 'strongest', value: 438 },
          { type: 'xp', value: 2130 },
          { type: 'gold', value: 3195 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 53 },
        ],
      },
    },
  ],
  depth: 69,
  icon: GiEyestalk,
}
