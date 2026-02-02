import type { DungeonEvent } from '@/types'
import { GiBullHorns } from 'react-icons/gi'

export const MINOTAUR_GUARDIAN: DungeonEvent = {
  id: 'minotaur-guardian',
  type: 'boss',
  title: 'Minotaur Guardian',
  description: 'A towering bull-headed warrior blocks the passage, his massive axe gleaming. He snorts and paws the ground, ready to charge.',
  choices: [
    {
      text: 'Meet the charge head-on',
      outcome: {
        text: 'You brace yourself as the minotaur crashes into you! The impact is devastating!',
        effects: [
          { type: 'damage', target: 'all', value: 40 },
          { type: 'xp', value: 215 },
          { type: 'gold', value: 305 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 12 },
        ],
      },
    },
    {
      text: 'Dodge and counter (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You sidestep at the last moment! The minotaur crashes into the wall!',
        effects: [
          { type: 'damage', target: 'random', value: 26 },
          { type: 'xp', value: 255 },
          { type: 'gold', value: 355 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 15 },
        ],
      },
    },
    {
      text: 'Use the labyrinth (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 11,
      },
      outcome: {
        text: 'You lead him through the maze until he\'s exhausted and disoriented!',
        effects: [
          { type: 'damage', target: 'all', value: 22 },
          { type: 'xp', value: 245 },
          { type: 'gold', value: 345 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 14 },
        ],
      },
    },
  ],
  depth: 8,
  icon: GiBullHorns,
}
