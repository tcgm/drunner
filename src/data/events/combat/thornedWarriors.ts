import type { DungeonEvent } from '@/types'
import { GiSpikedArmor } from 'react-icons/gi'

export const THORNED_WARRIORS: DungeonEvent = {
  id: 'thorned-warriors',
  type: 'combat',
  title: 'Thorned Warriors',
  description: 'Armored foes covered in razor-sharp thorns charge forward!',
  choices: [
    {
      text: 'Fight carefully',
      outcome: {
        text: 'Their thorns cut you as you strike!',
        effects: [
          { type: 'damage', target: 'random', value: 25 },
          { type: 'xp', value: 87 },
          { type: 'gold', value: 52 },
        ],
      },
    },
    {
      text: 'Precision strikes (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You avoid the thorns and find gaps!',
        effects: [
          { type: 'damage', target: 'random', value: 16 },
          { type: 'xp', value: 97 },
          { type: 'gold', value: 60 },
        ],
      },
    },
  ],
  depth: 14,
  icon: GiSpikedArmor,
}
