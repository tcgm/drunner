import type { DungeonEvent } from '@/types'
import { GiDualityMask } from 'react-icons/gi'

export const SHADOW_TWIN: DungeonEvent = {
  id: 'shadow-twin',
  type: 'boss',
  title: 'Shadow Twin',
  description: 'Two identical figures move in perfect synchronization, one of light and one of shadow. They attack as one entity, perfectly coordinated.',
  choices: [
    {
      text: 'Fight both at once',
      outcome: {
        text: 'Their coordinated assault is overwhelming! Every move is countered!',
        effects: [
          { type: 'damage', target: 'all', value: 125 },
          { type: 'xp', value: 475 },
          { type: 'gold', value: 625 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 18 },
        ],
      },
    },
    {
      text: 'Separate them (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 28,
      },
      outcome: {
        text: 'You force them apart! Divided, they are much weaker!',
        effects: [
          { type: 'damage', target: 'random', value: 92 },
          { type: 'xp', value: 520 },
          { type: 'gold', value: 680 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 22 },
        ],
      },
    },
    {
      text: 'Destroy the shadow (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Holy light banishes the shadow! The light twin fades without its counterpart!',
        effects: [
          { type: 'damage', target: 'all', value: 85 },
          { type: 'xp', value: 540 },
          { type: 'gold', value: 710 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', rarityBoost: 24 },
        ],
      },
    },
  ],
  depth: 25,
  icon: GiDualityMask,
}
