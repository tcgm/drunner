import type { DungeonEvent } from '@/types'

export const MYSTICAL_GARDEN: DungeonEvent = {
  id: 'mystical-garden',
  type: 'rest',
  title: 'Mystical Garden',
  description: 'An underground garden thrives here with glowing plants and strange fruits.',
  choices: [
    {
      text: 'Eat the fruit (unpredictable)',
      possibleOutcomes: [
        {
          weight: 15,
          outcome: {
            text: 'The fruit contains immense vitality! You feel incredible!',
            effects: [
              { type: 'heal', target: 'all', value: 999 },
              { type: 'xp', value: 50 },
            ],
          },
        },
        {
          weight: 60,
          outcome: {
            text: 'The fruit is delicious and healing!',
            effects: [
              { type: 'heal', target: 'all', value: 60 },
            ],
          },
        },
        {
          weight: 20,
          outcome: {
            text: 'The fruit tastes good but makes you drowsy...',
            effects: [
              { type: 'heal', target: 'all', value: 30 },
            ],
          },
        },
        {
          weight: 5,
          outcome: {
            text: 'The fruit was poisonous! You feel sick!',
            effects: [
              { type: 'damage', target: 'all', value: 15 },
            ],
          },
        },
      ],
    },
    {
      text: 'Rest among the plants',
      outcome: {
        text: 'The garden\'s magic rejuvenates you completely.',
        effects: [
          { type: 'heal', target: 'all', value: 999 }, // Full heal
          { type: 'xp', value: 30 },
        ],
      },
    },
    {
      text: 'Lay among the plants and... explore',
      possibleOutcomes: [
        {
          weight: 60,
          outcome: {
            text: 'You rest peacefully among the plants. The garden\'s energy soothes you.',
            effects: [
              { type: 'heal', target: 'all', value: 70 },
              { type: 'xp', value: 40 },
            ],
          },
        },
        {
          weight: 30,
          outcome: {
            text: 'As you relax among the vegetation, some vines begin to move of their own accord. They wrap gently around you in ways that are surprisingly... pleasant. You emerge feeling oddly invigorated.',
            effects: [
              { type: 'heal', target: 'all', value: 90 },
              { type: 'xp', value: 60 },
            ],
          },
        },
        {
          weight: 10,
          outcome: {
            text: 'The vines are more aggressive than expected! You struggle free, flustered but unharmed.',
            effects: [
              { type: 'heal', target: 'all', value: 50 },
              { type: 'xp', value: 30 },
            ],
          },
        },
      ],
    },
    {
      text: 'Study the plants (Ranger bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'You identify valuable herbs and medicinal plants!',
        effects: [
          { type: 'heal', target: 'all', value: 70 },
          { type: 'xp', value: 70 },
          { type: 'item', itemType: 'accessory1', minRarity: 'uncommon', maxRarity: 'rare' },
        ],
      },
    },
    {
      text: 'Don\'t trust it',
      outcome: {
        text: 'You avoid the strange garden and move on.',
        effects: [],
      },
    },
  ],
  depth: 4,
}
