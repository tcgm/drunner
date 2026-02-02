import type { DungeonEvent } from '@/types'
import { GiHydra } from 'react-icons/gi'

export const VENOMOUS_HYDRA: DungeonEvent = {
  id: 'venomous-hydra',
  type: 'boss',
  title: 'Venomous Hydra',
  description: 'A three-headed serpent emerges from the murky water, each head dripping with deadly venom. The air reeks of poison.',
  choices: [
    {
      text: 'Attack all heads at once',
      outcome: {
        text: 'You slash at all three heads, but the venom burns your skin!',
        effects: [
          { type: 'damage', target: 'all', value: 35 },
          { type: 'xp', value: 200 },
          { type: 'gold', value: 290 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 11 },
        ],
      },
    },
    {
      text: 'Cauterize each wound (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You sever each head and burn the stumps! No regrowth occurs!',
        effects: [
          { type: 'damage', target: 'strongest', value: 25 },
          { type: 'xp', value: 240 },
          { type: 'gold', value: 340 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 14 },
        ],
      },
    },
    {
      text: 'Resist the poison (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 10,
      },
      outcome: {
        text: 'The venom has no effect! You methodically destroy each head!',
        effects: [
          { type: 'damage', target: 'all', value: 22 },
          { type: 'xp', value: 230 },
          { type: 'gold', value: 320 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 13 },
        ],
      },
    },
  ],
  depth: 7,
  icon: GiHydra,
}
