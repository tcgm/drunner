import type { DungeonEvent } from '@/types'

export const ANCIENT_CHEST: DungeonEvent = {
  id: 'ancient-chest',
  type: 'treasure',
  title: 'Ancient Chest',
  description: 'You discover an ornate chest covered in strange runes.',
  choices: [
    {
      text: 'Force it open',
      outcome: {
        text: 'The chest opens with a loud crack!',
        effects: [
          { type: 'gold', value: 100 },
          { type: 'damage', target: 'random', value: 10 },
          { type: 'item', itemType: 'random' }, // Generate random item
        ],
      },
    },
    {
      text: 'Pick the lock carefully (requires Rogue)',
      requirements: {
        class: 'rogue',
      },
      outcome: {
        text: 'The lock clicks open smoothly!',
        effects: [
          { type: 'gold', value: 150 },
          { type: 'item', itemType: 'random' }, // Generate random item
        ],
      },
    },
    {
      text: 'Kick it aggressively',
      possibleOutcomes: [
        {
          weight: 30,
          outcome: {
            text: 'The lock breaks cleanly! The chest opens.',
            effects: [
              { type: 'gold', value: 120 },
              { type: 'item', itemType: 'random' },
            ],
          },
        },
        {
          weight: 40,
          outcome: {
            text: 'You break the chest open, damaging some contents.',
            effects: [
              { type: 'gold', value: 60 },
            ],
          },
        },
        {
          weight: 30,
          outcome: {
            text: 'It was a mimic! It bites you!',
            effects: [
              { type: 'damage', target: 'random', value: 30 },
              { type: 'gold', value: 40 },
            ],
          },
        },
      ],
    },
    {
      text: 'Leave it alone',
      outcome: {
        text: 'You decide it\'s not worth the risk.',
        effects: [],
      },
    },
  ],
  depth: 2,
}
