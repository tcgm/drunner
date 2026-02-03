import type { DungeonEvent } from '@/types'
import { GiSpikesInit } from 'react-icons/gi'

export const IRON_MAIDEN: DungeonEvent = {
  id: 'iron-maiden',
  type: 'boss',
  title: 'Iron Maiden',
  description: 'A torture device given horrible life. The sarcophagus opens to reveal dozens of rusted spikes and a hunger for victims. It shuffles forward with grinding metal.',
  choices: [
    {
      text: 'Avoid the spikes',
      outcome: {
        text: 'The maiden lunges! Spikes pierce from every angle!',
        effects: [
          { type: 'damage', target: 'all', value: 128 },
          { type: 'xp', value: 470 },
          { type: 'gold', value: 620 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 17 },
        ],
      },
    },
    {
      text: 'Jam the mechanism (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You disable its hinges! The maiden can\'t close or attack!',
        effects: [
          { type: 'damage', target: 'weakest', value: 80 },
          { type: 'xp', value: 518 },
          { type: 'gold', value: 678 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 21 },
        ],
      },
    },
    {
      text: 'Dismantle it (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 29,
      },
      outcome: {
        text: 'You tear the construct apart piece by piece!',
        effects: [
          { type: 'damage', target: 'all', value: 94 },
          { type: 'xp', value: 508 },
          { type: 'gold', value: 668 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', rarityBoost: 20 },
        ],
      },
    },
  ],
  depth: 22,
  icon: GiSpikesInit,
}
