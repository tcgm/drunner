import type { DungeonEvent } from '@/types'
import { GiNightSky } from 'react-icons/gi'

export const STAR_EATER: DungeonEvent = {
  id: 'star-eater',
  type: 'boss',
  title: 'Star Eater',
  description: 'A cosmic entity that devours suns. It hungers for light and heat, consuming them until only cold void remains.',
  choices: [
    {
      text: 'Feed the hunger',
      outcome: {
        text: 'It consumes your life force like it consumes stars! The void spreads!',
        effects: [
          { type: 'damage', target: 'all', value: 585 },
          { type: 'xp', value: 2460 },
          { type: 'gold', value: 3690 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 47 },
        ],
      },
    },
    {
      text: 'Become the light (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your divine radiance is infinite! Even a star eater cannot consume all light!',
        effects: [
          { type: 'damage', target: 'all', value: 525 },
          { type: 'xp', value: 2590 },
          { type: 'gold', value: 3885 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 65 },
        ],
      },
    },
    {
      text: 'Explode from within (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You let it consume your magic, then detonate! The eater becomes a nova!',
        effects: [
          { type: 'damage', target: 'all', value: 538 },
          { type: 'xp', value: 2620 },
          { type: 'gold', value: 3930 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 66 },
        ],
      },
    },
  ],
  depth: 83,
  icon: GiNightSky,
}
