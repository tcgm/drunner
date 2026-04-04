import type { ItemRarity } from '@/types'

export type { ItemRarity }

export type QuestType =
  | 'kill_enemies'
  | 'reach_floor'
  | 'complete_runs'
  | 'defeat_bosses'
  | 'earn_gold'

export type QuestDifficulty = 'easy' | 'medium' | 'hard'

export type QuestStatus = 'available' | 'active' | 'completed' | 'claimed'

/**
 * A single non-currency item that can be part of a quest reward.
 * Stored on the quest at generation time so the player can preview it before accepting.
 */
export type QuestItemReward =
  | { type: 'material_fragment'; materialId: string; quantity: number }

export interface QuestReward {
  gold: number
  metaXp: number
  items: QuestItemReward[]
}

export interface Quest {
  id: string
  title: string
  description: string
  type: QuestType
  rarity: ItemRarity
  minFloor: number      // minimum floor the player must have reached (derived from rarity)
  requirement: number
  progress: number
  reward: QuestReward
  status: QuestStatus
  difficulty: QuestDifficulty
  generatedAt: number
  expiresAt: number     // for 'available' quests – expire if not accepted in time
  acceptedAt?: number
  completedAt?: number
}
