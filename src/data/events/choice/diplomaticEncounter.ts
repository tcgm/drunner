import type { DungeonEvent } from '@/types'
import { GiTwoCoins } from 'react-icons/gi'

export const DIPLOMATIC_ENCOUNTER: DungeonEvent = {
  id: 'diplomatic-encounter',
  type: 'choice',
  title: 'Diplomatic Encounter',
  description: 'Two rival dungeon factions are about to clash. Perhaps you can mediate... or profit.',
  choices: [
    {
      text: 'Mediate the dispute (Charisma check)',
      requirements: { stat: 'charisma', minValue: 18 },
      outcome: {
        text: 'Your silver tongue brings peace! Both factions reward you generously.',
        effects: [
          { type: 'gold', value: 200 },
          { type: 'xp', value: 120 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 15 },
        ],
      },
    },
    {
      text: 'Try to mediate without tact',
      outcome: {
        text: 'Both sides turn on you for interfering!',
        effects: [
          { type: 'damage', target: 'all', value: 30 },
          { type: 'xp', value: 40 },
        ],
      },
    },
    {
      text: 'Side with the stronger faction',
      outcome: {
        text: 'You help them crush their enemies and claim the spoils.',
        effects: [
          { type: 'damage', target: 'random', value: 20 },
          { type: 'gold', value: 150 },
          { type: 'xp', value: 80 },
        ],
      },
    },
    {
      text: 'Sneak past while they fight',
      outcome: {
        text: 'You slip away while they\'re distracted.',
        effects: [
          { type: 'xp', value: 50 },
        ],
      },
    },
  ],
  depth: 12,
  icon: GiTwoCoins,
}
