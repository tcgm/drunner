import type { DungeonEvent } from '@/types'

export const DEMON_LORD: DungeonEvent = {
  id: 'demon-lord',
  type: 'boss',
  title: 'Lesser Demon Lord',
  description: 'A towering demon wreathed in flames materializes before you. The air reeks of sulfur.',
  choices: [
    {
      text: 'Engage in combat',
      outcome: {
        text: 'You battle the demon in a clash of steel and fire!',
        effects: [
          { type: 'damage', target: 'all', value: 45 },
          { type: 'xp', value: 350 },
          { type: 'gold', value: 350 },
        ],
      },
    },
    {
      text: 'Banish it (Cleric/Paladin bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your divine power forces the demon back to the abyss!',
        effects: [
          { type: 'damage', target: 'all', value: 20 },
          { type: 'xp', value: 400 },
          { type: 'gold', value: 400 },
        ],
      },
    },
    {
      text: 'Bind it with magic (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You trap the demon in mystical chains!',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
          { type: 'xp', value: 380 },
          { type: 'gold', value: 380 },
        ],
      },
    },
    {
      text: 'Flee while you can',
      outcome: {
        text: 'The demon\'s flames catch you as you escape!',
        effects: [
          { type: 'damage', target: 'all', value: 30 },
          { type: 'xp', value: 80 },
        ],
      },
    },
  ],
  depth: 8,
}
