import type { DungeonEvent } from '@/types'
import { GiTroll } from 'react-icons/gi'

export const CAVE_TROLL: DungeonEvent = {
  id: 'cave-troll',
  type: 'combat',
  title: 'Cave Troll',
  description: 'A massive troll emerges from its lair, club in hand!',
  choices: [
    {
      text: 'Stand and fight',
      outcome: {
        text: 'You engage the hulking brute in combat!',
        effects: [
          { type: 'damage', target: 'random', value: 25 },
          { type: 'xp', value: 80 },
          { type: 'gold', value: 50 },
        ],
      },
    },
    {
      text: 'Aim for weak spots (requires Attack)',
      requirements: {
        stat: 'attack',
        minValue: 50,
      },
      outcome: {
        text: 'You exploit the troll\'s vulnerabilities!',
        effects: [
          { type: 'damage', target: 'random', value: 15 },
          { type: 'xp', value: 100 },
          { type: 'gold', value: 60 },
        ],
      },
    },
    {
      text: 'Lure it into a trap',
      outcome: {
        text: 'The troll falls for your ruse, but not before landing a hit!',
        effects: [
          { type: 'damage', target: 'strongest', value: 30 },
          { type: 'xp', value: 90 },
          { type: 'gold', value: 55 },
        ],
      },
    },
  ],
  depth: 3,
  icon: GiTroll,
}
