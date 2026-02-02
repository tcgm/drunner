import type { DungeonEvent } from '@/types'
import { GiSpikeball } from 'react-icons/gi'

export const RUST_MONSTER_ALPHA: DungeonEvent = {
  id: 'rust-monster-alpha',
  type: 'boss',
  title: 'Rust Monster Alpha',
  description: 'An enormous rust monster clicks its antennae together menacingly. Your metal equipment begins to corrode just from its proximity.',
  choices: [
    {
      text: 'Fight with corroding gear',
      outcome: {
        text: 'Your weapons and armor crumble as you fight! You\'re left nearly defenseless!',
        effects: [
          { type: 'damage', target: 'all', value: 132 },
          { type: 'xp', value: 480 },
          { type: 'gold', value: 630 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 18 },
        ],
      },
    },
    {
      text: 'Use magic attacks (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Spells bypass the rust! You destroy it from afar!',
        effects: [
          { type: 'damage', target: 'all', value: 85 },
          { type: 'xp', value: 525 },
          { type: 'gold', value: 690 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 22 },
        ],
      },
    },
    {
      text: 'Improvise weapons (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 29,
      },
      outcome: {
        text: 'You use stone and wood! The creature can\'t corrode non-metal weapons!',
        effects: [
          { type: 'damage', target: 'random', value: 92 },
          { type: 'xp', value: 515 },
          { type: 'gold', value: 675 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 21 },
        ],
      },
    },
  ],
  depth: 23,
  icon: GiSpikeball,
}
