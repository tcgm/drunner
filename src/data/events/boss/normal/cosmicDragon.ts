import type { DungeonEvent } from '@/types'
import { GiDragonHead } from 'react-icons/gi'

export const COSMIC_DRAGON: DungeonEvent = {
  id: 'cosmic-dragon',
  type: 'boss',
  title: 'Cosmic Dragon',
  description: 'A wyrm born from the stars themselves. It breathes galaxies and bleeds starlight. Reality bends in its presence.',
  choices: [
    {
      text: 'Face cosmic power',
      possibleOutcomes: [
        {
          weight: 85,
          outcome: {
            text: 'The universe itself attacks you! Stars explode in miniature supernovas!',
            effects: [
              { type: 'damage', target: 'all', value: 528 },
              { type: 'xp', value: 2175 },
              { type: 'gold', value: 3263 },
              { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 42 },
            ],
          },
        },
        {
          weight: 15,
          outcome: {
            text: 'The universe itself attacks you! Stars explode in miniature supernovas! A cosmic-forged draconic relic materializes!',
            effects: [
              { type: 'damage', target: 'all', value: 528 },
              { type: 'xp', value: 2175 },
              { type: 'gold', value: 3263 },
              { 
                type: 'item', 
                itemChoices: [
                  { weight: 85, itemType: 'random', minRarity: 'legendary', rarityBoost: 42 },
                  { weight: 15, setId: 'draconic' }
                ]
              },
            ],
          },
        },
      ],
    },
    {
      text: 'Match cosmic scale (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 80,
      },
      possibleOutcomes: [
        {
          weight: 80,
          outcome: {
            text: 'You expand your consciousness to cosmic scope! The dragon is merely one more star!',
            effects: [
              { type: 'damage', target: 'all', value: 465 },
              { type: 'xp', value: 2305 },
              { type: 'gold', value: 3458 },
              { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 57 },
            ],
          },
        },
        {
          weight: 20,
          outcome: {
            text: 'You expand your consciousness to cosmic scope! The dragon is merely one more star! From the cosmic flames, draconic artifacts emerge!',
            effects: [
              { type: 'damage', target: 'all', value: 465 },
              { type: 'xp', value: 2305 },
              { type: 'gold', value: 3458 },
              { 
                type: 'item', 
                itemChoices: [
                  { weight: 80, itemType: 'weapon', minRarity: 'legendary', rarityBoost: 57 },
                  { weight: 20, setId: 'draconic' }
                ]
              },
            ],
          },
        },
      ],
    },
    {
      text: 'Strike the constellation (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      possibleOutcomes: [
        {
          weight: 80,
          outcome: {
            text: 'You find the pattern! Every dragon has a heart, even cosmic ones!',
            effects: [
              { type: 'damage', target: 'weakest', value: 478 },
              { type: 'xp', value: 2330 },
              { type: 'gold', value: 3495 },
              { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 58 },
            ],
          },
        },
        {
          weight: 20,
          outcome: {
            text: 'You find the pattern! Every dragon has a heart, even cosmic ones! Its death releases primordial draconic power!',
            effects: [
              { type: 'damage', target: 'weakest', value: 478 },
              { type: 'xp', value: 2330 },
              { type: 'gold', value: 3495 },
              { 
                type: 'item', 
                itemChoices: [
                  { weight: 80, itemType: 'armor', minRarity: 'legendary', rarityBoost: 58 },
                  { weight: 20, setId: 'draconic' }
                ]
              },
            ],
          },
        },
      ],
    },
  ],
  depth: 73,
  icon: GiDragonHead,
}
