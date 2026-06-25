/**
 * useSyncHeroToHost – call after mutating a hero (equip, unequip, rename,
 * portrait change, etc) to push the updated hero to the host when the local
 * player is a guest. No-op in singleplayer or when not a guest, and no-op
 * when the hero isn't currently in a party slot (e.g. an unclaimed roster hero).
 */

import { useCallback } from 'react'
import { useGameStore } from '@/core/gameStore'
import { useMultiplayerStore } from './multiplayerStore'
import { syncGuestSlotHero } from './multiplayerService'

export function useSyncHeroToHost() {
  const mpRole = useMultiplayerStore((s) => s.role)

  return useCallback((heroId: string) => {
    if (mpRole !== 'guest') return
    const party = useGameStore.getState().party
    const idx = party.findIndex((h) => h?.id === heroId)
    if (idx === -1) return
    const hero = party[idx]
    if (hero) syncGuestSlotHero(idx, hero)
  }, [mpRole])
}
