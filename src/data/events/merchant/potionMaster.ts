import type { DungeonEvent } from '@/types'

export const POTION_MASTER: DungeonEvent = {
  id: 'potion-master',
  type: 'merchant',
  title: 'Master Alchemist',
  description: 'An alchemist offers various potions and elixirs with magical properties.',
  choices: [
    {
      text: 'Buy healing elixir (costs 60 gold)',
      requirements: {
        item: 'gold',
      },
      outcome: {
        text: 'The elixir instantly heals your wounds!',
        effects: [
          { type: 'gold', value: -60 },
          { type: 'heal', target: 'all', value: 70 },
        ],
      },
    },
    {
      text: 'Buy experience potion (costs 100 gold)',
      requirements: {
        item: 'gold',
      },
      outcome: {
        text: 'You drink the potion and gain knowledge!',
        effects: [
          { type: 'gold', value: -100 },
          { type: 'xp', value: 150 },
        ],
      },
    },
    {
      text: 'Learn alchemy (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'The alchemist teaches you valuable secrets!',
        effects: [
          { type: 'xp', value: 120 },
        ],
      },
    },
    {
      text: 'Decline',
      outcome: {
        text: 'You politely decline and move on.',
        effects: [],
      },
    },
  ],
  depth: 2,
}
