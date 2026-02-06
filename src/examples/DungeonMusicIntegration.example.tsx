/**
 * Example: Dynamic Music in Dungeon Screen
 * 
 * This file shows how to add context-aware music to the dungeon screen
 * that changes based on the current event type.
 * 
 * Copy this code to src/components/screens/DungeonScreen.tsx
 */

import { useMemo } from 'react';
import { useMusicContext } from '@/utils/useMusicContext';
import { MusicContext } from '@/types/audio';
import { useGameStore } from '@/core/gameStore';

export function DungeonScreenMusicExample() {
  const currentEvent = useGameStore(state => state.dungeon.currentEvent);
  const bossType = useGameStore(state => state.dungeon.bossType);
  const isGameOver = useGameStore(state => state.isGameOver);
  
  // Determine music context based on game state
  const musicContext = useMemo(() => {
    // Game over states
    if (isGameOver) {
      // You'd determine victory/defeat elsewhere and set it
      return null; // Don't change music here, let game over screen handle it
    }
    
    // No event yet (loading/between events)
    if (!currentEvent) {
      return MusicContext.DUNGEON_NORMAL;
    }
    
    // Boss events
    if (currentEvent.type === 'boss') {
      // Final boss (Floor 100)
      if (currentEvent.isFinalBoss) {
        return MusicContext.FINAL_BOSS;
      }
      
      // Zone bosses (10, 20, 30, etc.)
      if (currentEvent.isZoneBoss) {
        return MusicContext.ZONE_BOSS;
      }
      
      // Floor bosses (5, 15, 25, etc.)
      if (bossType === 'floor') {
        return MusicContext.FLOOR_BOSS;
      }
      
      // Regular dungeon bosses
      return MusicContext.DUNGEON_BOSS;
    }
    
    // Special event types
    if (currentEvent.type === 'merchant') {
      return MusicContext.SHOP;
    }
    
    if (currentEvent.type === 'rest') {
      return MusicContext.REST;
    }
    
    // Default to normal dungeon music
    return MusicContext.DUNGEON_NORMAL;
  }, [currentEvent, bossType, isGameOver]);
  
  // Apply the music context
  useMusicContext(musicContext);
  
  // Rest of your component...
  return (
    <div>
      {/* Your dungeon screen UI */}
    </div>
  );
}

/**
 * Alternative: Manual control for specific events
 * 
 * If you need more control, you can manually trigger music changes:
 */
export function ManualMusicControlExample() {
  const changeMusicContext = useGameStore(state => state.changeMusicContext);
  
  const handleBossEncounter = () => {
    // When a boss is encountered, immediately switch music
    changeMusicContext(MusicContext.DUNGEON_BOSS);
  };
  
  const handleVictory = () => {
    // Play victory music (non-looping)
    changeMusicContext(MusicContext.VICTORY);
  };
  
  const handleDefeat = () => {
    // Play defeat music (non-looping)
    changeMusicContext(MusicContext.DEFEAT);
  };
  
  return null; // Example only
}

/**
 * Integration Pattern for Event Resolution
 * 
 * When resolving combat events, you might want to change music based on outcome:
 */
export function EventResolutionMusicExample() {
  const changeMusicContext = useGameStore(state => state.changeMusicContext);
  
  const resolveEvent = (outcome: 'victory' | 'defeat') => {
    if (outcome === 'victory') {
      // After combat victory, return to exploration music
      changeMusicContext(MusicContext.DUNGEON_NORMAL);
    } else {
      // On defeat, play defeat music
      changeMusicContext(MusicContext.DEFEAT);
    }
  };
  
  return null; // Example only
}

/**
 * Floor Progression Music
 * 
 * Change music intensity as player progresses:
 */
export function FloorProgressionMusicExample() {
  const floor = useGameStore(state => state.dungeon.floor);
  const changeMusicContext = useGameStore(state => state.changeMusicContext);
  
  // You could adjust music based on floor tiers
  // This would require adding more MusicContext types like:
  // DUNGEON_EARLY (1-33), DUNGEON_MID (34-66), DUNGEON_LATE (67-99)
  
  // For now, just show the pattern:
  const checkFloorMusic = () => {
    if (floor >= 90) {
      // Late game - more intense music
      // changeMusicContext(MusicContext.DUNGEON_LATE);
    } else if (floor >= 50) {
      // Mid game
      // changeMusicContext(MusicContext.DUNGEON_MID);
    } else {
      // Early game
      changeMusicContext(MusicContext.DUNGEON_NORMAL);
    }
  };
  
  return null; // Example only
}
