/**
 * usePartyOwnership – shared helpers for restricting party/equipment actions
 * to the heroes a player actually owns in a multiplayer session.
 *
 * Outside of multiplayer (or before slot ownership is known) everything is
 * unrestricted — these all return "allowed" so singleplayer is unaffected.
 */

import { useMemo } from 'react'
import { useGameStore } from '@/core/gameStore'
import { useMultiplayerStore } from './multiplayerStore'
import { useSessionStore } from './sessionStore'
import { getSocket } from './socket'
import { getSlotsForPlayerIndex } from '@/config/multiplayerConfig'

/** Party slot indices owned by the local player. Null = not in a multiplayer session. */
export function useMyPartySlots(): number[] | null {
  const mpRole = useMultiplayerStore((s) => s.role)
  const mpPlayers = useMultiplayerStore((s) => s.players)
  const slotOwnership = useSessionStore((s) => s.slotOwnershipByIndex)

  return useMemo(() => {
    if (!mpRole || mpPlayers.length === 0 || slotOwnership.length === 0) return null
    const mySocketId = getSocket().id ?? ''
    const myIdx = mpPlayers.findIndex((p) => p.id === mySocketId)
    if (myIdx === -1) return null
    return getSlotsForPlayerIndex(myIdx, slotOwnership)
  }, [mpRole, mpPlayers, slotOwnership])
}

/** Whether the local player may equip/unequip/rename/etc the hero at the given party slot. */
export function useCanControlSlot(slotIndex: number | null): boolean {
  const mySlots = useMyPartySlots()
  if (slotIndex === null || slotIndex < 0) return true
  if (mySlots === null) return true
  return mySlots.includes(slotIndex)
}

/** Like useCanControlSlot, but looks up the slot by hero id. Heroes not currently in the party (e.g. roster-only) are always controllable. */
export function useCanControlHero(heroId: string | undefined): boolean {
  const party = useGameStore((s) => s.party)
  const mySlots = useMyPartySlots()

  return useMemo(() => {
    if (mySlots === null) return true
    if (!heroId) return true
    const idx = party.findIndex((h) => h?.id === heroId)
    if (idx === -1) return true
    return mySlots.includes(idx)
  }, [party, mySlots, heroId])
}
