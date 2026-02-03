import type { DungeonEvent } from '@/types'
import { GiImpLaugh } from 'react-icons/gi'

export const DEMON_EMPEROR: DungeonEvent = {
  id: 'demon-emperor',
  type: 'boss',
  title: 'Demon Emperor',
  description: 'The supreme ruler of the Abyss. Countless demon legions kneel before it. Its power is absolute among demonkind.',
  choices: [
    {
      text: 'Face abyssal majesty',
      outcome: {
        text: 'The concentrated evil of the Abyss! Demonic power beyond mortal comprehension!',
        effects: [
          { type: 'damage', target: 'all', value: 605 },
          { type: 'xp', value: 2525 },
          { type: 'gold', value: 3788 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 49 },
        ],
      },
    },
    {
      text: 'Banish to the Abyss (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Holy power sends it home! Even emperors cannot resist divine command!',
        effects: [
          { type: 'damage', target: 'all', value: 552 },
          { type: 'xp', value: 2685 },
          { type: 'gold', value: 4028 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 68 },
        ],
      },
    },
    {
      text: 'Challenge for the throne (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 84,
      },
      outcome: {
        text: 'You defeat the emperor in single combat! You could rule the Abyss!',
        effects: [
          { type: 'damage', target: 'strongest', value: 565 },
          { type: 'xp', value: 2715 },
          { type: 'gold', value: 4073 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 69 },
        ],
      },
    },
  ],
  depth: 87,
  icon: GiImpLaugh,
}
