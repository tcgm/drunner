import type { DungeonEvent } from '@/types'
import { GiCrossedBones } from 'react-icons/gi'

export const BONE_GOLEMS: DungeonEvent = {
  id: 'bone-golems',
  type: 'combat',
  title: 'Bone Golems',
  description: 'Massive constructs of fused bones lumber into view!',
  choices: [
    {
      text: 'Shatter them',
      outcome: {
        text: 'You break through bone after bone!',
        effects: [
          { type: 'damage', target: 'strongest', value: 23 },
          { type: 'xp', value: 85 },
          { type: 'gold', value: 51 },
        ],
      },
    },
    {
      text: 'Heavy impacts (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'Your blows pulverize their structure!',
        effects: [
          { type: 'damage', target: 'strongest', value: 15 },
          { type: 'xp', value: 95 },
          { type: 'gold', value: 59 },
        ],
      },
    },
  ],
  depth: 13,
  icon: GiCrossedBones,
}
