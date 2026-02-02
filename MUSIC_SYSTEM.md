# Music System Documentation

The game now features a comprehensive music system with automatic crossfading between tracks and context-aware playlists.

## Features

- **Context-aware music**: Different music for different game states (menu, dungeon, bosses, victory, etc.)
- **Automatic crossfading**: Smooth transitions between tracks (configurable duration)
- **Playlist support**: Multiple tracks per context with shuffle support
- **Volume control**: Master volume with per-track volume adjustments
- **TypeScript imports**: Music files are imported directly in the config
- **Persistent settings**: Volume and enabled state saved to localStorage

## Quick Start

### 1. Add Music Files

Place your music files in `src/assets/audio/music/`:

```
src/assets/audio/music/
  ├── main-menu-theme.mp3
  ├── dungeon-explore-1.mp3
  ├── dungeon-explore-2.mp3
  ├── boss-battle.mp3
  └── victory.mp3
```

### 2. Configure Playlists

Edit `src/config/musicConfig.ts`:

```typescript
// Import your music files
import mainMenuTheme from '../../assets/audio/music/main-menu-theme.mp3';
import dungeonExplore1 from '../../assets/audio/music/dungeon-explore-1.mp3';
import dungeonExplore2 from '../../assets/audio/music/dungeon-explore-2.mp3';
import bossBattle from '../../assets/audio/music/boss-battle.mp3';

// Update the playlist config
export const musicPlaylists: Record<MusicContext, MusicPlaylist> = {
  [MusicContext.MAIN_MENU]: {
    context: MusicContext.MAIN_MENU,
    tracks: [
      {
        name: 'Main Menu Theme',
        path: mainMenuTheme,
        volume: 0.8,
        loop: true
      }
    ],
    crossfadeDuration: 2000
  },

  [MusicContext.DUNGEON_NORMAL]: {
    context: MusicContext.DUNGEON_NORMAL,
    tracks: [
      {
        name: 'Dungeon Exploration 1',
        path: dungeonExplore1,
        volume: 0.6,
        loop: true
      },
      {
        name: 'Dungeon Exploration 2',
        path: dungeonExplore2,
        volume: 0.6,
        loop: true
      }
    ],
    shuffle: true, // Randomize track order
    crossfadeDuration: 1500
  },
  // ... more contexts
};
```

### 3. Use in Components

Add music to your screens using the `useMusicContext` hook:

```typescript
import { useMusicContext } from '@/utils/useMusicContext';
import { MusicContext } from '@/types/audio';

export function PartySetupScreen() {
  // Automatically change music when this screen is displayed
  useMusicContext(MusicContext.PARTY_SCREEN);

  return (
    <div>
      {/* Your component content */}
    </div>
  );
}
```

### 4. Add Music Controls

Include the music control component in your UI:

```typescript
import { MusicControls } from '@/components/ui/MusicControls';

export function SettingsPanel() {
  return (
    <div>
      <h2>Settings</h2>
      <MusicControls />
    </div>
  );
}
```

## Available Music Contexts

```typescript
enum MusicContext {
  MAIN_MENU        // Main menu screen
  PARTY_SCREEN     // Party setup/management
  DUNGEON_NORMAL   // Normal dungeon exploration
  DUNGEON_BOSS     // Regular boss fights
  FLOOR_BOSS       // Floor 5, 15, 25, etc.
  ZONE_BOSS        // Floor 10, 20, 30, etc.
  FINAL_BOSS       // Floor 100 final boss
  VICTORY          // Victory screen
  DEFEAT           // Defeat screen
  SHOP             // Merchant events
  REST             // Rest/camp events
}
```

## Integration Examples

### Main Menu

```typescript
// src/components/screens/MainMenuScreen.tsx
import { useMusicContext } from '@/utils/useMusicContext';
import { MusicContext } from '@/types/audio';

export function MainMenuScreen() {
  useMusicContext(MusicContext.MAIN_MENU);
  
  return <div>Main Menu</div>;
}
```

### Party Setup

```typescript
// src/components/screens/PartySetupScreen.tsx
import { useMusicContext } from '@/utils/useMusicContext';
import { MusicContext } from '@/types/audio';

export function PartySetupScreen() {
  useMusicContext(MusicContext.PARTY_SCREEN);
  
  return <div>Party Setup</div>;
}
```

### Dungeon - Dynamic Context

