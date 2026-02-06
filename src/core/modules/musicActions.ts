/**
 * Music actions module
 * Handles audio/music settings and context changes
 */

import type { StateCreator } from 'zustand'
import type { GameState } from '@/types'
import { MusicContext } from '@/types/audio'
import { audioManager } from '@/systems/audio/audioManager'
import { getPlaylistForContext } from '@/config/musicConfig'

export interface MusicActionsSlice {
  setMusicVolume: (volume: number) => void
  setMusicEnabled: (enabled: boolean) => void
  changeMusicContext: (context: MusicContext) => void
}

export const createMusicActions: StateCreator<
  GameState & MusicActionsSlice,
  [],
  [],
  MusicActionsSlice
> = (set, get) => ({
  setMusicVolume: (volume: number) => {
    console.log('[GameStore] Setting music volume:', volume);
    set({ musicVolume: volume })
    audioManager.setVolume(volume)
  },

  setMusicEnabled: (enabled: boolean) => {
    console.log('[GameStore] Setting music enabled:', enabled);
    set({ musicEnabled: enabled })
    audioManager.setMusicEnabled(enabled)
  },

  changeMusicContext: (context: MusicContext) => {
    const currentContext = get().currentMusicContext;

    // Skip if already on this context
    if (currentContext === context) {
      console.log('[GameStore] Already on music context:', context, '- skipping');
      return;
    }

    console.log('[GameStore] Changing music context to:', context);
    const playlist = getPlaylistForContext(context)
    console.log('[GameStore] Got playlist:', playlist);
    set({ currentMusicContext: context });
    audioManager.changeContext(playlist)
  },
})
