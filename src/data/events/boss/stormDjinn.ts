import type { DungeonEvent } from '@/types'
import { GiTornado } from 'react-icons/gi'

export const STORM_DJINN: DungeonEvent = {
  id: 'storm-djinn',
  type: 'boss',
  title: 'Storm Djinn',
  description: 'A being of living wind and lightning materializes from a swirling vortex. Thunder crashes with each gesture as it regards you with ancient eyes.',
  choices: [
    {
      text: 'Weather the storm',
      outcome: {
        text: 'Lightning bolts and wind blasts buffet you mercilessly! The storm rages!',
        effects: [
          { type: 'damage', target: 'all', value: 77 },
          { type: 'xp', value: 338 },
          { type: 'gold', value: 448 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'epic', rarityBoost: 15 },
        ],
      },
    },
    {
      text: 'Dispel the magic (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You unweave the djinn\'s essence! It dissipates into calm air!',
        effects: [
          { type: 'damage', target: 'all', value: 54 },
          { type: 'xp', value: 374 },
          { type: 'gold', value: 489 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 19 },
        ],
      },
    },
    {
      text: 'Ground the lightning (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 20,
      },
      outcome: {
        text: 'Your metal armor grounds the strikes! The djinn\'s power is nullified!',
        effects: [
          { type: 'damage', target: 'weakest', value: 61 },
          { type: 'xp', value: 369 },
          { type: 'gold', value: 479 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 18 },
        ],
      },
    },
  ],
  depth: 18,
  icon: GiTornado,
}
