import type { DungeonEvent } from '@/types'
import { GiFountain } from 'react-icons/gi'

export const MYSTERIOUS_FOUNTAIN: DungeonEvent = {
  id: 'mysterious-fountain',
  type: 'treasure',
  title: 'Mysterious Fountain',
  description: 'A fountain filled with glowing water. Gold coins glitter at the bottom.',
  choices: [
    {
      text: 'Take the gold',
      outcome: {
        text: 'You grab the coins from the fountain.',
        effects: [
          { type: 'gold', value: 100 },
        ],
      },
    },
    {
      text: 'Drink the water (unpredictable)',
      possibleOutcomes: [
        {
          weight: 15,
          outcome: {
            text: 'The water grants incredible power! You feel reborn!',
            effects: [
              { type: 'heal', target: 'all', value: 999 },
              { type: 'xp', value: 100 },
            ],
          },
        },
        {
          weight: 45,
          outcome: {
            text: 'The magical water restores your vitality!',
            effects: [
              { type: 'heal', target: 'all', value: 40 },
              { type: 'gold', value: 50 },
            ],
          },
        },
        {
          weight: 30,
          outcome: {
            text: 'The water tastes strange... nothing happens.',
            effects: [
              { type: 'gold', value: 50 },
            ],
          },
        },
        {
          weight: 10,
          outcome: {
            text: 'The water was cursed! You feel weakened!',
            effects: [
              { type: 'damage', target: 'all', value: 20 },
              { type: 'gold', value: 50 },
            ],
          },
        },
      ],
    },
    {
      text: 'Study the runes (requires Mage)',
      requirements: {
        class: 'mage',
      },
      outcome: {
        text: 'You unlock the fountain\'s true power!',
        effects: [
          { type: 'heal', target: 'all', value: 50 },
          { type: 'gold', value: 150 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 10 },
        ],
      },
    },
  ],
  depth: 2,
  icon: GiFountain,
}
