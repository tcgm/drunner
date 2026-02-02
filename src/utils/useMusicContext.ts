import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import { MusicContext } from '@/types/audio'

/**
 * Hook to automatically change music context
 * Usage: useMusicContext(MusicContext.PARTY_SCREEN)
 */
export function useMusicContext(context: MusicContext | null) {
  const changeMusicContext = useGameStore(state => state.changeMusicContext)
  const musicEnabled = useGameStore(state => state.musicEnabled)
  const lastContext = useRef<MusicContext | null>(null)

  useEffect(() => {
    console.log('[useMusicContext] Hook called with:', { context, musicEnabled });
    
    // Skip if same as last context (prevents duplicate calls from strict mode)
    if (context === lastContext.current) {
      console.log('[useMusicContext] Same context as last call, skipping');
      return;
    }
    
    if (context && musicEnabled) {
      console.log('[useMusicContext] Triggering music change to:', context);
      lastContext.current = context;
      changeMusicContext(context)
    } else {
      console.log('[useMusicContext] Skipping music change:', { hasContext: !!context, musicEnabled });
    }
  }, [context, changeMusicContext, musicEnabled])
}
