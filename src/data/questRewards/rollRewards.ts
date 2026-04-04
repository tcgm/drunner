/**
 * Quest reward calculation
 * Houses gold/XP reward maths (extracted from data/quests.ts) and
 * fragment-reward rolling logic.
 */

import type { QuestDifficulty, QuestItemReward } from '@/types/quests'
import type { ItemRarity } from '@/types'
import { QUEST_CONFIG } from '@/config/questConfig'
import { RARITY_CONFIGS } from '@/systems/rarity/raritySystem'
import { getMaterialsByRarity } from '@data/items/materials'
import { FRAGMENT_REWARD_TABLE } from './fragmentTable'

// mirrors niceRound in data/quests.ts
function niceRound(n: number, snap = 5): number {
  return Math.max(1, Math.round(n / snap) * snap)
}

// ── Gold / meta-XP rewards ────────────────────────────────────────────────────

/**
 * Compute the gold and meta-XP payout for a quest given its per-requirement rates
 * and final scaled requirement value.
 */
export function calcGoldXpReward(
  goldPerReq: number,
  xpPerReq: number,
  requirement: number,
  difficulty: QuestDifficulty,
): { gold: number; metaXp: number } {
  const mult = QUEST_CONFIG.difficultyRewardMult[difficulty]
  return {
    gold:   Math.max(QUEST_CONFIG.minRewardGold,   niceRound(goldPerReq * requirement * mult, QUEST_CONFIG.rewardGoldSnap)),
    metaXp: Math.max(QUEST_CONFIG.minRewardMetaXp, niceRound(xpPerReq   * requirement * mult, QUEST_CONFIG.rewardXpSnap)),
  }
}

// ── Fragment rewards ──────────────────────────────────────────────────────────

/**
 * Roll the item rewards (currently: material fragments) for a newly-generated quest.
 *
 * Returns an empty array when:
 *  - the rarity has no fragment pool, or
 *  - the random chance roll fails, or
 *  - no eligible material is unlocked yet (all pool tiers are above deepestFloor)
 */
export function rollFragmentRewards(
  questRarity: ItemRarity,
  difficulty: QuestDifficulty,
  deepestFloor: number,
): QuestItemReward[] {
  const cfg = QUEST_CONFIG.fragmentRewards

  // Chance gate
  const chance = cfg.chanceByDifficulty[difficulty]
  if (Math.random() > chance) return []

  // Rarity pool for this quest tier
  const rarityPool = FRAGMENT_REWARD_TABLE[questRarity] ?? []
  if (rarityPool.length === 0) return []

  // Only show tiers the player has actually reached
  const unlocked = rarityPool.filter(r => (RARITY_CONFIGS[r]?.minFloor ?? 0) <= deepestFloor)
  if (unlocked.length === 0) return []

  // Pick a random unlocked rarity tier, then a random material from it
  const chosenRarity = unlocked[Math.floor(Math.random() * unlocked.length)]
  const materials = getMaterialsByRarity(chosenRarity)
  if (materials.length === 0) return []

  const material  = materials[Math.floor(Math.random() * materials.length)]
  const quantity  = cfg.quantityByDifficulty[difficulty]

  return [{ type: 'material_fragment', materialId: material.id, quantity }]
}
