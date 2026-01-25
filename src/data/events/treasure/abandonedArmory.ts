import type { DungeonEvent } from '@/types'
import { IRON, STEEL } from '@/data/items/materials'

export const ABANDONED_ARMORY: DungeonEvent = {
  id: 'abandoned-armory',
  type: 'treasure',
  title: 'Abandoned Armory',
  description: 'An old armory stands before you, weapons and armor scattered about.',
  choices: [
    {
      text: 'Search for usable equipment',
      outcome: {
        text: 'You find some decent gear!',
        effects: [
          { type: 'gold', value: 50 },
          { 
            type: 'item', 
            itemChoices: [ // Weighted choices for variety
              { weight: 70, itemType: 'weapon' },
              { weight: 30, itemType: 'armor' }
            ]
          },
        ],
      },
    },
    {
      text: 'Take everything (requires high Defense)',
      requirements: {
        stat: 'defense',
        minValue: 8,
      },
      outcome: {
        text: 'You carry out a hefty load of equipment!',
        effects: [
          { type: 'gold', value: 150 },
          { type: 'item', material: IRON, itemType: 'weapon' }, // Literal iron weapon
          { type: 'item', material: STEEL, itemType: 'armor' }, // Literal steel armor
        ],
      },
    },
    {
      text: 'Just take the gold',
      outcome: {
        text: 'You grab what\'s valuable and move on.',
        effects: [
          { type: 'gold', value: 80 },
        ],
      },
    },
  ],
  depth: 3,
}
