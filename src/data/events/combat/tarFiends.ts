import type { DungeonEvent } from '@/types'
import { GiBoilingBubbles } from 'react-icons/gi'

export const TAR_FIENDS: DungeonEvent = {
  id: 'tar-fiends',
  type: 'combat',
  title: 'Tar Fiends',
  description: 'Sticky demons trap you in boiling tar!',
  choices: [
    {
      text: 'Pull yourself free',
      outcome: {
        text: 'The tar burns and binds!',
        effects: [
          { type: 'damage', target: 'weakest', value: 7 },
          { type: 'xp', value: 33 },
          { type: 'gold', value: 17 },
        ],
      },
    },
    {
      text: 'Freeze the tar (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Ice hardens their form!',
        effects: [
          { type: 'damage', target: 'weakest', value: 4 },
          { type: 'xp', value: 43 },
          { type: 'gold', value: 23 },
        ],
      },
    },
  ],
  depth: 2,
  icon: GiBoilingBubbles,
}
