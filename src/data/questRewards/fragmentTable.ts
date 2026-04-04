/**
 * Fragment reward table
 * Maps quest rarity → the pool of material-rarity tiers eligible for fragment rewards.
 * An empty array means no fragment is awarded for that quest rarity.
 *
 * The actual material is chosen at generation time from whichever of these tiers
 * the player has already unlocked (via deepestFloor), so high-tier quests always
 * feel meaningful without handing out unreachable materials.
 */

import type { ItemRarity } from '@/types'

export const FRAGMENT_REWARD_TABLE: Partial<Record<ItemRarity, ItemRarity[]>> = {
  //  quest rarity     eligible material-rarity pool (low → high)
  common:    [],
  uncommon:  ['junk', 'abundant', 'common'],
  rare:      ['common', 'uncommon'],
  veryRare:  ['uncommon', 'rare'],
  magical:   ['rare', 'veryRare'],
  elite:     ['veryRare', 'magical'],
  epic:      ['magical', 'elite'],
  legendary: ['elite', 'epic'],
  mythic:    ['epic', 'legendary'],
  mythicc:   ['legendary', 'mythic'],
  artifact:  ['mythic', 'mythicc'],
}
