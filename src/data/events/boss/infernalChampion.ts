import type { DungeonEvent } from '@/types'
import { GiFlamingClaw } from 'react-icons/gi'

export const INFERNAL_CHAMPION: DungeonEvent = {
  id: 'infernal-champion',
  type: 'boss',
  title: 'Infernal Champion',
  description: 'A pit fiend\'s lieutenant stands in full hellforged armor. Its flaming sword leaves trails of fire, and sulfurous smoke billows from its nostrils.',
  choices: [
    {
      text: 'Combat the demon',
      outcome: {
        text: 'Hellfire and steel combine in a devastating assault! You\'re seared and battered!',
        effects: [
          { type: 'damage', target: 'all', value: 134 },
          { type: 'xp', value: 488 },
          { type: 'gold', value: 638 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 19 },
        ],
      },
    },
    {
      text: 'Banish to the hells (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your divine authority sends it back to the Nine Hells!',
        effects: [
          { type: 'damage', target: 'all', value: 88 },
          { type: 'xp', value: 532 },
          { type: 'gold', value: 697 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Exploit armor gaps (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 32,
      },
      outcome: {
        text: 'You find weak points in the hellforged plate! Critical strikes bring it down!',
        effects: [
          { type: 'damage', target: 'random', value: 98 },
          { type: 'xp', value: 527 },
          { type: 'gold', value: 692 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 22 },
        ],
      },
    },
  ],
  depth: 26,
  icon: GiFlamingClaw,
}
