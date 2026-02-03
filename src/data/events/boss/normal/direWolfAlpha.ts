import type { DungeonEvent } from '@/types'
import { GiWolfHowl } from 'react-icons/gi'

export const DIRE_WOLF_ALPHA: DungeonEvent = {
  id: 'dire-wolf-alpha',
  type: 'boss',
  title: 'Dire Wolf Alpha',
  description: 'A massive wolf with midnight black fur leads its pack. Its eyes gleam with predatory intelligence as it circles you.',
  choices: [
    {
      text: 'Fight the whole pack',
      outcome: {
        text: 'Wolves attack from all sides! You take down several but suffer many bites!',
        effects: [
          { type: 'damage', target: 'all', value: 31 },
          { type: 'xp', value: 190 },
          { type: 'gold', value: 280 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 10 },
        ],
      },
    },
    {
      text: 'Focus on the alpha (Ranger bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'You understand pack dynamics! Kill the alpha and the pack scatters!',
        effects: [
          { type: 'damage', target: 'weakest', value: 19 },
          { type: 'xp', value: 235 },
          { type: 'gold', value: 335 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 13 },
        ],
      },
    },
    {
      text: 'Use intimidation tactics (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 9,
      },
      outcome: {
        text: 'You stand your ground! The wolves sense your strength and retreat!',
        effects: [
          { type: 'damage', target: 'all', value: 15 },
          { type: 'xp', value: 225 },
          { type: 'gold', value: 325 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 12 },
        ],
      },
    },
  ],
  depth: 9,
  icon: GiWolfHowl,
}
