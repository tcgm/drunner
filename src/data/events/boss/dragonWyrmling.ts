import type { DungeonEvent } from '@/types'

export const DRAGON_WYRMLING: DungeonEvent = {
  id: 'dragon-wyrmling',
  type: 'boss',
  title: 'Young Dragon',
  description: 'A young but fierce dragon nests in this chamber. Its scales gleam like rubies in the torchlight.',
  choices: [
    {
      text: 'Attack head-on',
      outcome: {
        text: 'The dragon breathes fire! The battle is fierce!',
        effects: [
          { type: 'damage', target: 'all', value: 40 },
          { type: 'xp', value: 300 },
          { type: 'gold', value: 400 },
        ],
      },
    },
    {
      text: 'Use magic against it (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Your spells pierce the dragon\'s magical resistance!',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
          { type: 'xp', value: 350 },
          { type: 'gold', value: 450 },
        ],
      },
    },
    {
      text: 'Attempt to negotiate',
      requirements: {
        gold: 200,
      },
      outcome: {
        text: 'The dragon is amused but demands tribute.',
        effects: [
          { type: 'gold', value: -200 },
          { type: 'xp', value: 150 },
        ],
      },
    },
    {
      text: 'Target the wings (Ranger bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'Your precise shots ground the dragon!',
        effects: [
          { type: 'damage', target: 'all', value: 30 },
          { type: 'xp', value: 320 },
          { type: 'gold', value: 420 },
        ],
      },
    },
    {
      text: 'Attempt to hug the dragon',
      outcome: {
        text: 'The dragon is confused by your affection, but accepts the hug awkwardly. It lets you pass unharmed.',
        effects: [
          { type: 'xp', value: 200 },
        ],
      },
    },
  ],
  depth: 7,
}
