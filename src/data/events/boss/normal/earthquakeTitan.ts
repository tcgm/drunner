import type { DungeonEvent } from '@/types'
import { GiEarthCrack } from 'react-icons/gi'

export const EARTHQUAKE_TITAN: DungeonEvent = {
  id: 'earthquake-titan',
  type: 'boss',
  title: 'Earthquake Titan',
  description: 'A colossal earth elemental whose every step triggers tremors. The ground itself obeys its will, creating fissures and spikes at command.',
  choices: [
    {
      text: 'Fight on unstable ground',
      outcome: {
        text: 'The floor collapses beneath you! Stone spikes erupt as you fall!',
        effects: [
          { type: 'damage', target: 'all', value: 172 },
          { type: 'xp', value: 695 },
          { type: 'gold', value: 1005 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Calm the earth (Druid bonus)',
      requirements: {
        class: 'Druid',
      },
      outcome: {
        text: 'You speak to the earth itself! It no longer obeys the titan!',
        effects: [
          { type: 'damage', target: 'all', value: 132 },
          { type: 'xp', value: 750 },
          { type: 'gold', value: 1070 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Shatter its core (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 38,
      },
      outcome: {
        text: 'You reach its crystalline heart and pulverize it! The titan crumbles!',
        effects: [
          { type: 'damage', target: 'random', value: 152 },
          { type: 'xp', value: 770 },
          { type: 'gold', value: 1095 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', rarityBoost: 24 },
        ],
      },
    },
  ],
  depth: 32,
  icon: GiEarthCrack,
}
