import type { DungeonEvent } from '@/types'
import { STEEL } from '@/data/items/materials'
import { EXCALIBUR } from '@/data/items/uniques/weapons/excalibur'
import { RING_OF_OMNIPOTENCE } from '@/data/items/uniques/accessories/ringOfOmnipotence'
import { GiAnvil } from 'react-icons/gi'

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
          { type: 'item', material: STEEL, itemType: 'weapon', minRarity: 'common', maxRarity: 'uncommon' }, // Basic forging
        ],
      },
    },
    {
      text: 'Try advanced forging (requires high Attack)',
      requirements: {
        stat: 'attack',
        minValue: 75,
      },
      outcome: {
        text: 'Your skill allows you to work with rare materials!',
        effects: [
          { 
            type: 'item', 
            itemChoices: [ // Weighted choices array
              { weight: 60, itemType: 'weapon', minRarity: 'rare', rarityBoost: 10 },
              { weight: 30, itemType: 'armor', minRarity: 'rare', rarityBoost: 15 },
              { weight: 10, uniqueItem: EXCALIBUR }
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
              { weight: 70, itemType: 'random', minRarity: 'uncommon', rarityBoost: 20 },
              { weight: 30, uniqueItem: RING_OF_OMNIPOTENCE }
            ]
          },
        ],
      },
    },
  ],
  depth: 8,
  icon: GiAnvil,
}