```typescript
// src/components/screens/DungeonScreen.tsx
import { useMusicContext } from '@/utils/useMusicContext';
import { MusicContext } from '@/types/audio';
import { useGameStore } from '@/store/gameStore';

export function DungeonScreen() {
  const currentEvent = useGameStore(state => state.dungeon.currentEvent);
  const bossType = useGameStore(state => state.dungeon.bossType);
  
  // Determine music context based on game state
  let musicContext = MusicContext.DUNGEON_NORMAL;
  
  if (currentEvent?.type === 'boss') {
    if (currentEvent.isFinalBoss) {
      musicContext = MusicContext.FINAL_BOSS;
    } else if (currentEvent.isZoneBoss) {
      musicContext = MusicContext.ZONE_BOSS;
    } else if (bossType === 'floor') {
      musicContext = MusicContext.FLOOR_BOSS;
    } else {
      musicContext = MusicContext.DUNGEON_BOSS;
    }
  } else if (currentEvent?.type === 'merchant') {
    musicContext = MusicContext.SHOP;
  } else if (currentEvent?.type === 'rest') {
    musicContext = MusicContext.REST;
  }
  
  useMusicContext(musicContext);
  
  return <div>Dungeon</div>;
}
```

### Victory/Defeat

```typescript
export function GameOverScreen({ victory }: { victory: boolean }) {
  useMusicContext(victory ? MusicContext.VICTORY : MusicContext.DEFEAT);
  
  return <div>{victory ? 'Victory!' : 'Defeat...'}</div>;
}
```

## Advanced Features

### Manual Control

If you need direct control over music:

```typescript
import { useGameStore } from '@/store/gameStore';
import { MusicContext } from '@/types/audio';

function MyComponent() {
  const changeMusicContext = useGameStore(state => state.changeMusicContext);
  
  const handleSpecialEvent = () => {
    changeMusicContext(MusicContext.FINAL_BOSS);
  };
}
```

### Volume Control

```typescript
import { useGameStore } from '@/store/gameStore';

function VolumeSlider() {
  const musicVolume = useGameStore(state => state.musicVolume);
  const setMusicVolume = useGameStore(state => state.setMusicVolume);
  
  return (
    <input
      type="range"
      min="0"
      max="100"
      value={musicVolume * 100}
      onChange={(e) => setMusicVolume(parseInt(e.target.value) / 100)}
    />
  );
}
```

### Mute/Unmute

```typescript
import { useGameStore } from '@/store/gameStore';

function MuteButton() {
  const musicEnabled = useGameStore(state => state.musicEnabled);
  const setMusicEnabled = useGameStore(state => state.setMusicEnabled);
  
  return (
    <button onClick={() => setMusicEnabled(!musicEnabled)}>
      {musicEnabled ? 'Mute' : 'Unmute'}
    </button>
  );
}
```

## Configuration Options

### Track Options

```typescript
{
  name: string;           // Display name
  path: string;           // Import path
  volume?: number;        // Track volume (0-1), default 1
  loop?: boolean;         // Loop track, default true
}
```

### Playlist Options

```typescript
{
  context: MusicContext;
  tracks: MusicTrack[];
  shuffle?: boolean;              // Random order, default false
  crossfadeDuration?: number;     // Fade time in ms, default 1000
}
```

## Technical Details

### Crossfading

- **Default**: 1000ms (1 second)
- **Combat**: 500ms (faster for intensity)
- **Peaceful**: 2000ms (slower for ambiance)

### Volume Hierarchy

Final volume = Master Volume × Track Volume

- Master Volume: Set by user (0-1)
- Track Volume: Set in playlist config (0-1)

### Audio Manager

The `AudioManager` class handles:
- Audio element lifecycle
- Crossfade calculations (50 steps per fade)
- Random track selection with history
- localStorage persistence
- Error handling

### Browser Compatibility

Uses HTML5 Audio API:
- Modern browsers: Full support
- Safari: May require user interaction before playing
- Mobile: May require "play" button first

## Troubleshooting

### Music Not Playing

1. Check browser console for errors
2. Verify file paths in imports
3. Check musicEnabled state
4. Verify files exist in `src/assets/audio/music/`
5. Try user interaction (click/tap) first

### Choppy Transitions

- Increase `crossfadeDuration` in playlist config
- Check CPU usage (audio decoding)
- Verify file formats (MP3 recommended)

### Volume Issues

- Check master volume in settings
- Check per-track volume in config
- Verify audio files aren't pre-normalized too low

## Future Enhancements

Possible additions:
- Sound effects system
- Audio preloading
- Audio sprites for faster loading
- Web Audio API for advanced effects
- Adaptive music (intensity based on HP)
- Music unlocks/achievements
