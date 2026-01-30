import type { DungeonEvent } from '@/types'
import { IRON, STEEL } from '@/data/items/materials'
import { GiAbdominalArmor } from 'react-icons/gi'

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
              { weight: 70, itemType: 'weapon', minRarity: 'common', maxRarity: 'uncommon' }, // Abandoned/old
              { weight: 30, itemType: 'armor', minRarity: 'common', maxRarity: 'uncommon' } // Abandoned/old
            ]
          },
        ],
      },
    },
    {
      text: 'Take everything (requires high Defense)',
      requirements: {
        stat: 'defense',
        minValue: 40,
      },
      outcome: {
        text: 'You carry out a hefty load of equipment!',
        effects: [
          { type: 'gold', value: 150 },
          { type: 'item', material: IRON, itemType: 'weapon', minRarity: 'common' },
          { type: 'item', material: STEEL, itemType: 'armor', minRarity: 'uncommon' },
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
  icon: GiAbdominalArmor,
}
