import type { DungeonEvent } from '@/types'
import { GiMedusaHead } from 'react-icons/gi'

export const GORGON_MATRIARCH: DungeonEvent = {
  id: 'gorgon-matriarch',
  type: 'boss',
  title: 'Gorgon Matriarch',
  description: 'A powerful gorgon with serpents of many colors in place of hair. Her petrifying gaze has created a garden of stone statues - former victims.',
  choices: [
    {
      text: 'Fight while avoiding her gaze',
      outcome: {
        text: 'Fighting blind is nearly impossible! You glimpse her eyes and feel stone creeping through your limbs!',
        effects: [
          { type: 'damage', target: 'all', value: 182 },
          { type: 'xp', value: 710 },
          { type: 'gold', value: 1030 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'legendary', rarityBoost: 21 },
        ],
      },
    },
    {
      text: 'Use a mirror (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You reflect her gaze back! She turns herself to stone!',
        effects: [
          { type: 'damage', target: 'all', value: 135 },
          { type: 'xp', value: 770 },
          { type: 'gold', value: 1100 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 25 },
        ],
      },
    },
    {
      text: 'Resist petrification (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 38,
      },
      outcome: {
        text: 'Your fortitude resists the curse! You strike her down while immune!',
        effects: [
          { type: 'damage', target: 'weakest', value: 155 },
          { type: 'xp', value: 790 },
          { type: 'gold', value: 1120 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 26 },
        ],
      },
    },
  ],
  depth: 36,
  icon: GiMedusaHead,
}
