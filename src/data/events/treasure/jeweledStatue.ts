import type { DungeonEvent } from '@/types'

export const JEWELED_STATUE: DungeonEvent = {
  id: 'jeweled-statue',
  type: 'treasure',
  title: 'Jeweled Statue',
  description: 'A statue encrusted with gems stands in the center of the room.',
  choices: [
    {
      text: 'Pry out the gems',
      outcome: {
        text: 'You extract several valuable gems!',
        effects: [
          { type: 'gold', value: 200 },
        ],
      },
    },
    {
      text: 'Check for traps first (requires Rogue)',
      requirements: {
        class: 'rogue',
      },
      outcome: {
        text: 'You disarm a trap and safely take the gems!',
        effects: [
          { type: 'gold', value: 250 },
        ],
      },
    },
    {
      text: 'Leave it - seems too easy',
      outcome: {
        text: 'You wisely avoid the trapped statue.',
        effects: [],
      },
    },
  ],
  depth: 4,
}
