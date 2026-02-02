import type { DungeonEvent } from '@/types'
import { GiTentacurl } from 'react-icons/gi'

export const VOID_GODS_SPAWN: DungeonEvent = {
  id: 'void-gods-spawn',
  type: 'combat',
  title: "Void Gods' Spawn",
  description: 'Children of ancient void deities attack with power beyond comprehension!',
  choices: [
    {
      text: 'Face divine nihilism',
      outcome: {
        text: 'Their divine power erases existence!',
        effects: [
          { type: 'damage', target: 'strongest', value: 115 },
          { type: 'xp', value: 600 },
          { type: 'gold', value: 480 },
        ],
      },
    },
    {
      text: 'Existential fortitude (Defense check)',
      requirements: { stat: 'defense', minValue: 165 },
      outcome: {
        text: 'You refuse to be unmade!',
        effects: [
          { type: 'damage', target: 'strongest', value: 104 },
          { type: 'xp', value: 620 },
          { type: 'gold', value: 500 },
        ],
      },
    },
  ],
  depth: 78,
  icon: GiTentacurl,
}
