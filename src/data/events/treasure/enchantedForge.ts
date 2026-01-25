import type { DungeonEvent } from '@/types'
import { STEEL, MITHRIL, DRAGONSCALE } from '@/data/items/materials'
import { EXCALIBUR } from '@/data/items/uniques/weapons/excalibur'
import { RING_OF_OMNIPOTENCE } from '@/data/items/uniques/accessories/ringOfOmnipotence'

export const ENCHANTED_FORGE: DungeonEvent = {
  id: 'enchanted-forge',
  type: 'treasure',
  title: 'Enchanted Forge',
  description: 'An ancient forge still burns with magical fire. You can craft something here.',
  choices: [
    {
      text: 'Forge a steel weapon',
      outcome: {
        text: 'You craft a fine steel weapon!',
        effects: [
          { type: 'item', material: STEEL, itemType: 'weapon' }, // Literal material import
        ],
      },
    },
    {
      text: 'Try advanced forging (requires high Attack)',
      requirements: {
        stat: 'attack',
        minValue: 15,
      },
      outcome: {
        text: 'Your skill allows you to work with rare materials!',
        effects: [
          { 
            type: 'item', 
            itemChoices: [ // Weighted choices array
              { weight: 60, material: MITHRIL, itemType: 'weapon' },
              { weight: 30, material: DRAGONSCALE, itemType: 'armor' },
              { weight: 10, uniqueItem: EXCALIBUR } // Literal unique import
            ]
          },
        ],
      },
    },
    {
      text: 'Examine the magical runes',
      outcome: {
        text: 'The runes reveal ancient knowledge!',
        effects: [
          { type: 'xp', value: 100 },
          { 
            type: 'item',
            itemChoices: [
              { weight: 70, itemType: 'random' },
              { weight: 30, uniqueItem: RING_OF_OMNIPOTENCE } // Guaranteed powerful accessory
            ]
          },
        ],
      },
    },
  ],
  depth: 8,
}