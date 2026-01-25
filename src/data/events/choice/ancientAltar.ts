import type { DungeonEvent } from '@/types'

export const ANCIENT_ALTAR: DungeonEvent = {
  id: 'ancient-altar',
  type: 'choice',
  title: 'Ancient Altar',
  description: 'An altar dedicated to a forgotten god. It demands an offering.',
  choices: [
    {
      text: 'Offer gold (costs 100 gold)',
      requirements: {
        item: 'gold',
      },
      outcome: {
        text: 'The altar glows and blesses your party!',
        effects: [
          { type: 'gold', value: -100 },
          { type: 'heal', target: 'all', value: 50 },
        ],
      },
    },
    {
      text: 'Offer blood (lose HP)',
      outcome: {
        text: 'Your sacrifice is accepted. Power flows through you!',
        effects: [
          { type: 'damage', target: 'random', value: 20 },
          { type: 'xp', value: 100 },
        ],
      },
    },
    {
      text: 'Pray without offering',
      outcome: {
        text: 'The altar remains silent.',
        effects: [],
      },
    },
    {
      text: 'Desecrate the altar',
      outcome: {
        text: 'Divine wrath strikes your party!',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
          { type: 'gold', value: 50 },
        ],
      },
    },
  ],
  depth: 3,
}
