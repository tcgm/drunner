import type { DungeonEvent } from '@/types'
import { GiTempleGate } from 'react-icons/gi'

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
        hasDeadHero: true,
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
      text: 'Offer gold for resurrection',
      requirements: {
        gold: 200,
        hasDeadHero: true,
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
      text: 'Pray for resurrection (without offering)',
      requirements: {
        hasDeadHero: true,
      },
      successChance: 0.3,
      statModifier: 'luck',
      successOutcome: {
        text: 'Your earnest prayers are answered! The shrine revives your fallen!',
        effects: [
          { type: 'revive', target: 'all', value: 60 },
          { type: 'heal', target: 'all', value: 30 },
        ],
      },
      failureOutcome: {
        text: 'Your prayers echo unanswered. The shrine only heals the living.',
        effects: [
          { type: 'heal', target: 'all', value: 40 },
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
  icon: GiTempleGate,
}
