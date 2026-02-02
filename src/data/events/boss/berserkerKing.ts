import type { DungeonEvent } from '@/types'
import { GiMagicAxe } from 'react-icons/gi'

export const BERSERKER_KING: DungeonEvent = {
  id: 'berserker-king',
  type: 'boss',
  title: 'Berserker King',
  description: 'A massive warrior in bloodstained furs roars with primal fury. His twin axes drip with the blood of countless foes, and his eyes burn with battle madness.',
  choices: [
    {
      text: 'Match his fury',
      outcome: {
        text: 'You trade devastating blows! His berserker rage makes him nearly unstoppable!',
        effects: [
          { type: 'damage', target: 'all', value: 142 },
          { type: 'xp', value: 505 },
          { type: 'gold', value: 655 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Tactical strikes (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 32,
      },
      outcome: {
        text: 'You exploit openings in his wild attacks! Precision defeats fury!',
        effects: [
          { type: 'damage', target: 'strongest', value: 108 },
          { type: 'xp', value: 545 },
          { type: 'gold', value: 715 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Enter battle trance (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You match his rage with your own! A clash of titans ends in your favor!',
        effects: [
          { type: 'damage', target: 'all', value: 115 },
          { type: 'xp', value: 550 },
          { type: 'gold', value: 725 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 25 },
        ],
      },
    },
  ],
  depth: 27,
  icon: GiMagicAxe,
}
