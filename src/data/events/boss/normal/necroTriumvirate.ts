import type { DungeonEvent } from '@/types'
import { GiSkullSlices } from 'react-icons/gi'

export const NECRO_TRIUMVIRATE: DungeonEvent = {
  id: 'necro-triumvirate',
  type: 'boss',
  title: 'Necro-Triumvirate',
  description: 'Three liches who share a single phylactery. They coordinate perfectly, complementing each other\'s spells in deadly combinations.',
  choices: [
    {
      text: 'Fight all three',
      outcome: {
        text: 'Triple-layered necromancy! One casts, another defends, the third drains your life!',
        effects: [
          { type: 'damage', target: 'all', value: 405 },
          { type: 'xp', value: 1630 },
          { type: 'gold', value: 2445 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 32 },
        ],
      },
    },
    {
      text: 'Banish them (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Holy power drives all three back! You destroy their shared phylactery!',
        effects: [
          { type: 'damage', target: 'all', value: 328 },
          { type: 'xp', value: 1750 },
          { type: 'gold', value: 2625 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 40 },
        ],
      },
    },
    {
      text: 'Turn them against each other (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 64,
      },
      outcome: {
        text: 'You exploit their shared phylactery! Their cooperation becomes their weakness!',
        effects: [
          { type: 'damage', target: 'random', value: 342 },
          { type: 'xp', value: 1770 },
          { type: 'gold', value: 2655 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 41 },
        ],
      },
    },
  ],
  depth: 55,
  icon: GiSkullSlices,
}
