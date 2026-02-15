import type { DungeonEvent } from '@/types'
import { GiRat } from 'react-icons/gi'

export const GIANT_RAT: DungeonEvent = {
  id: 'giant-rat-intro',
  type: 'boss',
  title: 'Giant Rat',
  description: 'An unusually large rat blocks the passage, its eyes gleaming with hunger. This dungeon dweller looks tough, but beatable.',
  choices: [
    {
      text: 'Attack head-on',
      outcome: {
        text: 'The rat lunges at you, but you fight it off. Your first real challenge!',
        effects: [
          { type: 'damage', target: 'all', value: 15 },
          { type: 'xp', value: 120 },
          { type: 'gold', value: 150 },
          { type: 'item', itemType: 'random', minRarity: 'common', rarityBoost: 5 },
        ],
      },
    },
    {
      text: 'Lure it into a trap (High Speed)',
      requirements: {
        stat: 'speed',
        minValue: 8,
      },
      outcome: {
        text: 'You quickly set up a trap and the rat falls right into it!',
        effects: [
          { type: 'damage', target: 'random', value: 10 },
          { type: 'xp', value: 150 },
          { type: 'gold', value: 180 },
          { type: 'item', itemType: 'weapon', minRarity: 'uncommon', rarityBoost: 7 },
        ],
      },
    },
    {
      text: 'Use magic to confuse it (Wizard bonus)',
      requirements: {
        class: 'Wizard',
      },
      outcome: {
        text: 'Your spell disorients the rat, making it easy prey!',
        effects: [
          { type: 'damage', target: 'all', value: 8 },
          { type: 'xp', value: 160 },
          { type: 'gold', value: 200 },
          { type: 'item', itemType: 'armor', minRarity: 'uncommon', rarityBoost: 8 },
        ],
      },
    },
  ],
  depth: 1,
  icon: GiRat,
  isIntroBoss: true,
}
