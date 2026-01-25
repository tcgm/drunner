import type { DungeonEvent } from '@/types'

export const NECROMANTIC_RITUAL: DungeonEvent = {
  id: 'necromantic-ritual',
  type: 'choice',
  title: 'Dark Ritual Chamber',
  description: 'An ancient ritual circle pulses with dark energy. The power to return the dead lingers here.',
  choices: [
    {
      text: 'Perform necromantic ritual (Necromancer)',
      requirements: {
        class: 'Necromancer',
      },
      outcome: {
        text: 'Through dark magic, you pull your fallen allies back from death itself!',
        effects: [
          { type: 'revive', target: 'all', value: 50 },
          { type: 'damage', target: 'all', value: 20 }, // Costs life force
        ],
      },
    },
    {
      text: 'Use the ritual (risky)',
      outcome: {
        text: 'You attempt the ritual without proper knowledge. It partially works...',
        effects: [
          { type: 'revive', target: 'random', value: 30 },
          // NOTE: Damage scales with depth, which can result in the revived hero
          // immediately dying again from massive damage at deep floors.
          // This is intentionally left in because it's hilarious.
          { type: 'damage', target: 'all', value: 30 },
        ],
      },
    },
    {
      text: 'Study the runes',
      outcome: {
        text: 'You gain knowledge from the ancient texts.',
        effects: [
          { type: 'xp', value: 80 },
        ],
      },
    },
    {
      text: 'Destroy the ritual circle',
      outcome: {
        text: 'You break the dark magic, feeling purified.',
        effects: [
          { type: 'heal', target: 'all', value: 40 },
          { type: 'xp', value: 50 },
        ],
      },
    },
  ],
  depth: 6,
}
