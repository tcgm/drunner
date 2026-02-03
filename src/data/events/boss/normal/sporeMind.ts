import type { DungeonEvent } from '@/types'
import { GiMushroomCloud } from 'react-icons/gi'

export const SPORE_MIND: DungeonEvent = {
  id: 'spore-mind',
  type: 'boss',
  title: 'Spore Mind',
  description: 'A fungal hivemind that spreads through the air. Breathe its spores and become part of its collective consciousness.',
  choices: [
    {
      text: 'Fight while breathing',
      outcome: {
        text: 'The spores infiltrate your mind! You struggle against your own possession!',
        effects: [
          { type: 'damage', target: 'random', value: 390 },
          { type: 'xp', value: 1595 },
          { type: 'gold', value: 2393 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 31 },
        ],
      },
    },
    {
      text: 'Resist with willpower (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 67,
      },
      outcome: {
        text: 'Your mind is too strong! The spores cannot take root!',
        effects: [
          { type: 'damage', target: 'all', value: 318 },
          { type: 'xp', value: 1710 },
          { type: 'gold', value: 2565 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 38 },
        ],
      },
    },
    {
      text: 'Burn the colony (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Magical fire consumes the entire hivemind! The spore mind dies!',
        effects: [
          { type: 'damage', target: 'all', value: 332 },
          { type: 'xp', value: 1730 },
          { type: 'gold', value: 2595 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 39 },
        ],
      },
    },
  ],
  depth: 52,
  icon: GiMushroomCloud,
}
