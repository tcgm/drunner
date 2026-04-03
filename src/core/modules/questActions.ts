/**
 * Quest actions module
 * Handles quest board management, progress tracking, and reward claiming.
 */

import type { StateCreator } from 'zustand'
import type { GameState, Run } from '@/types'
import type { Quest } from '@/types/quests'
import { generateQuests, QUEST_REFRESH_INTERVAL_MS } from '@/data/quests'

export interface QuestActionsSlice {
  /** Accept an available quest, moving it to active status. */
  acceptQuest: (questId: string) => void
  /** Claim the reward for a completed quest. */
  claimQuestReward: (questId: string) => void
  /**
   * Refresh the quest board: remove expired available quests and fill empty slots.
   * Should be called whenever the Guild Hall modal is opened.
   */
  refreshQuestBoard: () => void
  /**
   * Process a finished run against all active quests, updating progress.
   * Safe to call multiple times – runs are deduplicated by ID.
   */
  processRunForQuests: (run: Run) => void
}

export const createQuestActions: StateCreator<
  GameState & QuestActionsSlice,
  [],
  [],
  QuestActionsSlice
> = (set) => ({
  acceptQuest: (questId) =>
    set((state) => {
      const now = Date.now()
      const quests = state.quests.map((q): Quest =>
        q.id === questId && q.status === 'available'
          ? { ...q, status: 'active', acceptedAt: now }
          : q
      )
      return { quests }
    }),

  claimQuestReward: (questId) =>
    set((state) => {
      const quest = state.quests.find(q => q.id === questId)
      if (!quest || quest.status !== 'completed') return {}

      const quests = state.quests.map((q): Quest =>
        q.id === questId ? { ...q, status: 'claimed' } : q
      )
      return {
        quests,
        bankGold: state.bankGold + quest.reward.gold,
        metaXp: state.metaXp + quest.reward.metaXp,
      }
    }),

  refreshQuestBoard: () =>
    set((state) => {
      const now = Date.now()

      // Prune claimed quests older than 24 hours to keep the list clean
      const pruned = state.quests
        // Backfill rarity for quests persisted before the rarity field was introduced
        .map((q): Quest => q.rarity ? q : { ...q, rarity: 'common' })
        .filter(q => {
        if (q.status === 'claimed') {
          return now - (q.completedAt ?? q.generatedAt) < 24 * 60 * 60 * 1000
        }
        return true
      })

      // Remove expired available quests
      const nonExpired = pruned.filter(q =>
        q.status !== 'available' || q.expiresAt > now
      )

      const timeSinceRefresh = now - (state.questsLastRefreshed ?? 0)
      const needsTimeRefresh = timeSinceRefresh >= QUEST_REFRESH_INTERVAL_MS

      // If timed refresh is due, replace all available quests entirely
      if (needsTimeRefresh) {
        const withoutAvailable = nonExpired.filter(q => q.status !== 'available')
        const fresh = generateQuests(withoutAvailable, state.party, 3)
        return {
          quests: [...withoutAvailable, ...fresh],
          questsLastRefreshed: now,
        }
      }

      // Otherwise just fill empty slots
      const availableCount = nonExpired.filter(q => q.status === 'available').length
      const slotsToFill = 3 - availableCount
      if (slotsToFill <= 0) {
        return nonExpired.length !== state.quests.length ? { quests: nonExpired } : {}
      }

      const fresh = generateQuests(nonExpired, state.party, slotsToFill)
      return {
        quests: [...nonExpired, ...fresh],
        questsLastRefreshed: state.questsLastRefreshed ?? now,
      }
    }),

  processRunForQuests: (run) =>
    set((state) => {
      if (!run.endDate || !run.id) return {}
      if ((state.questRunsProcessed ?? []).includes(run.id)) return {}

      const updatedQuests = state.quests.map((quest): Quest => {
        if (quest.status !== 'active') return quest

        let progressDelta = 0

        switch (quest.type) {
          case 'kill_enemies':
            progressDelta = run.enemiesDefeated ?? 0
            break
          case 'complete_runs':
            progressDelta = (run.result === 'victory' || run.result === 'retreat') ? 1 : 0
            break
          case 'reach_floor': {
            const floorReached = run.finalFloor ?? 0
            if (floorReached >= quest.requirement && quest.progress < quest.requirement) {
              // Complete it immediately once the threshold floor is hit
              progressDelta = quest.requirement - quest.progress
            }
            break
          }
          case 'defeat_bosses':
            progressDelta = run.bossesDefeated ?? 0
            break
          case 'earn_gold':
            progressDelta = run.goldEarned ?? 0
            break
        }

        const newProgress = Math.min(quest.requirement, quest.progress + progressDelta)
        const justCompleted = newProgress >= quest.requirement && quest.status === 'active'

        return {
          ...quest,
          progress: newProgress,
          status: justCompleted ? 'completed' : quest.status,
          completedAt: justCompleted && !quest.completedAt ? Date.now() : quest.completedAt,
        }
      })

      return {
        quests: updatedQuests,
        questRunsProcessed: [...(state.questRunsProcessed ?? []), run.id],
      }
    }),
})
