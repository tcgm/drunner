import {
  GiSwordsPower,
  GiWalkingBoot,
  GiLevelThreeAdvanced,
  GiDragonHead,
  GiCoins,
} from 'react-icons/gi'
import type { QuestDifficulty, QuestType } from '@/types/quests'
import type React from 'react'

export const DIFFICULTY_COLOR: Record<QuestDifficulty, string> = {
  easy:   'green',
  medium: 'orange',
  hard:   'red',
}

export const DIFFICULTY_LABEL: Record<QuestDifficulty, string> = {
  easy:   'Easy',
  medium: 'Medium',
  hard:   'Hard',
}

export const QUEST_TYPE_ICON: Record<QuestType, React.ElementType> = {
  kill_enemies:  GiSwordsPower,
  complete_runs: GiWalkingBoot,
  reach_floor:   GiLevelThreeAdvanced,
  defeat_bosses: GiDragonHead,
  earn_gold:     GiCoins,
}

export function formatTimeLeft(expiresAt: number): string {
  const msLeft = expiresAt - Date.now()
  if (msLeft <= 0) return 'Expired'
  const h = Math.floor(msLeft / 3600000)
  const m = Math.floor((msLeft % 3600000) / 60000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}
