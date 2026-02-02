import type { DungeonEvent } from '@/types'
import { GiHolyGrail } from 'react-icons/gi'

export const GRAIL_GUARDIAN: DungeonEvent = {
  id: 'grail-guardian',
  type: 'boss',
  title: 'Grail Guardian',
  description: 'An immortal knight sworn to protect a sacred relic. Its oath gives it power beyond any mortal warrior.',
  choices: [
    {
      text: 'Challenge the oath',
      outcome: {
        text: 'Divine power empowers every strike! The guardian is unstoppable!',
        effects: [
          { type: 'damage', target: 'all', value: 458 },
          { type: 'xp', value: 1890 },
          { type: 'gold', value: 2835 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 37 },
        ],
      },
    },
    {
      text: 'Prove worthy (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your purity is recognized! The guardian stands aside!',
        effects: [
          { type: 'damage', target: 'all', value: 395 },
          { type: 'xp', value: 2020 },
          { type: 'gold', value: 3030 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 48 },
        ],
      },
    },
    {
      text: 'Break the oath (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 70,
      },
      outcome: {
        text: 'You shatter the binding! Without its oath, the guardian is merely mortal!',
        effects: [
          { type: 'damage', target: 'strongest', value: 408 },
          { type: 'xp', value: 2045 },
          { type: 'gold', value: 3068 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 49 },
        ],
      },
    },
  ],
  depth: 66,
  icon: GiHolyGrail,
}
