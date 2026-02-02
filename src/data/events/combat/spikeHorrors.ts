import type { DungeonEvent } from '@/types'
import { GiSpikesFull } from 'react-icons/gi'

export const SPIKE_HORRORS: DungeonEvent = {
  id: 'spike-horrors',
  type: 'combat',
  title: 'Spike Horrors',
  description: 'Creatures made entirely of sharp spikes roll toward you!',
  choices: [
    {
      text: 'Block them',
      outcome: {
        text: 'Spikes penetrate your defense!',
        effects: [
          { type: 'damage', target: 'strongest', value: 68 },
          { type: 'xp', value: 335 },
          { type: 'gold', value: 242 },
        ],
      },
    },
    {
      text: 'Sidestep carefully (Speed check)',
      requirements: { stat: 'speed', minValue: 110 },
      outcome: {
        text: 'You dodge their rolling attack!',
        effects: [
          { type: 'damage', target: 'strongest', value: 57 },
          { type: 'xp', value: 355 },
          { type: 'gold', value: 262 },
        ],
      },
    },
  ],
  depth: 50,
  icon: GiSpikesFull,
}
