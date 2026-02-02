# Music System - Quick Start Guide

## What Was Added

A complete music system with crossfading, playlists, and context-aware music transitions.

## Files Created

1. **`src/types/audio.ts`** - Type definitions for music system
2. **`src/systems/audio/audioManager.ts`** - Core audio manager with crossfade support
3. **`src/config/musicConfig.ts`** - Playlist configuration
4. **`src/components/ui/MusicControls.tsx`** - Volume/mute UI component
5. **`src/utils/useMusicContext.ts`** - React hook for easy music changes
6. **`MUSIC_SYSTEM.md`** - Complete documentation

## Files Modified

1. **`src/types/index.ts`** - Added `musicVolume` and `musicEnabled` to GameState
2. **`src/store/gameStore.ts`** - Added music actions and audio manager integration
3. **`src/components/screens/MainMenuScreen.tsx`** - Added music context and controls
4. **`src/components/screens/PartySetupScreen.tsx`** - Added music context

## Next Steps

### 1. Add Your Music Files

Place your music files in `src/assets/audio/music/`:

```
src/assets/audio/music/
  ├── menu-theme.mp3
  ├── dungeon-1.mp3
  ├── dungeon-2.mp3
  ├── boss-battle.mp3
  ├── zone-boss.mp3
  ├── final-boss.mp3
  ├── victory.mp3
  └── defeat.mp3
```

### 2. Update Music Config

Edit `src/config/musicConfig.ts`:

```typescript
// Import your files
import menuTheme from '../../assets/audio/music/menu-theme.mp3';
import dungeon1 from '../../assets/audio/music/dungeon-1.mp3';
import dungeon2 from '../../assets/audio/music/dungeon-2.mp3';
// ... etc

// Update the playlists
export const musicPlaylists: Record<MusicContext, MusicPlaylist> = {
  [MusicContext.MAIN_MENU]: {
    context: MusicContext.MAIN_MENU,
    tracks: [{ name: 'Menu Theme', path: menuTheme, volume: 0.8 }],
    crossfadeDuration: 2000
  },
  
  [MusicContext.DUNGEON_NORMAL]: {
    context: MusicContext.DUNGEON_NORMAL,
    tracks: [
      { name: 'Dungeon 1', path: dungeon1, volume: 0.6 },
      { name: 'Dungeon 2', path: dungeon2, volume: 0.6 }
    ],
    shuffle: true,
    crossfadeDuration: 1500
  },
  // ... update other contexts
};
```

### 3. Add Music to DungeonScreen

The dungeon screen needs dynamic music based on event type. Update `src/components/screens/DungeonScreen.tsx`:

```typescript
import { useMusicContext } from '@/utils/useMusicContext';
import { MusicContext } from '@/types/audio';
import { useGameStore } from '@/store/gameStore';

export function DungeonScreen() {
  const currentEvent = useGameStore(state => state.dungeon.currentEvent);
  
  // Determine music context based on event
  let musicContext = MusicContext.DUNGEON_NORMAL;
  
  if (currentEvent?.type === 'boss') {
    if (currentEvent.isFinalBoss) {
      musicContext = MusicContext.FINAL_BOSS;
    } else if (currentEvent.isZoneBoss) {
      musicContext = MusicContext.ZONE_BOSS;
    } else {
      musicContext = MusicContext.DUNGEON_BOSS;
    }
  } else if (currentEvent?.type === 'merchant') {
    musicContext = MusicContext.SHOP;
  } else if (currentEvent?.type === 'rest') {
    musicContext = MusicContext.REST;
  }
  
  useMusicContext(musicContext);
  
  // ... rest of component
}
```

### 4. Add Victory/Defeat Music

When game ends, switch music:

```typescript
// In your victory/defeat handling code
import { useGameStore } from '@/store/gameStore';
import { MusicContext } from '@/types/audio';

const changeMusicContext = useGameStore(state => state.changeMusicContext);

// On victory
changeMusicContext(MusicContext.VICTORY);

// On defeat
changeMusicContext(MusicContext.DEFEAT);
```

### 5. Test It

1. Run the dev server: `npm run dev`
2. Check browser console for any audio loading errors
3. Adjust volumes in `musicConfig.ts` if needed
4. Test transitions between screens

## Current State

✅ **Working Now:**
- Main Menu has music + controls
- Party Setup Screen has music
- Music system fully functional
- Volume control with persistence
- Smooth crossfading between tracks

⏳ **To Do:**
- Add music to DungeonScreen (see step 3 above)
- Add more music tracks (currently using placeholders)
- Add victory/defeat music triggers
- Fine-tune crossfade durations per context

## Music Contexts Available

- `MAIN_MENU` - Main menu screen ✅ Integrated
- `PARTY_SCREEN` - Party setup ✅ Integrated
- `DUNGEON_NORMAL` - Normal exploration
- `DUNGEON_BOSS` - Regular boss fights
- `FLOOR_BOSS` - Every 5 floors
- `ZONE_BOSS` - Floors 10, 20, 30, etc.
- `FINAL_BOSS` - Floor 100
- `VICTORY` - Victory screen
- `DEFEAT` - Defeat screen
- `SHOP` - Merchant events
- `REST` - Rest events

## Troubleshooting

**Music not playing?**
- Check browser console for errors
- Verify file paths in imports
- Try clicking something first (browser autoplay policy)

**No sound?**
- Check the volume control in main menu
- Check system volume
- Verify `musicEnabled` is true

**Choppy transitions?**
- Increase `crossfadeDuration` in config
- Check file sizes (large files = slower loading)

## Full Documentation

See `MUSIC_SYSTEM.md` for complete documentation including:
- Advanced features
- Configuration options
- Technical details
- Integration examples
- Browser compatibility notes
