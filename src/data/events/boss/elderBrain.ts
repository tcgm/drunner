import type { DungeonEvent } from '@/types'
import { GiBleedingEye } from 'react-icons/gi'

export const ELDER_BRAIN: DungeonEvent = {
  id: 'elder-brain',
  type: 'boss',
  title: 'Elder Brain',
  description: 'A massive psychic brain that controls legions of mind flayers. Its telepathic assault can break the strongest wills.',
  choices: [
    {
      text: 'Resist mind control',
      outcome: {
        text: 'Psychic waves crash over you! Your thoughts become weapons against yourself!',
        effects: [
          { type: 'damage', target: 'all', value: 310 },
          { type: 'xp', value: 1170 },
          { type: 'gold', value: 1755 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Mental fortress (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 54,
      },
      outcome: {
        text: 'Your mind is unbreachable! The brain recoils in pain!',
        effects: [
          { type: 'damage', target: 'random', value: 258 },
          { type: 'xp', value: 1290 },
          { type: 'gold', value: 1935 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 29 },
        ],
      },
    },
    {
      text: 'Destroy physically (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You wade through psychic assault and hack the brain apart!',
        effects: [
          { type: 'damage', target: 'strongest', value: 275 },
          { type: 'xp', value: 1320 },
          { type: 'gold', value: 1980 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 30 },
        ],
      },
    },
  ],
  depth: 46,
  icon: GiBleedingEye,
}
