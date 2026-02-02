import type { DungeonEvent } from '@/types'
import { GiSpikedDragonHead } from 'react-icons/gi'

export const PRIMORDIAL_WYRM: DungeonEvent = {
  id: 'primordial-wyrm',
  type: 'boss',
  title: 'Primordial Wyrm',
  description: 'The first dragon, older than mountains. Its scales are continental plates, its breath shapes weather patterns.',
  choices: [
    {
      text: 'Face the first dragon',
      outcome: {
        text: 'Primal dragon magic! The source of all draconic power!',
        effects: [
          { type: 'damage', target: 'all', value: 592 },
          { type: 'xp', value: 2485 },
          { type: 'gold', value: 3728 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 48 },
        ],
      },
    },
    {
      text: 'Prove your evolution (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 87,
      },
      outcome: {
        text: 'You represent the pinnacle of progress! Even the primordial must yield!',
        effects: [
          { type: 'damage', target: 'all', value: 532 },
          { type: 'xp', value: 2615 },
          { type: 'gold', value: 3923 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 66 },
        ],
      },
    },
    {
      text: 'Slay the legend (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You become the first dragonslayer! The wyrm falls to your blade!',
        effects: [
          { type: 'damage', target: 'strongest', value: 545 },
          { type: 'xp', value: 2645 },
          { type: 'gold', value: 3968 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 67 },
        ],
      },
    },
  ],
  depth: 84,
  icon: GiSpikedDragonHead,
}
