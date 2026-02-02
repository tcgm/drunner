import type { DungeonEvent } from '@/types'
import { GiPoisonCloud } from 'react-icons/gi'

export const PLAGUE_BEARER: DungeonEvent = {
  id: 'plague-bearer',
  type: 'boss',
  title: 'Plague Bearer',
  description: 'A bloated demon oozes disease and pestilence. Clouds of toxic gas surround it, and its very touch spreads corruption.',
  choices: [
    {
      text: 'Fight through the plague',
      outcome: {
        text: 'Disease ravages your body! Every breath brings more poison!',
        effects: [
          { type: 'damage', target: 'all', value: 143 },
          { type: 'xp', value: 502 },
          { type: 'gold', value: 662 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Purify the air (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Holy light cleanses the plague! The demon withers without its pestilence!',
        effects: [
          { type: 'damage', target: 'all', value: 100 },
          { type: 'xp', value: 545 },
          { type: 'gold', value: 715 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Resist the disease (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 32,
      },
      outcome: {
        text: 'Your constitution is iron! The plague has no effect on you!',
        effects: [
          { type: 'damage', target: 'all', value: 107 },
          { type: 'xp', value: 538 },
          { type: 'gold', value: 703 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 23 },
        ],
      },
    },
  ],
  depth: 26,
  icon: GiPoisonCloud,
}
