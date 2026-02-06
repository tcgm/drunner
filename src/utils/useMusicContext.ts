import { useEffect, useRef } from 'react'
import { useGameStore } from '@/core/gameStore'
import { MusicContext } from '@/types/audio'

/**
 * Hook to automatically change music context
 * Usage: useMusicContext(MusicContext.PARTY_SCREEN)
 */
export function useMusicContext(context: MusicContext | null) {
  const lastContext = useRef<MusicContext | null>(null)

  useEffect(() => {
    // Skip if same as last context (prevents duplicate calls)
    if (context === lastContext.current) {
      return;
    }
    
    if (context) {
      console.log('[useMusicContext] Triggering music change to:', context);
      lastContext.current = context;
      
      // Get fresh references from store on each call
      const { changeMusicContext, musicEnabled } = useGameStore.getState();
      
      if (musicEnabled) {
        changeMusicContext(context);
      }
    }
  }, [context])
}
