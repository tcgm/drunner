import type { DungeonEvent } from '@/types'
import { GiSnakeTongue } from 'react-icons/gi'

export const SERPENT_PRIEST: DungeonEvent = {
  id: 'serpent-priest',
  type: 'boss',
  title: 'Serpent Priest',
  description: 'A cultist with serpentine features chants in an ancient tongue. Snakes coil around their staff, and their eyes gleam with reptilian malice.',
  choices: [
    {
      text: 'Fight priest and snakes',
      outcome: {
        text: 'Venomous snakes strike from all sides while the priest hexes you!',
        effects: [
          { type: 'damage', target: 'all', value: 69 },
          { type: 'xp', value: 308 },
          { type: 'gold', value: 408 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'epic', rarityBoost: 13 },
        ],
      },
    },
    {
      text: 'Disrupt the ritual (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 17,
      },
      outcome: {
        text: 'You break the chant! The snakes turn on their master!',
        effects: [
          { type: 'damage', target: 'weakest', value: 49 },
          { type: 'xp', value: 352 },
          { type: 'gold', value: 462 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 16 },
        ],
      },
    },
    {
      text: 'Speak with serpents (Druid bonus)',
      requirements: {
        class: 'Druid',
      },
      outcome: {
        text: 'The snakes obey your commands! They abandon the priest!',
        effects: [
          { type: 'damage', target: 'all', value: 42 },
          { type: 'xp', value: 360 },
          { type: 'gold', value: 470 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 17 },
        ],
      },
    },
  ],
  depth: 13,
  icon: GiSnakeTongue,
}
