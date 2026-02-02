import type { DungeonEvent } from '@/types'
import { GiCentaurHeart } from 'react-icons/gi'

export const CENTAUR_CHAMPION: DungeonEvent = {
  id: 'centaur-champion',
  type: 'boss',
  title: 'Centaur Champion',
  description: 'A noble centaur warrior charges down the corridor, lance lowered. Battle scars cover his flanks, testament to countless victories.',
  choices: [
    {
      text: 'Stand your ground',
      outcome: {
        text: 'The charge is devastating! His lance strikes true before he tramples you!',
        effects: [
          { type: 'damage', target: 'all', value: 74 },
          { type: 'xp', value: 326 },
          { type: 'gold', value: 436 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'epic', rarityBoost: 14 },
        ],
      },
    },
    {
      text: 'Challenge to honorable duel (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'The centaur accepts! You best him in fair combat and earn his respect!',
        effects: [
          { type: 'damage', target: 'strongest', value: 53 },
          { type: 'xp', value: 368 },
          { type: 'gold', value: 480 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 18 },
        ],
      },
    },
    {
      text: 'Trip the charge (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 19,
      },
      outcome: {
        text: 'You bring down the charging centaur! He crashes hard!',
        effects: [
          { type: 'damage', target: 'random', value: 57 },
          { type: 'xp', value: 361 },
          { type: 'gold', value: 471 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 17 },
        ],
      },
    },
  ],
  depth: 19,
  icon: GiCentaurHeart,
}
