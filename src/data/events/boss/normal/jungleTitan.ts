import type { DungeonEvent } from '@/types'
import { GiVineWhip } from 'react-icons/gi'

export const JUNGLE_TITAN: DungeonEvent = {
  id: 'jungle-titan',
  type: 'boss',
  title: 'Jungle Titan',
  description: 'A massive plant-creature that commands all vegetation. Vines and roots erupt from every surface to ensnare you.',
  choices: [
    {
      text: 'Hack through the vines',
      outcome: {
        text: 'Plants grow faster than you can cut! You\'re overwhelmed by nature!',
        effects: [
          { type: 'damage', target: 'all', value: 295 },
          { type: 'xp', value: 1135 },
          { type: 'gold', value: 1703 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Command the plants (Druid bonus)',
      requirements: {
        class: 'Druid',
      },
      outcome: {
        text: 'The vegetation obeys you instead! The titan is powerless!',
        effects: [
          { type: 'damage', target: 'all', value: 222 },
          { type: 'xp', value: 1245 },
          { type: 'gold', value: 1868 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 26 },
        ],
      },
    },
    {
      text: 'Burn it all (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 49,
      },
      outcome: {
        text: 'Fire consumes the jungle! The titan burns to ash!',
        effects: [
          { type: 'damage', target: 'strongest', value: 245 },
          { type: 'xp', value: 1265 },
          { type: 'gold', value: 1898 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 27 },
        ],
      },
    },
  ],
  depth: 41,
  icon: GiVineWhip,
}
