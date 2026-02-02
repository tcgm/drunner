import type { DungeonEvent } from '@/types'
import { GiCursedStar } from 'react-icons/gi'

export const DARK_PROPHET: DungeonEvent = {
  id: 'dark-prophet',
  type: 'boss',
  title: 'Dark Prophet',
  description: 'A mad cultist who glimpsed forbidden truths. They wield reality-warping powers granted by their eldritch patron, speaking in tongues as they attack.',
  choices: [
    {
      text: 'Resist the madness',
      outcome: {
        text: 'Their words assault your sanity! Reality bends as their prophecies manifest!',
        effects: [
          { type: 'damage', target: 'all', value: 185 },
          { type: 'xp', value: 720 },
          { type: 'gold', value: 1040 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'legendary', rarityBoost: 21 },
        ],
      },
    },
    {
      text: 'Silence them (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 39,
      },
      outcome: {
        text: 'You stop their chanting! Without their words, their power fades!',
        effects: [
          { type: 'damage', target: 'weakest', value: 145 },
          { type: 'xp', value: 775 },
          { type: 'gold', value: 1105 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 25 },
        ],
      },
    },
    {
      text: 'Dispel the patron (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Divine authority severs their connection! The prophet collapses, abandoned!',
        effects: [
          { type: 'damage', target: 'all', value: 142 },
          { type: 'xp', value: 795 },
          { type: 'gold', value: 1135 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 26 },
        ],
      },
    },
  ],
  depth: 36,
  icon: GiCursedStar,
}
