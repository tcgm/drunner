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
