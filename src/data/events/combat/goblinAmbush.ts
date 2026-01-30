import type { DungeonEvent } from '@/types'
import { GiGoblinHead } from 'react-icons/gi'

export const GOBLIN_AMBUSH: DungeonEvent = {
  id: 'goblin-ambush',
  type: 'combat',
  title: 'Goblin Ambush!',
  description: [
    { weight: 3, text: 'Three goblins leap from the shadows, weapons drawn!' },
    { weight: 2, text: 'A pack of goblins appears from behind a pile of rubble!' },
    { weight: 2, text: 'Cackling echoes off the walls as goblins surround you!' },
    { weight: 1, text: 'You step on something that squeaks... goblin scouts!' },
  ],
  choices: [
    {
      text: 'Fight head-on',
      outcome: {
        text: [
          { weight: 3, text: 'You charge into battle!' },
          { weight: 2, text: 'Steel clashes against crude weapons!' },
          { weight: 1, text: 'The goblins stand no chance against your might!' },
        ],
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
        text: [
          { weight: 2, text: 'You strike first, catching them off guard!' },
          { weight: 1, text: 'Your swift attack scatters the goblins!' },
        ],
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
        text: [
          { weight: 2, text: 'By sheer luck, they accept your bribe and leave!' },
          { weight: 1, text: 'The goblins take your offering and scatter!' },
        ],
        effects: [
          { type: 'gold', value: -10 },
          { type: 'xp', value: 60 },
        ],
      },
      failureOutcome: {
        text: [
          { weight: 2, text: 'The goblins laugh and attack with fury!' },
          { weight: 1, text: 'Your negotiation enrages them further!' },
        ],
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
  icon: GiGoblinHead,
}
