import type { DungeonEvent } from '@/types'
import { GiAbstract050 } from 'react-icons/gi'

export const VOID_REAVERS: DungeonEvent = {
  id: 'void-reavers',
  type: 'boss',
  title: 'The Void Reavers',
  description: 'Three beings of pure antimatter, bound in symbiosis. Where they exist, reality ceases. They move through space by unmaking it. Fighting them means fighting the absence of existence itself.',
  choices: [
    {
      text: 'Fight all three simultaneously',
      outcome: {
        text: 'You divide your attention between the three entities, suffering wounds from all sides before finally overwhelming them!',
        effects: [
          { type: 'damage', target: 'all', value: 420 },
          { type: 'xp', value: 1750 },
          { type: 'gold', value: 2600 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 30 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 30 },
        ],
      },
    },
    {
      text: 'Break their symbiosis (High Luck)',
      successChance: 0.30,
      statModifier: 'luck',
      successOutcome: {
        text: 'You sever the connection binding them! Without their unity, they collapse into harmless void energy!',
        effects: [
          { type: 'damage', target: 'random', value: 240 },
          { type: 'xp', value: 2100 },
          { type: 'gold', value: 3000 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 40 },
          { type: 'item', itemType: 'accessory1', minRarity: 'legendary', rarityBoost: 38 },
        ],
      },
      failureOutcome: {
        text: 'Your attempt fails and they channel their combined power directly at you!',
        effects: [
          { type: 'damage', target: 'all', value: 540 },
          { type: 'xp', value: 1500 },
          { type: 'gold', value: 2200 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 22 },
        ],
      },
    },
    {
      text: 'Channel holy power (Cleric/Paladin bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your divine radiance proves to be the antithesis of their void nature! They are banished from reality!',
        effects: [
          { type: 'damage', target: 'all', value: 330 },
          { type: 'heal', target: 'all', value: 90 },
          { type: 'xp', value: 1950 },
          { type: 'gold', value: 2800 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 36 },
        ],
      },
    },
  ],
  depth: 65,
  icon: GiAbstract050,
}
