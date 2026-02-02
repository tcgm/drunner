import type { DungeonEvent } from '@/types'
import { GiWarlockEye } from 'react-icons/gi'

export const WARLOCK_OVERLORD: DungeonEvent = {
  id: 'warlock-overlord',
  type: 'boss',
  title: 'Warlock Overlord',
  description: 'A master of dark pacts commands legions of demons. Eldritch energy crackles around them as they draw power from their infernal patrons.',
  choices: [
    {
      text: 'Fight warlock and demons',
      outcome: {
        text: 'Summoned demons swarm you while dark magic assaults from every angle!',
        effects: [
          { type: 'damage', target: 'all', value: 200 },
          { type: 'xp', value: 748 },
          { type: 'gold', value: 1078 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'legendary', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Sever the pacts (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Divine authority breaks their contracts! The demons turn on their master!',
        effects: [
          { type: 'damage', target: 'all', value: 157 },
          { type: 'xp', value: 818 },
          { type: 'gold', value: 1168 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 28 },
        ],
      },
    },
    {
      text: 'Overwhelm them (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 45,
      },
      outcome: {
        text: 'You strike so fast they can\'t cast! Without spells, they fall quickly!',
        effects: [
          { type: 'damage', target: 'weakest', value: 170 },
          { type: 'xp', value: 838 },
          { type: 'gold', value: 1193 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 30 },
        ],
      },
    },
  ],
  depth: 39,
  icon: GiWarlockEye,
}
