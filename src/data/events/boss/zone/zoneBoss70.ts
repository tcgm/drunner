import type { DungeonEvent } from '@/types'
import { GiAnubis } from 'react-icons/gi'

export const ZONE_BOSS_70: DungeonEvent = {
  id: 'zone-boss-70-death-incarnate',
  type: 'boss',
  title: 'Death Incarnate',
  description: 'The personification of mortality itself. It knows the moment of every death, past and future. Its mere presence drains life force. You can feel your souls being weighed.',
  depth: 70,
  isZoneBoss: true,
  zoneBossFloor: 70,
  icon: GiAnubis,
  choices: [
    {
      text: 'Defy death itself',
      outcome: {
        text: 'You refuse to accept your fate! Through sheer determination, you prove that death can be conquered!',
        effects: [
          { type: 'damage', target: 'all', value: 440 },
          { type: 'xp', value: 1800 },
          { type: 'gold', value: 2800 },
          { type: 'item', itemType: 'random', minRarity: 'celestial', maxRarity: 'realityAnchor', rarityBoost: 30 },
          { type: 'item', itemType: 'random', minRarity: 'celestial', maxRarity: 'realityAnchor', rarityBoost: 25 },
        ],
      },
    },
    {
      text: 'Command the dead (Necromancer bonus)',
      requirements: { class: 'Necromancer' },
      outcome: {
        text: 'You seize control of death magic itself! The entity is forced to bow before a true master of necromancy!',
        effects: [
          { type: 'damage', target: 'all', value: 280 },
          { type: 'revive' },
          { type: 'heal', target: 'all', value: 100 },
          { type: 'xp', value: 2200 },
          { type: 'gold', value: 3000 },
          { type: 'item', itemType: 'random', minRarity: 'celestial', maxRarity: 'structural', rarityBoost: 40 },
        ],
      },
    },
    {
      text: 'Accept death, then rise again',
      outcome: {
        text: 'You let yourselves die, then surge back with unprecedented power! Death learns fear for the first time!',
        effects: [
          { type: 'damage', target: 'all', value: 600, isTrueDamage: true },
          { type: 'revive' },
          { type: 'heal', target: 'all', value: 80 },
          { type: 'xp', value: 2000 },
          { type: 'gold', value: 2900 },
          { type: 'item', itemType: 'random', minRarity: 'celestial', maxRarity: 'realityAnchor', rarityBoost: 35 },
          { type: 'item', itemType: 'random', minRarity: 'celestial', maxRarity: 'realityAnchor', rarityBoost: 35 },
        ],
      },
    },
  ],
}
