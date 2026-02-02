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
      outcome: {
        text: 'The universe itself attacks you! Stars explode in miniature supernovas!',
        effects: [
          { type: 'damage', target: 'all', value: 528 },
          { type: 'xp', value: 2175 },
          { type: 'gold', value: 3263 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 42 },
        ],
      },
    },
    {
      text: 'Match cosmic scale (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 80,
      },
      outcome: {
        text: 'You expand your consciousness to cosmic scope! The dragon is merely one more star!',
        effects: [
          { type: 'damage', target: 'all', value: 465 },
          { type: 'xp', value: 2305 },
          { type: 'gold', value: 3458 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 57 },
        ],
      },
    },
    {
      text: 'Strike the constellation (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You find the pattern! Every dragon has a heart, even cosmic ones!',
        effects: [
          { type: 'damage', target: 'weakest', value: 478 },
          { type: 'xp', value: 2330 },
          { type: 'gold', value: 3495 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 58 },
        ],
      },
    },
  ],
  depth: 73,
  icon: GiDragonHead,
}
