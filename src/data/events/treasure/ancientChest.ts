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
      outcome: {
        text: 'You kick the chest hard! The lock breaks... but so does something inside. Also, it was a mimic. Oops.',
        effects: [
          { type: 'damage', target: 'random', value: 25 },
          { type: 'gold', value: 50 },
        ],
      },
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
