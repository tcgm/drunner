import type { DungeonEvent } from '@/types'
import { GiBrain } from 'react-icons/gi'

export const THOUGHT_PARASITES: DungeonEvent = {
  id: 'thought-parasites',
  type: 'combat',
  title: 'Thought Parasites',
  description: 'Psychic leeches burrow into your consciousness!',
  choices: [
    {
      text: 'Let them feed',
      outcome: {
        text: 'Your thoughts become theirs!',
        effects: [
          { type: 'damage', target: 'weakest', value: 100 },
          { type: 'xp', value: 531 },
          { type: 'gold', value: 408 },
        ],
      },
    },
    {
      text: 'Starve them (Defense check)',
      requirements: { stat: 'defense', minValue: 153 },
      outcome: {
        text: 'You deny them entry!',
        effects: [
          { type: 'damage', target: 'weakest', value: 89 },
          { type: 'xp', value: 551 },
          { type: 'gold', value: 428 },
        ],
      },
    },
  ],
  depth: 64,
  icon: GiBrain,
}
