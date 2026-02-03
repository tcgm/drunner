import type { DungeonEvent } from '@/types'
import { GiGoblinHead } from 'react-icons/gi'

export const GOBLIN_WARLORD: DungeonEvent = {
  id: 'goblin-warlord',
  type: 'boss',
  title: 'Goblin Warlord',
  description: 'A massive goblin clad in scavenged armor commands a horde. His crude but effective battle axe has claimed many lives.',
  choices: [
    {
      text: 'Challenge him to single combat',
      outcome: {
        text: 'The warlord accepts! You trade vicious blows while his horde watches!',
        effects: [
          { type: 'damage', target: 'all', value: 27 },
          { type: 'xp', value: 175 },
          { type: 'gold', value: 260 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 9 },
        ],
      },
    },
    {
      text: 'Assassinate him (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You slip through the shadows and strike! The horde flees leaderless!',
        effects: [
          { type: 'damage', target: 'weakest', value: 18 },
          { type: 'xp', value: 220 },
          { type: 'gold', value: 310 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 12 },
        ],
      },
    },
    {
      text: 'Intimidate the horde (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 9,
      },
      outcome: {
        text: 'You cut down several goblins! The warlord and his horde scatter in terror!',
        effects: [
          { type: 'damage', target: 'all', value: 20 },
          { type: 'xp', value: 210 },
          { type: 'gold', value: 300 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 11 },
        ],
      },
    },
  ],
  depth: 5,
  icon: GiGoblinHead,
}
