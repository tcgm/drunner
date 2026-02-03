import type { DungeonEvent } from '@/types'
import { GiWalkingScout } from 'react-icons/gi'

export const COLOSSUS_PRIME: DungeonEvent = {
  id: 'colossus-prime',
  type: 'boss',
  title: 'Colossus Prime',
  description: 'The first and greatest war machine ever built. Its weapons systems could level cities, and its armor has never been breached.',
  choices: [
    {
      text: 'Assault the colossus',
      outcome: {
        text: 'Advanced weaponry tears through you! Its defenses are impenetrable!',
        effects: [
          { type: 'damage', target: 'all', value: 360 },
          { type: 'xp', value: 1320 },
          { type: 'gold', value: 1980 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 29 },
        ],
      },
    },
    {
      text: 'Override systems (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You hack its ancient programming! It follows your commands now!',
        effects: [
          { type: 'damage', target: 'all', value: 95 },
          { type: 'xp', value: 1440 },
          { type: 'gold', value: 2160 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 36 },
        ],
      },
    },
    {
      text: 'Find the weak point (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 60,
      },
      outcome: {
        text: 'You locate a flaw in its design! One precise strike and it falls!',
        effects: [
          { type: 'damage', target: 'strongest', value: 300 },
          { type: 'xp', value: 1425 },
          { type: 'gold', value: 2138 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 35 },
        ],
      },
    },
  ],
  depth: 50,
  icon: GiWalkingScout,
}
