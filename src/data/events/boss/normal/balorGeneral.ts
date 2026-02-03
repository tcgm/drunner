import type { DungeonEvent } from '@/types'
import { GiSkullSabertooth } from 'react-icons/gi'

export const BALOR_GENERAL: DungeonEvent = {
  id: 'balor-general',
  type: 'boss',
  title: 'Balor General',
  description: 'A demon lord wreathed in flames, wielding a sword and whip of fire. Its mere presence causes lesser beings to burst into flames.',
  choices: [
    {
      text: 'Combat the balor',
      outcome: {
        text: 'Fire and fury incarnate! The demon\'s attacks burn body and soul alike!',
        effects: [
          { type: 'damage', target: 'all', value: 315 },
          { type: 'xp', value: 1180 },
          { type: 'gold', value: 1780 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 25 },
        ],
      },
    },
    {
      text: 'Banish to the Abyss (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Divine authority casts it back to the infernal realms!',
        effects: [
          { type: 'damage', target: 'all', value: 238 },
          { type: 'xp', value: 1300 },
          { type: 'gold', value: 1950 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 29 },
        ],
      },
    },
    {
      text: 'Resist hellfire (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 52,
      },
      outcome: {
        text: 'Your defenses hold against the flames! You strike it down!',
        effects: [
          { type: 'damage', target: 'all', value: 268 },
          { type: 'xp', value: 1340 },
          { type: 'gold', value: 2010 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 31 },
        ],
      },
    },
  ],
  depth: 48,
  icon: GiSkullSabertooth,
}
