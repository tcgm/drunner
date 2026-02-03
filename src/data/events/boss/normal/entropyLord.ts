import type { DungeonEvent } from '@/types'
import { GiVortex } from 'react-icons/gi'

export const ENTROPY_LORD: DungeonEvent = {
  id: 'entropy-lord',
  type: 'boss',
  title: 'Entropy Lord',
  description: 'A being of pure decay and disorder. Everything it touches unravels into chaos. Order cannot exist near it.',
  choices: [
    {
      text: 'Resist entropy',
      outcome: {
        text: 'Your equipment rusts! Your body ages! Everything falls apart!',
        effects: [
          { type: 'damage', target: 'all', value: 538 },
          { type: 'xp', value: 2210 },
          { type: 'gold', value: 3315 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 43 },
        ],
      },
    },
    {
      text: 'Impose order (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Your magic creates perfect order! The entropy lord is negated!',
        effects: [
          { type: 'damage', target: 'all', value: 472 },
          { type: 'xp', value: 2340 },
          { type: 'gold', value: 3510 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 59 },
        ],
      },
    },
    {
      text: 'Embrace chaos (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 81,
      },
      outcome: {
        text: 'You find order in chaos! The lord\'s power cannot touch enlightenment!',
        effects: [
          { type: 'damage', target: 'all', value: 485 },
          { type: 'xp', value: 2365 },
          { type: 'gold', value: 3548 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 60 },
        ],
      },
    },
  ],
  depth: 75,
  icon: GiVortex,
}
