import type { DungeonEvent } from '@/types'
import { GiDoubleDragon } from 'react-icons/gi'

export const TWIN_HEADED_DRAKE: DungeonEvent = {
  id: 'twin-headed-drake',
  type: 'boss',
  title: 'Twin-Headed Drake',
  description: 'A mutant dragon with two heads constantly bickering with each other. One breathes fire, the other frost. Despite their quarreling, they fight as one beast.',
  choices: [
    {
      text: 'Face both heads',
      outcome: {
        text: 'Fire and ice attack simultaneously! You\'re caught between extreme temperatures!',
        effects: [
          { type: 'damage', target: 'all', value: 175 },
          { type: 'xp', value: 690 },
          { type: 'gold', value: 1000 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'legendary', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Exploit their arguing (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 35,
      },
      outcome: {
        text: 'You turn them against each other! They attack themselves in confusion!',
        effects: [
          { type: 'damage', target: 'weakest', value: 138 },
          { type: 'xp', value: 755 },
          { type: 'gold', value: 1080 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Strike the body (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'While the heads argue, you strike the vulnerable body! A killing blow!',
        effects: [
          { type: 'damage', target: 'strongest', value: 148 },
          { type: 'xp', value: 780 },
          { type: 'gold', value: 1110 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 25 },
        ],
      },
    },
  ],
  depth: 34,
  icon: GiDoubleDragon,
}
