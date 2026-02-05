import type { DungeonEvent } from '@/types'
import { GiSpikedDragonHead } from 'react-icons/gi'

export const ADAMANT_DRAGON: DungeonEvent = {
  id: 'adamant-dragon',
  type: 'boss',
  title: 'Adamant Dragon',
  description: 'A wyrm with metallic scales harder than any armor. Its breath weapon is superheated metal shards that pierce everything.',
  choices: [
    {
      text: 'Tank the shards',
      possibleOutcomes: [
        {
          weight: 90,
          outcome: {
            text: 'Molten metal pierces your defenses! The dragon is impenetrable!',
            effects: [
              { type: 'damage', target: 'all', value: 420 },
              { type: 'xp', value: 1680 },
              { type: 'gold', value: 2520 },
              { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 33 },
            ],
          },
        },
        {
          weight: 10,
          outcome: {
            text: 'Molten metal pierces your defenses! The dragon is impenetrable! One of its adamant scales falls, imbued with ancient power!',
            effects: [
              { type: 'damage', target: 'all', value: 420 },
              { type: 'xp', value: 1680 },
              { type: 'gold', value: 2520 },
              { 
                type: 'item', 
                itemChoices: [
                  { weight: 90, itemType: 'random', minRarity: 'epic', rarityBoost: 33 },
                  { weight: 10, setId: 'draconic' }
                ]
              },
            ],
          },
        },
      ],
    },
    {
      text: 'Exploit weak points (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 64,
      },
      possibleOutcomes: [
        {
          weight: 85,
          outcome: {
            text: 'You strike between the scales! Even adamant has gaps!',
            effects: [
              { type: 'damage', target: 'strongest', value: 348 },
              { type: 'xp', value: 1800 },
              { type: 'gold', value: 2700 },
              { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 43 },
            ],
          },
        },
        {
          weight: 15,
          outcome: {
            text: 'You strike between the scales! Even adamant has gaps! The dying dragon leaves behind a legendary draconic relic!',
            effects: [
              { type: 'damage', target: 'strongest', value: 348 },
              { type: 'xp', value: 1800 },
              { type: 'gold', value: 2700 },
              { 
                type: 'item', 
                itemChoices: [
                  { weight: 85, itemType: 'weapon', minRarity: 'legendary', rarityBoost: 43 },
                  { weight: 15, setId: 'draconic' }
                ]
              },
            ],
          },
        },
      ],
    },
    {
      text: 'Turn its breath back (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      possibleOutcomes: [
        {
          weight: 85,
          outcome: {
            text: 'You reflect the metal shards! The dragon is destroyed by its own weapon!',
            effects: [
              { type: 'damage', target: 'all', value: 362 },
              { type: 'xp', value: 1825 },
              { type: 'gold', value: 2738 },
              { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 44 },
            ],
          },
        },
        {
          weight: 15,
          outcome: {
            text: 'You reflect the metal shards! The dragon is destroyed by its own weapon! A fang infused with draconic magic remains!',
            effects: [
              { type: 'damage', target: 'all', value: 362 },
              { type: 'xp', value: 1825 },
              { type: 'gold', value: 2738 },
              { 
                type: 'item', 
                itemChoices: [
                  { weight: 85, itemType: 'armor', minRarity: 'legendary', rarityBoost: 44 },
                  { weight: 15, setId: 'draconic' }
                ]
              },
            ],
          },
        },
      ],
    },
  ],
  depth: 59,
  icon: GiSpikedDragonHead,
}
