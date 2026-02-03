import type { DungeonEvent } from '@/types'
import { GiHornedHelm } from 'react-icons/gi'

export const DEMON_WARLORD: DungeonEvent = {
  id: 'demon-warlord',
  type: 'boss',
  title: 'Demon Warlord',
  description: 'A tactical genius from the Abyss commands legions with brutal efficiency. Its strategic mind makes it far more dangerous than strength alone.',
  choices: [
    {
      text: 'Fight the legion',
      outcome: {
        text: 'Perfectly coordinated attacks! The warlord\'s tactics overwhelm you!',
        effects: [
          { type: 'damage', target: 'all', value: 338 },
          { type: 'xp', value: 1250 },
          { type: 'gold', value: 1875 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 26 },
        ],
      },
    },
    {
      text: 'Decapitate the command (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You assassinate the warlord! The leaderless army flees!',
        effects: [
          { type: 'damage', target: 'weakest', value: 268 },
          { type: 'xp', value: 1370 },
          { type: 'gold', value: 2055 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 32 },
        ],
      },
    },
    {
      text: 'Out-strategize them (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 59,
      },
      outcome: {
        text: 'Your tactics are superior! You turn their strategy against them!',
        effects: [
          { type: 'damage', target: 'random', value: 282 },
          { type: 'xp', value: 1390 },
          { type: 'gold', value: 2085 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 33 },
        ],
      },
    },
  ],
  depth: 48,
  icon: GiHornedHelm,
}
