import type { DungeonEvent } from '@/types'

export const ABANDONED_CAMP: DungeonEvent = {
  id: 'abandoned-camp',
  type: 'rest',
  title: 'Abandoned Camp',
  description: 'A recently abandoned campsite with supplies left behind. It looks safe.',
  choices: [
    {
      text: 'Search for supplies',
      outcome: {
        text: 'You find food, bandages, and some gold!',
        effects: [
          { type: 'heal', target: 'all', value: 40 },
          { type: 'gold', value: 60 },
        ],
      },
    },
    {
      text: 'Rest at the camp',
      outcome: {
        text: 'You use the camp to recover.',
        effects: [
          { type: 'heal', target: 'all', value: 70 },
        ],
      },
    },
    {
      text: 'Investigate carefully (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'Your keen eye spots hidden treasure!',
        effects: [
          { type: 'heal', target: 'all', value: 40 },
          { type: 'gold', value: 100 },
        ],
      },
    },
    {
      text: 'Avoid the camp (suspicious)',
      outcome: {
        text: 'You decide not to risk it and move on.',
        effects: [],
      },
    },
  ],
  depth: 3,
}
