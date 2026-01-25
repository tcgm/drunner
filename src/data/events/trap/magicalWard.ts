import type { DungeonEvent } from '@/types'

export const MAGICAL_WARD: DungeonEvent = {
  id: 'magical-ward',
  type: 'trap',
  title: 'Magical Ward',
  description: 'A shimmering barrier blocks the passage. Arcane runes glow ominously.',
  choices: [
    {
      text: 'Dispel the ward (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You successfully unravel the magical barrier!',
        effects: [
          { type: 'xp', value: 80 },
        ],
      },
    },
    {
      text: 'Study the runes first',
      outcome: {
        text: 'You learn how to safely bypass the ward.',
        effects: [
          { type: 'xp', value: 40 },
        ],
      },
    },
    {
      text: 'Force your way through',
      outcome: {
        text: 'The ward explodes! Magical energy burns your party!',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
        ],
      },
    },
    {
      text: 'Look for alternate path',
      outcome: {
        text: 'You find a side passage that avoids the ward.',
        effects: [
          { type: 'xp', value: 20 },
        ],
      },
    },
  ],
  depth: 4,
}
