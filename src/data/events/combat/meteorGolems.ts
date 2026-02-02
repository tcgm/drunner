import type { DungeonEvent } from '@/types'
import { GiMeteorImpact } from 'react-icons/gi'

export const METEOR_GOLEMS: DungeonEvent = {
  id: 'meteor-golems',
  type: 'combat',
  title: 'Meteor Golems',
  description: 'Constructs of space rock radiate cosmic energy!',
  choices: [
    {
      text: 'Smash them',
      outcome: {
        text: 'Cosmic energy burns you!',
        effects: [
          { type: 'damage', target: 'strongest', value: 45 },
          { type: 'xp', value: 183 },
          { type: 'gold', value: 128 },
        ],
      },
    },
    {
      text: 'Power strikes (Strength check)',
      requirements: { stat: 'attack', minValue: 75 },
      outcome: {
        text: 'You shatter their core!',
        effects: [
          { type: 'damage', target: 'strongest', value: 34 },
          { type: 'xp', value: 203 },
          { type: 'gold', value: 148 },
        ],
      },
    },
  ],
  depth: 30,
  icon: GiMeteorImpact,
}
