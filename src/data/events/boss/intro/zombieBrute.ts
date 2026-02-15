import type { DungeonEvent } from '@/types'
import { GiSkullCrossedBones } from 'react-icons/gi'

export const ZOMBIE_BRUTE: DungeonEvent = {
  id: 'zombie-brute-intro',
  type: 'boss',
  title: 'Zombie Brute',
  description: 'A shambling undead behemoth blocks your path. It\'s slow but powerful, with arms like battering rams.',
  choices: [
    {
      text: 'Destroy it piece by piece',
      outcome: {
        text: 'You hack away at the zombie, avoiding its massive fists. It falls apart!',
        effects: [
          { type: 'damage', target: 'all', value: 20 },
          { type: 'xp', value: 135 },
          { type: 'gold', value: 165 },
          { type: 'item', itemType: 'random', minRarity: 'common', rarityBoost: 7 },
        ],
      },
    },
    {
      text: 'Tank the hits (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 9,
      },
      outcome: {
        text: 'You weather its slow attacks and methodically take it down!',
        effects: [
          { type: 'damage', target: 'weakest', value: 15 },
          { type: 'xp', value: 165 },
          { type: 'gold', value: 195 },
          { type: 'item', itemType: 'armor', minRarity: 'uncommon', rarityBoost: 9 },
        ],
      },
    },
    {
      text: 'Turn the undead (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your holy power forces the zombie to crumble into dust instantly!',
        effects: [
          { type: 'damage', target: 'all', value: 9 },
          { type: 'xp', value: 175 },
          { type: 'gold', value: 215 },
          { type: 'item', itemType: 'weapon', minRarity: 'uncommon', rarityBoost: 12 },
        ],
      },
    },
  ],
  depth: 1,
  icon: GiSkullCrossedBones,
  isIntroBoss: true,
}
