import { useEffect, useRef, useMemo } from 'react'
import { useGameStore } from '@/core/gameStore'
import { MusicContext } from '@/types/audio'

/**
 * Centralized music manager that handles all music context changes
 * based on app and game state. This runs at the App level and screens
 * don't need to manage music themselves.
 */
export function MusicManager({ currentScreen }: { currentScreen: string }) {
  const { dungeon, changeMusicContext, musicEnabled } = useGameStore()
  const lastContextRef = useRef<MusicContext | null>(null)

  // Compute a stable music key that only changes when the music context should change
  // This prevents re-runs on every combat action or state update
  const musicKey = useMemo(() => {
    if (currentScreen !== 'dungeon') return currentScreen
    
    const event = dungeon.currentEvent
    if (!event) return 'dungeon-normal'
    
    // Create a stable key based on event properties that affect music
    if (event.type === 'boss') {
      if (event.isFinalBoss) return 'final-boss'
      if (event.isZoneBoss) return 'zone-boss'
      if (dungeon.bossType === 'floor') return 'floor-boss'
      return 'dungeon-boss'
    }
    
    return `dungeon-${event.type}` // rest, merchant, combat, etc.
  }, [currentScreen, dungeon.currentEvent?.type, dungeon.currentEvent?.isFinalBoss, dungeon.currentEvent?.isZoneBoss, dungeon.bossType])

  useEffect(() => {
    if (!musicEnabled) return

    let newContext: MusicContext | null = null

    // Determine music context based on current screen and game state
    switch (currentScreen) {
      case 'menu':
      case 'run-history':
        newContext = MusicContext.MAIN_MENU
        break

      case 'party-setup':
        newContext = MusicContext.PARTY_SCREEN
        break

      case 'dungeon':
        // Use music key to determine the appropriate context
        if (musicKey === 'final-boss') {
          newContext = MusicContext.FINAL_BOSS
        } else if (musicKey === 'zone-boss') {
          newContext = MusicContext.ZONE_BOSS
        } else if (musicKey === 'floor-boss') {
          newContext = MusicContext.FLOOR_BOSS
        } else if (musicKey === 'dungeon-boss') {
          newContext = MusicContext.DUNGEON_BOSS
        } else if (musicKey === 'dungeon-rest') {
          newContext = MusicContext.REST
        } else if (musicKey === 'dungeon-merchant') {
          newContext = MusicContext.SHOP
        } else {
          // Default to normal dungeon music for exploration and combat
          newContext = MusicContext.DUNGEON_NORMAL
        }
        break
    }

    // Only change context if it's different from last time
    if (newContext && newContext !== lastContextRef.current) {
      console.log('[MusicManager] Changing context to:', newContext)
      lastContextRef.current = newContext
      changeMusicContext(newContext)
    }
  }, [musicKey, changeMusicContext, musicEnabled, currentScreen, dungeon.currentEvent, dungeon.bossType])

  return null // This component doesn't render anything
}
