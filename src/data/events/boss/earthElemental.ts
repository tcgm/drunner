import type { DungeonEvent } from '@/types'
import { GiStonePile } from 'react-icons/gi'

export const EARTH_ELEMENTAL: DungeonEvent = {
  id: 'earth-elemental',
  type: 'boss',
  title: 'Earth Elemental',
  description: 'A massive being of living stone rumbles to life, shaking the very foundations of the dungeon. Each step creates tremors.',
  choices: [
    {
      text: 'Strike with all your might',
      outcome: {
        text: 'Your weapons chip away at the stone, but it\'s slow going!',
        effects: [
          { type: 'damage', target: 'all', value: 34 },
          { type: 'xp', value: 165 },
          { type: 'gold', value: 230 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 8 },
        ],
      },
    },
    {
      text: 'Find the core (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 10,
      },
      outcome: {
        text: 'You spot the glowing core! One precise strike and it crumbles!',
        effects: [
          { type: 'damage', target: 'weakest', value: 23 },
          { type: 'xp', value: 210 },
          { type: 'gold', value: 290 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 11 },
        ],
      },
    },
    {
      text: 'Command the earth (Druid bonus)',
      requirements: {
        class: 'Druid',
      },
      outcome: {
        text: 'You speak to the elemental\'s essence! It returns to the earth peacefully!',
        effects: [
          { type: 'damage', target: 'all', value: 12 },
          { type: 'xp', value: 230 },
          { type: 'gold', value: 310 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 13 },
        ],
      },
    },
  ],
  depth: 7,
  icon: GiStonePile,
}
