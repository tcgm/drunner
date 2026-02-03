import type { DungeonEvent } from '@/types'
import { GiSkeletonKey } from 'react-icons/gi'

export const SKELETAL_CHAMPION: DungeonEvent = {
  id: 'skeletal-champion',
  type: 'boss',
  title: 'Skeletal Champion',
  description: 'An ancient warrior rises from a throne of bones, its armor rusted but still formidable. Dark magic animates its skeletal form.',
  choices: [
    {
      text: 'Smash the bones',
      outcome: {
        text: 'Your weapon shatters bone after bone, but the champion fights on!',
        effects: [
          { type: 'damage', target: 'all', value: 30 },
          { type: 'xp', value: 200 },
          { type: 'gold', value: 280 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 10 },
        ],
      },
    },
    {
      text: 'Break the skull (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 10,
      },
      outcome: {
        text: 'You crush its skull with a mighty blow! The necromantic energy dissipates!',
        effects: [
          { type: 'damage', target: 'random', value: 22 },
          { type: 'xp', value: 230 },
          { type: 'gold', value: 330 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 13 },
        ],
      },
    },
    {
      text: 'Holy magic disrupts undead (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Divine light floods the chamber! The skeleton crumbles to dust!',
        effects: [
          { type: 'damage', target: 'all', value: 12 },
          { type: 'xp', value: 250 },
          { type: 'gold', value: 350 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 15 },
        ],
      },
    },
  ],
  depth: 4,
  icon: GiSkeletonKey,
}
