import type { DungeonEvent } from '@/types'
import { GiGooeyMolecule } from 'react-icons/gi'

export const GENESIS_CELL: DungeonEvent = {
  id: 'genesis-cell',
  type: 'boss',
  title: 'Genesis Cell',
  description: 'The first living organism, preserved since creation. It evolves and adapts in real-time, becoming the perfect predator.',
  choices: [
    {
      text: 'Fight evolution',
      outcome: {
        text: 'It adapts faster than you can attack! Every strike makes it stronger!',
        effects: [
          { type: 'damage', target: 'random', value: 618 },
          { type: 'xp', value: 2570 },
          { type: 'gold', value: 3855 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 50 },
        ],
      },
    },
    {
      text: 'Strike before adaptation (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'One perfect strike before it can evolve! The cell dies!',
        effects: [
          { type: 'damage', target: 'weakest', value: 565 },
          { type: 'xp', value: 2730 },
          { type: 'gold', value: 4095 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 69 },
        ],
      },
    },
    {
      text: 'Devolve it (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 89,
      },
      outcome: {
        text: 'You reverse its evolution! The genesis cell becomes inert!',
        effects: [
          { type: 'damage', target: 'all', value: 578 },
          { type: 'xp', value: 2760 },
          { type: 'gold', value: 4140 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 70 },
        ],
      },
    },
  ],
  depth: 88,
  icon: GiGooeyMolecule,
}
