import type { DungeonEvent } from '@/types'
import { STEEL, IRON, MITHRIL } from '@/data/items/materials'
import { CHAINMAIL_BASE } from '@/data/items/bases/armor/chainmail'
import { PLATE_ARMOR_BASE } from '@/data/items/bases/armor/plate'

export const ARMORY_CACHE: DungeonEvent = {
  id: 'armory-cache',
  type: 'treasure', 
  title: 'Hidden Armory Cache',
  description: 'Behind a secret panel, you find a cache of well-preserved armor.',
  choices: [
    {
      text: 'Take the chainmail',
      outcome: {
        text: 'You don the flexible chainmail armor.',
        effects: [
          { type: 'item', baseTemplate: CHAINMAIL_BASE, material: IRON }, // Iron chainmail
        ],
      },
    },
    {
      text: 'Search for better armor (requires high Defense)',
      requirements: {
        stat: 'defense',
        minValue: 12,
      },
      outcome: {
        text: 'Your experience lets you identify the finest pieces!',
        effects: [
          { 
            type: 'item',
            itemChoices: [
              { weight: 60, baseTemplate: CHAINMAIL_BASE, material: STEEL },  // Steel chainmail
              { weight: 30, baseTemplate: PLATE_ARMOR_BASE, material: STEEL },      // Steel plate 
              { weight: 10, baseTemplate: PLATE_ARMOR_BASE, material: MITHRIL },    // Mithril plate
            ]
          },
        ],
      },
    },
    {
      text: 'Leave it - too heavy',
      outcome: {
        text: 'You decide the armor would slow you down.',
        effects: [
          { type: 'gold', value: 50 }, // Small consolation prize
        ],
      },
    },
  ],
  depth: 5,
}