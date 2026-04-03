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

export interface QuestReward {
  gold: number
  metaXp: number
}

export interface Quest {
  id: string
  title: string
  description: string
  type: QuestType
  rarity: ItemRarity
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
