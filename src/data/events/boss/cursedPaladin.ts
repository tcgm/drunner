import type { DungeonEvent } from '@/types'
import { GiCursedStar } from 'react-icons/gi'

export const CURSED_PALADIN: DungeonEvent = {
  id: 'cursed-paladin',
  type: 'boss',
  title: 'Cursed Paladin',
  description: 'A once-holy warrior corrupted by darkness. His blessed armor is now tainted, and his sword drips with black ichor. He fights with grim determination.',
  choices: [
    {
      text: 'Duel the fallen hero',
      outcome: {
        text: 'His corrupted power is formidable! Each strike carries dark energy!',
        effects: [
          { type: 'damage', target: 'all', value: 71 },
          { type: 'xp', value: 322 },
          { type: 'gold', value: 432 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'epic', rarityBoost: 14 },
        ],
      },
    },
    {
      text: 'Purify him (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your divine magic breaks the curse! He thanks you as he fades away!',
        effects: [
          { type: 'damage', target: 'all', value: 46 },
          { type: 'xp', value: 367 },
          { type: 'gold', value: 477 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 18 },
        ],
      },
    },
    {
      text: 'Exploit the corruption (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 16,
      },
      outcome: {
        text: 'You turn the dark energy against him! The corruption consumes him!',
        effects: [
          { type: 'damage', target: 'random', value: 56 },
          { type: 'xp', value: 357 },
          { type: 'gold', value: 467 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 17 },
        ],
      },
    },
  ],
  depth: 14,
  icon: GiCursedStar,
}
