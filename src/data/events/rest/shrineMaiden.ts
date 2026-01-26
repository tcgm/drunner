import type { DungeonEvent } from '@/types'

export const SHRINE_MAIDEN: DungeonEvent = {
  id: 'shrine-maiden',
  type: 'rest',
  title: 'Shrine of the Fallen',
  description: 'A serene shrine glows with divine light. A maiden offers to revive your fallen companions.',
  choices: [
    {
      text: 'Pray for resurrection (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'The Cleric\'s prayers resonate with the shrine! All fallen heroes are revived!',
        effects: [
          { type: 'revive', target: 'all', value: 80 },
          { type: 'heal', target: 'all', value: 40 },
        ],
      },
    },
    {
      text: 'Offer gold for resurrection (costs 200 gold)',
      requirements: {
        gold: 200,
      },
      outcome: {
        text: 'The maiden accepts your offering and revives one fallen hero.',
        effects: [
          { type: 'gold', value: -200 },
          { type: 'revive', target: 'random', value: 60 },
        ],
      },
    },
    {
      text: 'Pray at the shrine',
      outcome: {
        text: 'Your prayers are heard. The shrine blesses the living.',
        effects: [
          { type: 'heal', target: 'all', value: 50 },
        ],
      },
    },
    {
      text: 'Leave respectfully',
      outcome: {
        text: 'You bow and continue your journey.',
        effects: [],
      },
    },
  ],
  depth: 5,
}
