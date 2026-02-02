import type { DungeonEvent } from '@/types'
import { GiRockGolem } from 'react-icons/gi'

export const GRANITE_JUGGERNAUT: DungeonEvent = {
  id: 'granite-juggernaut',
  type: 'boss',
  title: 'Granite Juggernaut',
  description: 'A living mountain of stone crashes through walls as it advances. Each step creates shockwaves, and its fists could pulverize castle walls.',
  choices: [
    {
      text: 'Strike the stone',
      outcome: {
        text: 'Your weapons chip uselessly at the granite! Its crushing blows devastate you!',
        effects: [
          { type: 'damage', target: 'all', value: 148 },
          { type: 'xp', value: 510 },
          { type: 'gold', value: 670 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Shatter with force (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 35,
      },
      outcome: {
        text: 'You deliver a massive blow to existing cracks! The juggernaut crumbles!',
        effects: [
          { type: 'damage', target: 'strongest', value: 112 },
          { type: 'xp', value: 550 },
          { type: 'gold', value: 725 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Command the earth (Druid bonus)',
      requirements: {
        class: 'Druid',
      },
      outcome: {
        text: 'The stone obeys your will! The juggernaut becomes inert once more!',
        effects: [
          { type: 'damage', target: 'all', value: 95 },
          { type: 'xp', value: 545 },
          { type: 'gold', value: 715 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 23 },
        ],
      },
    },
  ],
  depth: 29,
  icon: GiRockGolem,
}
