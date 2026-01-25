import type { DungeonEvent } from '@/types'

export const ANCIENT_LICH: DungeonEvent = {
  id: 'ancient-lich',
  type: 'boss',
  title: 'Ancient Lich',
  description: 'A skeletal sorcerer crowned in dark metal hovers before you. Necromantic power radiates from its phylactery.',
  choices: [
    {
      text: 'Destroy the phylactery',
      outcome: {
        text: 'Breaking the phylactery weakens the lich significantly!',
        effects: [
          { type: 'damage', target: 'all', value: 30 },
          { type: 'xp', value: 400 },
          { type: 'gold', value: 500 },
        ],
      },
    },
    {
      text: 'Counter-spell duel (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You match the lich spell for spell!',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
          { type: 'xp', value: 450 },
          { type: 'gold', value: 550 },
        ],
      },
    },
    {
      text: 'Raise your own undead (Necromancer bonus)',
      requirements: {
        class: 'Necromancer',
      },
      outcome: {
        text: 'Your minions swarm the lich!',
        effects: [
          { type: 'damage', target: 'all', value: 20 },
          { type: 'xp', value: 480 },
          { type: 'gold', value: 600 },
        ],
      },
    },
    {
      text: 'Direct assault',
      outcome: {
        text: 'The lich\'s death magic ravages your party!',
        effects: [
          { type: 'damage', target: 'all', value: 50 },
          { type: 'xp', value: 350 },
          { type: 'gold', value: 450 },
        ],
      },
    },
  ],
  depth: 9,
}
