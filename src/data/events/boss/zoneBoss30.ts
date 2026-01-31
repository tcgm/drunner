import type { DungeonEvent } from '@/types'
import { GiDaemonSkull } from 'react-icons/gi'

export const ZONE_BOSS_30: DungeonEvent = {
  id: 'zone-boss-30-demon-prince',
  type: 'boss',
  title: 'Demon Prince Azrathos',
  description: 'A being of pure malevolence, wreathed in hellfire. The Demon Prince commands legions and has conquered countless realms. Reality itself seems to bend around its presence.',
  depth: 30,
  isZoneBoss: true,
  zoneBossFloor: 30,
  icon: GiDaemonSkull,
  choices: [
    {
      text: 'Resist its dark power',
      outcome: {
        text: 'You steel your will against its corruption and fight through waves of hellfire! The demon prince howls in rage as it falls!',
        effects: [
          { type: 'damage', target: 'all', value: 55 },
          { type: 'xp', value: 700 },
          { type: 'gold', value: 1200 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 15 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 8 },
        ],
      },
    },
    {
      text: 'Counter with magic (Mage/Necromancer bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You weave spells of incredible power, matching the demon\'s magic blow for blow! Your final incantation banishes it!',
        effects: [
          { type: 'damage', target: 'all', value: 40 },
          { type: 'xp', value: 850 },
          { type: 'gold', value: 1400 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Exploit demonic weakness (High Luck)',
      successChance: 0.4,
      statModifier: 'luck',
      successOutcome: {
        text: 'You discover an ancient binding seal and activate it! The demon is forced back to the abyss with minimal harm to your party!',
        effects: [
          { type: 'damage', target: 'random', value: 25 },
          { type: 'xp', value: 900 },
          { type: 'gold', value: 1500 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 25 },
          { type: 'item', itemType: 'accessory1', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 12 },
        ],
      },
      failureOutcome: {
        text: 'Your attempt fails and the demon prince unleashes its full fury upon you!',
        effects: [
          { type: 'damage', target: 'all', value: 70, isTrueDamage: true },
          { type: 'xp', value: 600 },
          { type: 'gold', value: 1000 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 10 },
        ],
      },
    },
  ],
}
