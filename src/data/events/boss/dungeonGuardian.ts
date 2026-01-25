import type { DungeonEvent } from '@/types'

export const DUNGEON_GUARDIAN: DungeonEvent = {
  id: 'dungeon-guardian',
  type: 'boss',
  title: 'Dungeon Guardian',
  description: 'A massive golem of stone and iron awakens. It is the dungeon\'s final defense.',
  choices: [
    {
      text: 'Attack with everything',
      outcome: {
        text: 'You unleash your full arsenal against the guardian!',
        effects: [
          { type: 'damage', target: 'all', value: 50 },
          { type: 'xp', value: 500 },
          { type: 'gold', value: 600 },
        ],
      },
    },
    {
      text: 'Target the control crystal',
      requirements: {
        stat: 'attack',
        value: 18,
      },
      outcome: {
        text: 'You shatter the crystal! The guardian crumbles!',
        effects: [
          { type: 'damage', target: 'all', value: 30 },
          { type: 'xp', value: 550 },
          { type: 'gold', value: 650 },
        ],
      },
    },
    {
      text: 'Disable its magic (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You dispel the magic animating the guardian!',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
          { type: 'xp', value: 580 },
          { type: 'gold', value: 680 },
        ],
      },
    },
    {
      text: 'Evade and find weakness',
      outcome: {
        text: 'You dodge its attacks and discover a weak point!',
        effects: [
          { type: 'damage', target: 'all', value: 35 },
          { type: 'xp', value: 520 },
          { type: 'gold', value: 620 },
        ],
      },
    },
  ],
  depth: 10,
}
