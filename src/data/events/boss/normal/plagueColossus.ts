import type { DungeonEvent } from '@/types'
import { GiGooExplosion } from 'react-icons/gi'

export const PLAGUE_COLOSSUS: DungeonEvent = {
  id: 'plague-colossus',
  type: 'boss',
  title: 'Plague Colossus',
  description: 'A titan made of concentrated disease and rot. Just standing near it causes illness. Its very existence threatens all life.',
  choices: [
    {
      text: 'Brave the pestilence',
      outcome: {
        text: 'Disease ravages your body! The colossus spreads plague with every movement!',
        effects: [
          { type: 'damage', target: 'all', value: 378 },
          { type: 'xp', value: 1550 },
          { type: 'gold', value: 2325 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 30 },
        ],
      },
    },
    {
      text: 'Purify the corruption (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your divine power cleanses the plague! The colossus crumbles!',
        effects: [
          { type: 'damage', target: 'all', value: 305 },
          { type: 'xp', value: 1670 },
          { type: 'gold', value: 2505 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 36 },
        ],
      },
    },
    {
      text: 'Strike before infected (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 62,
      },
      outcome: {
        text: 'You destroy it before the disease takes hold! Victory!',
        effects: [
          { type: 'damage', target: 'strongest', value: 318 },
          { type: 'xp', value: 1690 },
          { type: 'gold', value: 2535 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 37 },
        ],
      },
    },
  ],
  depth: 51,
  icon: GiGooExplosion,
}
