import type { DungeonEvent } from '@/types'

export const MYSTERIOUS_FOUNTAIN: DungeonEvent = {
  id: 'mysterious-fountain',
  type: 'treasure',
  title: 'Mysterious Fountain',
  description: 'A fountain filled with glowing water. Gold coins glitter at the bottom.',
  choices: [
    {
      text: 'Take the gold',
      outcome: {
        text: 'You grab the coins from the fountain.',
        effects: [
          { type: 'gold', value: 100 },
        ],
      },
    },
    {
      text: 'Drink the water',
      outcome: {
        text: 'The magical water restores your vitality!',
        effects: [
          { type: 'heal', target: 'all', value: 30 },
          { type: 'gold', value: 50 },
        ],
      },
    },
    {
      text: 'Study the runes (requires Mage)',
      requirements: {
        class: 'mage',
      },
      outcome: {
        text: 'You unlock the fountain\'s true power!',
        effects: [
          { type: 'heal', target: 'all', value: 50 },
          { type: 'gold', value: 150 },
        ],
      },
    },
  ],
  depth: 2,
}
