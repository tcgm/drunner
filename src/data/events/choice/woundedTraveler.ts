import type { DungeonEvent } from '@/types'

export const WOUNDED_TRAVELER: DungeonEvent = {
  id: 'wounded-traveler',
  type: 'choice',
  title: 'Wounded Traveler',
  description: 'A bleeding traveler lies against the wall. He offers gold for healing.',
  choices: [
    {
      text: 'Heal him for free',
      possibleOutcomes: [
        {
          weight: 50,
          outcome: {
            text: 'He blesses you warmly and shares valuable knowledge!',
            effects: [
              { type: 'xp', value: 80 },
            ],
          },
        },
        {
          weight: 30,
          outcome: {
            text: 'He thanks you and shares some gold he had hidden.',
            effects: [
              { type: 'xp', value: 40 },
              { type: 'gold', value: 60 },
            ],
          },
        },
        {
          weight: 20,
          outcome: {
            text: 'It was a trap! He was a shapeshifter who attacks!',
            effects: [
              { type: 'damage', target: 'random', value: 30 },
              { type: 'xp', value: 40 },
            ],
          },
        },
      ],
    },
    {
      text: 'Accept his gold',
      outcome: {
        text: 'He pays you and limps away.',
        effects: [
          { type: 'gold', value: 50 },
        ],
      },
    },
    {
      text: 'Rob him',
      outcome: {
        text: 'You take his belongings. A dark feeling washes over you.',
        effects: [
          { type: 'gold', value: 100 },
          { type: 'status', value: -1 },
        ],
      },
    },
    {
      text: 'Ignore him',
      outcome: {
        text: 'You walk past without a word.',
        effects: [],
      },
    },
  ],
  depth: 2,
}
