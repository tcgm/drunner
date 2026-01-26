import type { DungeonEvent } from '@/types'

export const POISON_DART_TRAP: DungeonEvent = {
  id: 'poison-dart-trap',
  type: 'trap',
  title: 'Poison Dart Trap',
  description: 'You spot pressure plates on the floor. Dart holes line the walls.',
  choices: [
    {
      text: 'Disarm the trap (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You expertly disable the trap mechanism!',
        effects: [
          { type: 'xp', value: 60 },
        ],
      },
    },
    {
      text: 'Carefully navigate around (Speed check)',
      successChance: 0.6,
      statModifier: 'speed',
      successOutcome: {
        text: 'Your careful footwork avoids all the pressure plates perfectly!',
        effects: [
          { type: 'xp', value: 40 },
        ],
      },
      failureOutcome: {
        text: 'You try to avoid them but trigger one plate! A few darts fly.',
        effects: [
          { type: 'damage', target: 'random', value: 12 },
          { type: 'xp', value: 20 },
        ],
      },
    },
    {
      text: 'Rush through quickly',
      outcome: {
        text: 'You trigger the trap! Darts fly everywhere!',
        effects: [
          { type: 'damage', target: 'all', value: 15 },
        ],
      },
    },
    {
      text: 'Send the strongest through first',
      outcome: {
        text: 'The trap is triggered but your tank absorbs most damage.',
        effects: [
          { type: 'damage', target: 'random', value: 25 },
          { type: 'xp', value: 10 },
        ],
      },
    },
  ],
  depth: 2,
}
