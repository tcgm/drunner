import type { DungeonEvent } from '@/types'

export const GOBLIN_AMBUSH: DungeonEvent = {
  id: 'goblin-ambush',
  type: 'combat',
  title: 'Goblin Ambush!',
  description: 'Three goblins leap from the shadows, weapons drawn!',
  choices: [
    {
      text: 'Fight head-on',
      outcome: {
        text: 'You charge into battle!',
        effects: [
          { type: 'damage', target: 'random', value: 15 },
          { type: 'xp', value: 50 },
          { type: 'gold', value: 25 },
        ],
      },
    },
    {
      text: 'Ambush them first (requires Speed)',
      requirements: {
        stat: 'speed',
        minValue: 40,
      },
      outcome: {
        text: 'You strike first, catching them off guard!',
        effects: [
          { type: 'damage', target: 'random', value: 5 },
          { type: 'xp', value: 60 },
          { type: 'gold', value: 30 },
        ],
      },
    },
    {
      text: 'Try to negotiate (Luck check)',
      successChance: 0.25,
      statModifier: 'luck',
      successOutcome: {
        text: 'By sheer luck, they accept your bribe and leave!',
        effects: [
          { type: 'gold', value: -10 },
          { type: 'xp', value: 60 },
        ],
      },
      failureOutcome: {
        text: 'The goblins laugh and attack with fury!',
        effects: [
          { type: 'damage', target: 'random', value: 22 },
          { type: 'xp', value: 40 },
          { type: 'gold', value: 15 },
        ],
      },
    },
    {
      text: 'Flee',
      outcome: {
        text: 'You escape safely, but gain nothing.',
        effects: [],
      },
    },
  ],
  depth: 1,
}
