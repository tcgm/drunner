/**
 * Lightweight local player profile.
 *
 * Persisted to localStorage (separate key from the main save so it
 * survives save wipes and imports). Intentionally minimal – just the
 * fields a player would want to carry across sessions.
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface PlayerProfile {
  /** Display name shown in multiplayer lobbies */
  displayName: string
  /** Optional short bio / tagline */
  tagline: string
  /** ISO date string of first launch */
  createdAt: string
  /** Total runs started across all saves (best-effort, incremented locally) */
  totalRunsStarted: number
  /** Preferred relay server URL (empty = use default) */
  preferredRelayUrl: string
}

interface PlayerProfileState extends PlayerProfile {
  setDisplayName: (name: string) => void
  setTagline: (tagline: string) => void
  setPreferredRelayUrl: (url: string) => void
  incrementRunsStarted: () => void
}

const DEFAULT_PROFILE: PlayerProfile = {
  displayName: 'Adventurer',
  tagline: '',
  createdAt: new Date().toISOString(),
  totalRunsStarted: 0,
  preferredRelayUrl: '',
}

export const usePlayerProfileStore = create<PlayerProfileState>()(
  persist(
    (set) => ({
      ...DEFAULT_PROFILE,

      setDisplayName: (displayName) =>
        set({ displayName: displayName.trim().slice(0, 24) || 'Adventurer' }),

      setTagline: (tagline) =>
        set({ tagline: tagline.slice(0, 60) }),

      setPreferredRelayUrl: (preferredRelayUrl) =>
        set({ preferredRelayUrl }),

      incrementRunsStarted: () =>
        set((s) => ({ totalRunsStarted: s.totalRunsStarted + 1 })),
    }),
    {
      name: 'drunner-player-profile',
      storage: createJSONStorage(() => localStorage),
      // On first load, fill in createdAt if missing from an older profile
      onRehydrateStorage: () => (state) => {
        if (state && !state.createdAt) {
          state.createdAt = new Date().toISOString()
        }
      },
    },
  ),
)
