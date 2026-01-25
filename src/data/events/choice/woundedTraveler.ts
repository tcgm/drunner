import type { DungeonEvent } from '@/types'

export const WOUNDED_TRAVELER: DungeonEvent = {
  id: 'wounded-traveler',
  type: 'choice',
  title: 'Wounded Traveler',
  description: 'A bleeding traveler lies against the wall. He offers gold for healing.',
  choices: [
    {
      text: 'Heal him for free',
      outcome: {
        text: 'He blesses you and shares knowledge of the dungeon.',
        effects: [
          { type: 'xp', value: 30 },
        ],
      },
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
