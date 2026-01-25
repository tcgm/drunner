import type { DungeonEvent } from '@/types'

export const SKELETON_PATROL: DungeonEvent = {
  id: 'skeleton-patrol',
  type: 'combat',
  title: 'Skeleton Patrol',
  description: 'Two animated skeletons block your path, their bones rattling ominously.',
  choices: [
    {
      text: 'Attack with weapons',
      outcome: {
        text: 'Your weapons crash against ancient bones!',
        effects: [
          { type: 'damage', target: 'random', value: 12 },
          { type: 'xp', value: 45 },
          { type: 'gold', value: 20 },
        ],
      },
    },
    {
      text: 'Use holy magic (requires Cleric or Paladin)',
      requirements: {
        class: 'cleric',
      },
      outcome: {
        text: 'Your holy light shatters the undead instantly!',
        effects: [
          { type: 'xp', value: 60 },
          { type: 'gold', value: 30 },
        ],
      },
    },
    {
      text: 'Sneak past them',
      outcome: {
        text: 'The skeletons notice you and attack!',
        effects: [
          { type: 'damage', target: 'all', value: 8 },
          { type: 'xp', value: 30 },
        ],
      },
    },
  ],
  depth: 2,
}
