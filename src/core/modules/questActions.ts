/**
 * Quest actions module
 * Handles quest board management, progress tracking, and reward claiming.
 */

import type { StateCreator } from 'zustand'
import type { GameState, Run, Item } from '@/types'
import type { Quest } from '@/types/quests'
import type { MaterialFragmentV3 } from '@/types/items-v3'
import { v4 as uuidv4 } from 'uuid'
import { hydrateItem } from '@/utils/itemHydration'
import { generateQuests } from '@/data/quests'
import { RARITY_CONFIGS } from '@/systems/rarity/raritySystem'
import { QUEST_CONFIG } from '@/config/questConfig'

export interface QuestActionsSlice {
  /** Accept an available quest, moving it to active status. */
  acceptQuest: (questId: string) => void
  /** Cancel an active quest, removing it from the list entirely. Progress is lost. */
  cancelQuest: (questId: string) => void
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

  cancelQuest: (questId) =>
    set((state) => ({
      quests: state.quests.filter(q => !(q.id === questId && q.status === 'active')),
    })),

  claimQuestReward: (questId) =>
    set((state) => {
      const quest = state.quests.find(q => q.id === questId)
      if (!quest || quest.status !== 'completed') return {}

      // Hydrate any item rewards (e.g. material fragments) into full Item objects
      const newItems: Item[] = (quest.reward.items ?? []).flatMap(reward => {
        if (reward.type === 'material_fragment') {
          const v3: MaterialFragmentV3 = {
            version: 3,
            id: uuidv4(),
            itemType: 'material',
            materialId: reward.materialId,
            quantity: reward.quantity,
          }
          return [hydrateItem(v3)]
        }
        return []
      })

      // Fill bank up to its slot limit, remainder goes to overflow
      const bankSpace = state.bankStorageSlots - state.bankInventory.length
      const forBank     = newItems.slice(0, Math.max(0, bankSpace))
      const forOverflow = newItems.slice(Math.max(0, bankSpace))

      const quests = state.quests.map((q): Quest =>
        q.id === questId ? { ...q, status: 'claimed' } : q
      )
      return {
        quests,
        bankGold: state.bankGold + quest.reward.gold,
        metaXp: state.metaXp + quest.reward.metaXp,
        bankInventory: [...state.bankInventory, ...forBank],
        overflowInventory: [...(state.overflowInventory ?? []), ...forOverflow],
      }
    }),

  refreshQuestBoard: () =>
    set((state) => {
      const now = Date.now()
      const deepestFloor = Math.max(
        state.dungeon.floor,
        ...state.runHistory.map(r => r.finalFloor ?? 0),
      )

      // Prune claimed quests older than 24 hours to keep the list clean
      const pruned = state.quests
        // Backfill rarity/minFloor for quests persisted before these fields were introduced
        .map((q): Quest => {
          const withRarity: Quest = q.rarity ? q : { ...q, rarity: 'common' }
          const withMinFloor = withRarity.minFloor != null
            ? withRarity
            : { ...withRarity, minFloor: RARITY_CONFIGS[withRarity.rarity]?.minFloor ?? 0 }
          return withMinFloor.reward?.items != null
            ? withMinFloor
            : { ...withMinFloor, reward: { ...withMinFloor.reward, items: [] } }
        })
        .filter(q => {
        if (q.status === 'claimed') {
          return now - (q.completedAt ?? q.generatedAt) < QUEST_CONFIG.claimedRetentionHours * QUEST_CONFIG.msPerHour
        }
        return true
      })

      // Remove expired available quests
      const nonExpired = pruned.filter(q =>
        q.status !== 'available' || q.expiresAt > now
      )

      const timeSinceRefresh = now - (state.questsLastRefreshed ?? 0)
      const needsTimeRefresh = timeSinceRefresh >= QUEST_CONFIG.refreshIntervalHours * QUEST_CONFIG.msPerHour

      // If timed refresh is due, replace all available quests entirely
      if (needsTimeRefresh) {
        const withoutAvailable = nonExpired.filter(q => q.status !== 'available')
        const fresh = generateQuests(withoutAvailable, state.party, QUEST_CONFIG.boardSlots, deepestFloor)
        return {
          quests: [...withoutAvailable, ...fresh],
          questsLastRefreshed: now,
        }
      }

      // Otherwise just fill empty slots
      const availableCount = nonExpired.filter(q => q.status === 'available').length
      const slotsToFill = QUEST_CONFIG.boardSlots - availableCount
      if (slotsToFill <= 0) {
        return nonExpired.length !== state.quests.length ? { quests: nonExpired } : {}
      }

      const fresh = generateQuests(nonExpired, state.party, slotsToFill, deepestFloor)
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
