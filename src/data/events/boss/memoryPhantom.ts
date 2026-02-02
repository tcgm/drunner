import type { DungeonEvent } from '@/types'
import { GiSpookyHouse } from 'react-icons/gi'

export const MEMORY_PHANTOM: DungeonEvent = {
  id: 'memory-phantom',
  type: 'boss',
  title: 'Memory Phantom',
  description: 'A ghost made from forgotten memories. It knows everything you\'ve forgotten. It is every regret, every lost moment made manifest.',
  choices: [
    {
      text: 'Face forgotten pain',
      outcome: {
        text: 'Every regret returns! Lost memories cut deeper than any blade!',
        effects: [
          { type: 'damage', target: 'all', value: 578 },
          { type: 'xp', value: 2435 },
          { type: 'gold', value: 3653 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 47 },
        ],
      },
    },
    {
      text: 'Accept the past (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 85,
      },
      outcome: {
        text: 'You embrace what was lost! The phantom finds peace!',
        effects: [
          { type: 'damage', target: 'all', value: 505 },
          { type: 'xp', value: 2565 },
          { type: 'gold', value: 3848 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 65 },
        ],
      },
    },
    {
      text: 'Banish regret (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Divine grace releases all pain! The phantom is freed!',
        effects: [
          { type: 'damage', target: 'all', value: 518 },
          { type: 'xp', value: 2590 },
          { type: 'gold', value: 3885 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 66 },
        ],
      },
    },
  ],
  depth: 82,
  icon: GiSpookyHouse,
}
