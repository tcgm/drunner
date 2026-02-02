import type { DungeonEvent } from '@/types'
import { GiBleedingWound } from 'react-icons/gi'

export const HEMORRHAGE_FIENDS: DungeonEvent = {
  id: 'hemorrhage-fiends',
  type: 'combat',
  title: 'Hemorrhage Fiends',
  description: 'Demons that cause uncontrollable bleeding!',
  choices: [
    {
      text: 'Endure the bleeding',
      outcome: {
        text: 'You lose dangerous amounts of blood!',
        effects: [
          { type: 'damage', target: 'all', value: 40 },
          { type: 'xp', value: 161 },
          { type: 'gold', value: 103 },
        ],
      },
    },
    {
      text: 'Heal and fight (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine healing stops the blood loss!',
        effects: [
          { type: 'damage', target: 'all', value: 30 },
          { type: 'xp', value: 176 },
          { type: 'gold', value: 114 },
        ],
      },
    },
  ],
  depth: 28,
  icon: GiBleedingWound,
}
