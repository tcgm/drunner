import type { DungeonEvent } from '@/types'
import { GiVortex } from 'react-icons/gi'

export const ZONE_BOSS_40: DungeonEvent = {
  id: 'zone-boss-40-void-herald',
  type: 'boss',
  title: 'Herald of the Void',
  description: 'A manifestation of absolute nothingness. It consumes light, sound, and hope itself. Where it passes, reality unravels. This entity should not exist.',
  depth: 40,
  isZoneBoss: true,
  zoneBossFloor: 40,
  icon: GiVortex,
  choices: [
    {
      text: 'Anchor yourself to reality',
      outcome: {
        text: 'You fight to maintain your existence as the void tries to unmake you! Through sheer will, you force it back into the abyss!',
        effects: [
          { type: 'damage', target: 'all', value: 245 },
          { type: 'xp', value: 900 },
          { type: 'gold', value: 1600 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 18 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 12 },
        ],
      },
    },
    {
      text: 'Pierce the void (High Magic Power)',
      requirements: { stat: 'magicPower', minValue: 60 },
      outcome: {
        text: 'Your magical essence proves stronger than its emptiness! You shatter its form with a burst of pure arcane energy!',
        effects: [
          { type: 'damage', target: 'all', value: 175 },
          { type: 'xp', value: 1100 },
          { type: 'gold', value: 1800 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 25 },
        ],
      },
    },
    {
      text: 'Overwhelm with numbers',
      outcome: {
        text: 'Together you assault it from all angles! Even the void cannot consume your combined might!',
        effects: [
          { type: 'damage', target: 'all', value: 210 },
          { type: 'xp', value: 1000 },
          { type: 'gold', value: 1700 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 20 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 20 },
        ],
      },
    },
  ],
}
