import type { DungeonEvent } from '@/types'
import { GiSeaDragon } from 'react-icons/gi'

export const ABYSSAL_LEVIATHAN: DungeonEvent = {
  id: 'abyssal-leviathan',
  type: 'boss',
  title: 'Abyssal Leviathan',
  description: 'A sea monster from impossible depths, somehow dwelling in the dungeon. Water pressure crushes as it moves.',
  choices: [
    {
      text: 'Withstand the pressure',
      outcome: {
        text: 'Crushing force! Your bones creak under impossible weight!',
        effects: [
          { type: 'damage', target: 'all', value: 472 },
          { type: 'xp', value: 1930 },
          { type: 'gold', value: 2895 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 38 },
        ],
      },
    },
    {
      text: 'Equalize pressure (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Magic balances the forces! The leviathan implodes!',
        effects: [
          { type: 'damage', target: 'all', value: 408 },
          { type: 'xp', value: 2060 },
          { type: 'gold', value: 3090 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 50 },
        ],
      },
    },
    {
      text: 'Endure and strike (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 71,
      },
      outcome: {
        text: 'Your constitution withstands any pressure! Victory!',
        effects: [
          { type: 'damage', target: 'strongest', value: 422 },
          { type: 'xp', value: 2085 },
          { type: 'gold', value: 3128 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 51 },
        ],
      },
    },
  ],
  depth: 68,
  icon: GiSeaDragon,
}
