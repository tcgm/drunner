import type { DungeonEvent } from '@/types'
import { GiGoblinHead } from 'react-icons/gi'

export const GOBLIN_CHIEF: DungeonEvent = {
  id: 'goblin-chief-intro',
  type: 'boss',
  title: 'Goblin Chief',
  description: 'A goblin leader barks orders at his minions. He looks mean, but you\'ve fought worse... probably.',
  choices: [
    {
      text: 'Fight the chief',
      outcome: {
        text: 'You battle through the goblins and strike down their chief!',
        effects: [
          { type: 'damage', target: 'all', value: 18 },
          { type: 'xp', value: 130 },
          { type: 'gold', value: 160 },
          { type: 'item', itemType: 'random', minRarity: 'common', rarityBoost: 6 },
        ],
      },
    },
    {
      text: 'Challenge the chief to single combat (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 8,
      },
      outcome: {
        text: 'You duel the chief and defeat him quickly! The other goblins flee!',
        effects: [
          { type: 'damage', target: 'strongest', value: 12 },
          { type: 'xp', value: 160 },
          { type: 'gold', value: 190 },
          { type: 'item', itemType: 'weapon', minRarity: 'uncommon', rarityBoost: 8 },
        ],
      },
    },
    {
      text: 'Intimidate the goblins (Barbarian bonus)',
      requirements: {
        class: 'Barbarian',
      },
      outcome: {
        text: 'You roar and beat your chest! The goblins scatter in terror!',
        effects: [
          { type: 'damage', target: 'all', value: 6 },
          { type: 'xp', value: 170 },
          { type: 'gold', value: 210 },
          { type: 'item', itemType: 'armor', minRarity: 'uncommon', rarityBoost: 9 },
        ],
      },
    },
  ],
  depth: 1,
  icon: GiGoblinHead,
  isIntroBoss: true,
}
