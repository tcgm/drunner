import type { DungeonEvent } from '@/types'
import { GiSpiderFace } from 'react-icons/gi'

export const PHASE_SPIDER: DungeonEvent = {
  id: 'phase-spider',
  type: 'boss',
  title: 'Phase Spider',
  description: 'An otherworldly arachnid flickers in and out of reality. One moment it\'s before you, the next it phases through walls to attack from behind.',
  choices: [
    {
      text: 'Chase the spider',
      outcome: {
        text: 'It phases away from your attacks! You\'re struck from impossible angles!',
        effects: [
          { type: 'damage', target: 'all', value: 66 },
          { type: 'xp', value: 316 },
          { type: 'gold', value: 416 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 14 },
        ],
      },
    },
    {
      text: 'Predict its movements (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 20,
      },
      outcome: {
        text: 'You anticipate where it will phase! Your strike catches it mid-shift!',
        effects: [
          { type: 'damage', target: 'random', value: 48 },
          { type: 'xp', value: 358 },
          { type: 'gold', value: 468 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 17 },
        ],
      },
    },
    {
      text: 'Trap it between planes (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Your dimensional anchor locks it in place! It\'s helpless!',
        effects: [
          { type: 'damage', target: 'all', value: 45 },
          { type: 'xp', value: 364 },
          { type: 'gold', value: 474 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 18 },
        ],
      },
    },
  ],
  depth: 16,
  icon: GiSpiderFace,
}
