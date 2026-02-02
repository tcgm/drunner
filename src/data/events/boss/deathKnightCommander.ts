import type { DungeonEvent } from '@/types'
import { GiBrokenSkull } from 'react-icons/gi'

export const DEATH_KNIGHT_COMMANDER: DungeonEvent = {
  id: 'death-knight-commander',
  type: 'boss',
  title: 'Death Knight Commander',
  description: 'A fallen paladin cursed to serve in death. Their once-holy blade now radiates necrotic energy, and their armor is etched with runes of undeath.',
  choices: [
    {
      text: 'Duel the death knight',
      outcome: {
        text: 'Their dark powers and martial prowess combine devastatingly! Each strike drains your life!',
        effects: [
          { type: 'damage', target: 'all', value: 195 },
          { type: 'xp', value: 740 },
          { type: 'gold', value: 1070 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'legendary', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Break the curse (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your divine power shatters their curse! They thank you as they find peace!',
        effects: [
          { type: 'damage', target: 'all', value: 152 },
          { type: 'xp', value: 805 },
          { type: 'gold', value: 1150 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 27 },
        ],
      },
    },
    {
      text: 'Overwhelm with force (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 42,
      },
      outcome: {
        text: 'Pure might shatters their defenses! You destroy them utterly!',
        effects: [
          { type: 'damage', target: 'random', value: 165 },
          { type: 'xp', value: 825 },
          { type: 'gold', value: 1180 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 29 },
        ],
      },
    },
  ],
  depth: 39,
  icon: GiBrokenSkull,
}
