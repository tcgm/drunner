import type { DungeonEvent } from '@/types'

export const UNDEAD_CHAMPION: DungeonEvent = {
  id: 'undead-champion',
  type: 'boss',
  title: 'Undead Champion',
  description: 'A massive skeletal warrior in tarnished armor blocks your path. His empty eyes glow with unholy light.',
  choices: [
    {
      text: 'Fight with full force',
      outcome: {
        text: 'You engage in brutal combat with the undead champion!',
        effects: [
          { type: 'damage', target: 'all', value: 35 },
          { type: 'xp', value: 200 },
          { type: 'gold', value: 250 },
        ],
      },
    },
    {
      text: 'Holy attack (Cleric/Paladin bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your holy power is devastating against the undead!',
        effects: [
          { type: 'damage', target: 'all', value: 20 },
          { type: 'xp', value: 250 },
          { type: 'gold', value: 300 },
        ],
      },
    },
    {
      text: 'Tactical retreat',
      outcome: {
        text: 'You fall back, regrouping for another day.',
        effects: [
          { type: 'damage', target: 'random', value: 15 },
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Target weak points (Attack check)',
      requirements: {
        stat: 'attack',
        value: 15,
      },
      outcome: {
        text: 'Your precise strikes shatter the champion!',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
          { type: 'xp', value: 230 },
          { type: 'gold', value: 280 },
        ],
      },
    },
  ],
  depth: 5,
}
