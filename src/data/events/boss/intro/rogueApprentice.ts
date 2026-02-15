import type { DungeonEvent } from '@/types'
import { GiHoodedAssassin } from 'react-icons/gi'

export const ROGUE_APPRENTICE: DungeonEvent = {
  id: 'rogue-apprentice-intro',
  type: 'boss',
  title: 'Rogue Apprentice',
  description: 'A young thief emerges from the shadows, daggers drawn. They look nervous but determined to prove themselves.',
  choices: [
    {
      text: 'Duel with blades',
      outcome: {
        text: 'You trade blows with the apprentice. They\'re skilled but inexperienced!',
        effects: [
          { type: 'damage', target: 'all', value: 16 },
          { type: 'xp', value: 120 },
          { type: 'gold', value: 170 },
          { type: 'item', itemType: 'random', minRarity: 'common', rarityBoost: 6 },
        ],
      },
    },
    {
      text: 'Predict their moves (High Luck)',
      requirements: {
        stat: 'luck',
        minValue: 9,
      },
      outcome: {
        text: 'You anticipate every strike! The apprentice surrenders, impressed!',
        effects: [
          { type: 'damage', target: 'random', value: 10 },
          { type: 'xp', value: 150 },
          { type: 'gold', value: 200 },
          { type: 'item', itemType: 'weapon', minRarity: 'uncommon', rarityBoost: 8 },
        ],
      },
    },
    {
      text: 'Charm them into fleeing (Bard bonus)',
      requirements: {
        class: 'Bard',
      },
      outcome: {
        text: 'You convince them this life isn\'t worth it! They drop their coin purse and flee!',
        effects: [
          { type: 'damage', target: 'all', value: 5 },
          { type: 'xp', value: 160 },
          { type: 'gold', value: 230 },
          { type: 'item', itemType: 'armor', minRarity: 'uncommon', rarityBoost: 10 },
        ],
      },
    },
  ],
  depth: 1,
  icon: GiHoodedAssassin,
  isIntroBoss: true,
}
