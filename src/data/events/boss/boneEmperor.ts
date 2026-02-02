import type { DungeonEvent } from '@/types'
import { GiCrownedSkull } from 'react-icons/gi'

export const BONE_EMPEROR: DungeonEvent = {
  id: 'bone-emperor',
  type: 'boss',
  title: 'Bone Emperor',
  description: 'An ancient lich-king whose throne is built from the remains of heroes. It commands legions of undead with absolute authority.',
  choices: [
    {
      text: 'Face the legion',
      outcome: {
        text: 'Endless undead overwhelm you! The emperor\'s army is unstoppable!',
        effects: [
          { type: 'damage', target: 'all', value: 418 },
          { type: 'xp', value: 1670 },
          { type: 'gold', value: 2505 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 33 },
        ],
      },
    },
    {
      text: 'Challenge to single combat (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'The emperor\'s pride accepts! In single combat, you prevail!',
        effects: [
          { type: 'damage', target: 'strongest', value: 352 },
          { type: 'xp', value: 1790 },
          { type: 'gold', value: 2685 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 42 },
        ],
      },
    },
    {
      text: 'Shatter the phylactery (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 68,
      },
      outcome: {
        text: 'You locate and destroy its soul vessel! The emperor crumbles to dust!',
        effects: [
          { type: 'damage', target: 'all', value: 365 },
          { type: 'xp', value: 1815 },
          { type: 'gold', value: 2723 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 43 },
        ],
      },
    },
  ],
  depth: 59,
  icon: GiCrownedSkull,
}
