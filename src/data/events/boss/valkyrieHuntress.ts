import type { DungeonEvent } from '@/types'
import { GiWingedSword } from 'react-icons/gi'

export const VALKYRIE_HUNTRESS: DungeonEvent = {
  id: 'valkyrie-huntress',
  type: 'boss',
  title: 'Valkyrie Huntress',
  description: 'A warrior maiden with gleaming armor and massive wings descends from above. Her spear glows with divine fury as she marks you as her prey.',
  choices: [
    {
      text: 'Face her in battle',
      outcome: {
        text: 'Her aerial attacks and divine power are overwhelming! She strikes from every angle!',
        effects: [
          { type: 'damage', target: 'all', value: 146 },
          { type: 'xp', value: 505 },
          { type: 'gold', value: 665 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Ground her (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 36,
      },
      outcome: {
        text: 'You destroy her wings! Without flight, she\'s much more vulnerable!',
        effects: [
          { type: 'damage', target: 'strongest', value: 113 },
          { type: 'xp', value: 550 },
          { type: 'gold', value: 725 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Prove your worth (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You fight with such honor that she yields! She grants you a warrior\'s blessing!',
        effects: [
          { type: 'damage', target: 'all', value: 95 },
          { type: 'xp', value: 560 },
          { type: 'gold', value: 740 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 26 },
        ],
      },
    },
  ],
  depth: 29,
  icon: GiWingedSword,
}
