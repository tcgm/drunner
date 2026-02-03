import type { DungeonEvent } from '@/types'
import { GiFlame } from 'react-icons/gi'

export const PHOENIX_CHAMPION: DungeonEvent = {
  id: 'phoenix-champion',
  type: 'boss',
  title: 'Phoenix Champion',
  description: 'A warrior bound to a phoenix spirit. Wreathed in flames, they wield a blade of pure fire and can rise from the ashes if not truly destroyed.',
  choices: [
    {
      text: 'Fight the flames',
      outcome: {
        text: 'Fire engulfs you with every strike! When you kill them, they rise anew!',
        effects: [
          { type: 'damage', target: 'all', value: 198 },
          { type: 'xp', value: 745 },
          { type: 'gold', value: 1075 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Prevent resurrection (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'You bind the phoenix spirit! The champion cannot be reborn!',
        effects: [
          { type: 'damage', target: 'all', value: 155 },
          { type: 'xp', value: 815 },
          { type: 'gold', value: 1165 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 28 },
        ],
      },
    },
    {
      text: 'Extinguish completely (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 43,
      },
      outcome: {
        text: 'You utterly destroy both warrior and spirit! No resurrection is possible!',
        effects: [
          { type: 'damage', target: 'strongest', value: 168 },
          { type: 'xp', value: 835 },
          { type: 'gold', value: 1190 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', rarityBoost: 30 },
        ],
      },
    },
  ],
  depth: 38,
  icon: GiFlame,
}
