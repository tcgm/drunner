import type { DungeonEvent } from '@/types'
import { GiDragonHead } from 'react-icons/gi'

export const ANCIENT_RED_DRAGON: DungeonEvent = {
  id: 'ancient-red-dragon',
  type: 'boss',
  title: 'Ancient Red Dragon',
  description: 'A truly ancient wyrm with scales like molten metal. Its hoard fills the cavern, and its breath could melt stone itself.',
  choices: [
    {
      text: 'Face the dragon',
      possibleOutcomes: [
        {
          weight: 85,
          outcome: {
            text: 'Dragonfire washes over you! Claws and fangs tear at you as you burn!',
            effects: [
              { type: 'damage', target: 'all', value: 340 },
              { type: 'xp', value: 1260 },
              { type: 'gold', value: 1890 },
              { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 26 },
            ],
          },
        },
        {
          weight: 15,
          outcome: {
            text: 'Dragonfire washes over you! As the wyrm falls, a piece of its legendary hoard glows with draconic power!',
            effects: [
              { type: 'damage', target: 'all', value: 340 },
              { type: 'xp', value: 1260 },
              { type: 'gold', value: 1890 },
              { 
                type: 'item', 
                itemChoices: [
                  { weight: 80, itemType: 'random', minRarity: 'epic', rarityBoost: 26 },
                  { weight: 20, setId: 'draconic' }
                ]
              },
            ],
          },
        },
      ],
    },
    {
      text: 'Strike vital spots (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 58,
      },
      possibleOutcomes: [
        {
          weight: 75,
          outcome: {
            text: 'You pierce beneath the scales! The ancient wyrm roars its last!',
            effects: [
              { type: 'damage', target: 'strongest', value: 285 },
              { type: 'xp', value: 1380 },
              { type: 'gold', value: 2070 },
              { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 32 },
            ],
          },
        },
        {
          weight: 25,
          outcome: {
            text: 'You pierce beneath the scales! The ancient wyrm roars its last! A scale falls, forged by dragonfire into legendary armor!',
            effects: [
              { type: 'damage', target: 'strongest', value: 285 },
              { type: 'xp', value: 1380 },
              { type: 'gold', value: 2070 },
              { 
                type: 'item', 
                itemChoices: [
                  { weight: 75, itemType: 'weapon', minRarity: 'legendary', rarityBoost: 32 },
                  { weight: 25, setId: 'draconic' }
                ]
              },
            ],
          },
        },
      ],
    },
    {
      text: 'Negotiate tribute (Bard bonus)',
      requirements: {
        class: 'Bard',
      },
      possibleOutcomes: [
        {
          weight: 80,
          outcome: {
            text: 'Your flattery appeals to its vanity! The dragon grants passage for tribute!',
            effects: [
              { type: 'damage', target: 'all', value: 145 },
              { type: 'xp', value: 1300 },
              { type: 'gold', value: 2450 },
              { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 28 },
            ],
          },
        },
        {
          weight: 20,
          outcome: {
            text: 'Your flattery appeals to its vanity! The dragon grants passage and a gift from its ancient hoard!',
            effects: [
              { type: 'damage', target: 'all', value: 145 },
              { type: 'xp', value: 1300 },
              { type: 'gold', value: 2450 },
              { 
                type: 'item', 
                itemChoices: [
                  { weight: 80, itemType: 'random', minRarity: 'legendary', rarityBoost: 28 },
                  { weight: 20, setId: 'draconic' }
                ]
              },
            ],
          },
        },
      ],
    },
  ],
  depth: 49,
  icon: GiDragonHead,
}
