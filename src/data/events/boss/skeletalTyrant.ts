import type { DungeonEvent } from '@/types'
import { GiDinosaurBones } from 'react-icons/gi'

export const SKELETAL_TYRANT: DungeonEvent = {
  id: 'skeletal-tyrant',
  type: 'boss',
  title: 'Skeletal Tyrant',
  description: 'The massive fossilized skeleton of an ancient predator has been animated by dark magic. Its bone jaws could swallow you whole.',
  choices: [
    {
      text: 'Fight the beast',
      outcome: {
        text: 'The skeletal behemoth is relentless! Its massive jaws nearly crush you!',
        effects: [
          { type: 'damage', target: 'all', value: 137 },
          { type: 'xp', value: 492 },
          { type: 'gold', value: 642 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 19 },
        ],
      },
    },
    {
      text: 'Disrupt the necromancy (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your holy power severs the magic! The bones collapse into dust!',
        effects: [
          { type: 'damage', target: 'all', value: 92 },
          { type: 'xp', value: 535 },
          { type: 'gold', value: 700 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Break key bones (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 31,
      },
      outcome: {
        text: 'You shatter its spine and legs! The tyrant can\'t move!',
        effects: [
          { type: 'damage', target: 'strongest', value: 100 },
          { type: 'xp', value: 528 },
          { type: 'gold', value: 693 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 22 },
        ],
      },
    },
  ],
  depth: 25,
  icon: GiDinosaurBones,
}
