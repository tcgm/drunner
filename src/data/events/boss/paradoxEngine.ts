import type { DungeonEvent } from '@/types'
import { GiTwoCoins } from 'react-icons/gi'

export const PARADOX_ENGINE: DungeonEvent = {
  id: 'paradox-engine',
  type: 'boss',
  title: 'Paradox Engine',
  description: 'A machine that runs on impossibilities. It exists and doesn\'t exist. It has already won and already lost. Logic breaks near it.',
  choices: [
    {
      text: 'Apply logic',
      outcome: {
        text: 'Logic fails completely! Paradoxes compound! Reality screams!',
        effects: [
          { type: 'damage', target: 'random', value: 632 },
          { type: 'xp', value: 2620 },
          { type: 'gold', value: 3930 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 51 },
        ],
      },
    },
    {
      text: 'Embrace paradox (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 90,
      },
      outcome: {
        text: 'You think in paradoxes! The impossible becomes your weapon!',
        effects: [
          { type: 'damage', target: 'all', value: 585 },
          { type: 'xp', value: 2780 },
          { type: 'gold', value: 4170 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 71 },
        ],
      },
    },
    {
      text: 'Smash it anyway (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'Paradox or not, everything breaks when hit hard enough!',
        effects: [
          { type: 'damage', target: 'strongest', value: 598 },
          { type: 'xp', value: 2810 },
          { type: 'gold', value: 4215 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 72 },
        ],
      },
    },
  ],
  depth: 90,
  icon: GiTwoCoins,
}
