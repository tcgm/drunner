import type { DungeonEvent } from '@/types'
import { GiCowled } from 'react-icons/gi'

export const DARK_CULTISTS: DungeonEvent = {
  id: 'dark-cultists',
  type: 'combat',
  title: 'Dark Cultists',
  description: 'Hooded figures surround you, chanting in an ancient tongue!',
  choices: [
    {
      text: 'Attack the cultists',
      outcome: {
        text: 'You disrupt their ritual with violence!',
        effects: [
          { type: 'damage', target: 'all', value: 18 },
          { type: 'xp', value: 70 },
          { type: 'gold', value: 40 },
        ],
      },
    },
    {
      text: 'Counter their magic (requires Mage or Necromancer)',
      requirements: {
        class: 'mage',
      },
      outcome: {
        text: 'You turn their dark magic against them!',
        effects: [
          { type: 'damage', target: 'random', value: 10 },
          { type: 'xp', value: 90 },
          { type: 'gold', value: 50 },
        ],
      },
    },
    {
      text: 'Join their chant (very risky)',
      possibleOutcomes: [
        {
          weight: 15,
          outcome: {
            text: 'You complete the ritual! They see you as one of them and flee!',
            effects: [
              { type: 'xp', value: 150 },
              { type: 'gold', value: 80 },
              { 
                type: 'item', 
                itemType: 'random',
                minRarity: 'rare',
                rarityBoost: 10
              },
            ],
          },
        },
        {
          weight: 35,
          outcome: {
            text: 'They pause, confused, before attacking with less conviction.',
            effects: [
              { type: 'damage', target: 'random', value: 12 },
              { type: 'xp', value: 70 },
              { type: 'gold', value: 40 },
            ],
          },
        },
        {
          weight: 50,
          outcome: {
            text: 'Your poor pronunciation angers them! They unleash dark magic!',
            effects: [
              { type: 'damage', target: 'all', value: 30 },
              { type: 'xp', value: 50 },
              { type: 'gold', value: 25 },
            ],
          },
        },
      ],
    },
  ],
  depth: 4,
  icon: GiCowled,
}
