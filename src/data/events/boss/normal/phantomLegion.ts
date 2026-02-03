import type { DungeonEvent } from '@/types'
import { GiBroadsword } from 'react-icons/gi'

export const PHANTOM_LEGION: DungeonEvent = {
  id: 'phantom-legion',
  type: 'boss',
  title: 'Phantom Legion',
  description: 'Dozens of ghostly warriors materialize, an entire fallen army risen again. They move in perfect formation, spectral weapons gleaming.',
  choices: [
    {
      text: 'Fight the legion',
      outcome: {
        text: 'You\'re surrounded! Phantom blades strike from every direction!',
        effects: [
          { type: 'damage', target: 'all', value: 130 },
          { type: 'xp', value: 485 },
          { type: 'gold', value: 635 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 18 },
        ],
      },
    },
    {
      text: 'Lay them to rest (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'A prayer for the dead grants them peace! They fade gratefully!',
        effects: [
          { type: 'damage', target: 'all', value: 88 },
          { type: 'xp', value: 530 },
          { type: 'gold', value: 695 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 22 },
        ],
      },
    },
    {
      text: 'Destroy the banner (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 30,
      },
      outcome: {
        text: 'You shatter their rallying standard! The legion breaks and disperses!',
        effects: [
          { type: 'damage', target: 'random', value: 98 },
          { type: 'xp', value: 520 },
          { type: 'gold', value: 685 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', rarityBoost: 21 },
        ],
      },
    },
  ],
  depth: 24,
  icon: GiBroadsword,
}
