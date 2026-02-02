import type { DungeonEvent } from '@/types'
import { GiSnakeTongue } from 'react-icons/gi'

export const VENOMOUS_SERPENTS: DungeonEvent = {
  id: 'venomous-serpents',
  type: 'combat',
  title: 'Venomous Serpents',
  description: 'Hissing snakes coil and strike from the darkness!',
  choices: [
    {
      text: 'Fight them off',
      outcome: {
        text: 'You avoid their venomous bites!',
        effects: [
          { type: 'damage', target: 'weakest', value: 11 },
          { type: 'xp', value: 38 },
          { type: 'gold', value: 19 },
        ],
      },
    },
    {
      text: 'Quick reflexes (Speed check)',
      requirements: { stat: 'speed', minValue: 14 },
      outcome: {
        text: 'You dodge strikes and counter!',
        effects: [
          { type: 'damage', target: 'weakest', value: 6 },
          { type: 'xp', value: 48 },
          { type: 'gold', value: 27 },
        ],
      },
    },
    {
      text: 'Precise strikes (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You strike before they can react!',
        effects: [
          { type: 'damage', target: 'weakest', value: 4 },
          { type: 'xp', value: 52 },
          { type: 'gold', value: 32 },
        ],
      },
    },
  ],
  depth: 6,
  icon: GiSnakeTongue,
}
