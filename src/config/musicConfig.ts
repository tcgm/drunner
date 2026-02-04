import { MusicContext } from '@/types/audio';
import type { MusicPlaylist } from '@/types/audio';

// Import music files using Vite's explicit URL import
// The ?url suffix tells Vite to return the file path as a string
import partyMusic1 from '@/assets/audio/music/lanternsUpB2.mp3?url';
import partyMusic2 from '@/assets/audio/music/lanternsUpB3.mp3?url';
import menuMusic from '@/assets/audio/music/entrance.mp3?url';
import exploreMusic1 from '@/assets/audio/music/explore2-1.mp3?url';
import exploreMusic2 from '@/assets/audio/music/explore2-2.mp3?url';
import exploreMusic3 from '@/assets/audio/music/explore2-3.mp3?url';
import exploreMusic4 from '@/assets/audio/music/explore2-4.mp3?url';

/**
 * Music playlists for different game contexts
 * 
 * To add new music:
 * 1. Add your .mp3 file to src/assets/audio/music/
 * 2. Import it at the top of this file
 * 3. Add it to the appropriate playlist below
 */
export const musicPlaylists: Record<MusicContext, MusicPlaylist> = {
  [MusicContext.MAIN_MENU]: {
    context: MusicContext.MAIN_MENU,
    tracks: [
      {
        name: 'Entrance',
        path: menuMusic,
        volume: 0.8,
        loop: true
      }
    ],
    shuffle: false,
    crossfadeDuration: 2000
  },

  [MusicContext.PARTY_SCREEN]: {
    context: MusicContext.PARTY_SCREEN,
    tracks: [
      {
        name: 'Lanterns Up B2',
        path: partyMusic1,
        volume: 0.7,
        loop: true
      },
      {
        name: 'Lanterns Up B3',
        path: partyMusic2,
        volume: 0.7,
        loop: true
      }
    ],
    shuffle: true,
    crossfadeDuration: 2000
  },

  [MusicContext.DUNGEON_NORMAL]: {
    context: MusicContext.DUNGEON_NORMAL,
    tracks: [
      {
        name: 'Dungeon Exploration 1',
        path: exploreMusic1,
        volume: 0.6,
        loop: true
      },
      {
        name: 'Dungeon Exploration 2',
        path: exploreMusic2,
        volume: 0.6,
        loop: true
      },
      {
        name: 'Dungeon Exploration 3',
        path: exploreMusic3,
        volume: 0.6,
        loop: true
      },
      {
        name: 'Dungeon Exploration 4',
        path: exploreMusic4,
        volume: 0.6,
        loop: true
      }
    ],
    shuffle: true,
    crossfadeDuration: 1500
  },

  [MusicContext.DUNGEON_BOSS]: {
    context: MusicContext.DUNGEON_BOSS,
    tracks: [
      {
        name: 'Boss Battle',
        path: partyMusic2, // Placeholder - add your boss music
        volume: 0.8,
        loop: true
      }
    ],
    shuffle: false,
    crossfadeDuration: 500 // Faster transition for combat
  },

  [MusicContext.FLOOR_BOSS]: {
    context: MusicContext.FLOOR_BOSS,
    tracks: [
      {
        name: 'Floor Boss',
        path: partyMusic2, // Placeholder - add your floor boss music
        volume: 0.85,
        loop: true
      }
    ],
    shuffle: false,
    crossfadeDuration: 500
  },

  [MusicContext.ZONE_BOSS]: {
    context: MusicContext.ZONE_BOSS,
    tracks: [
      {
        name: 'Zone Boss',
        path: partyMusic2, // Placeholder - add your zone boss music
        volume: 0.9,
        loop: true
      }
    ],
    shuffle: false,
    crossfadeDuration: 500
  },

  [MusicContext.FINAL_BOSS]: {
    context: MusicContext.FINAL_BOSS,
    tracks: [
      {
        name: 'Final Confrontation',
        path: partyMusic2, // Placeholder - add your final boss music
        volume: 0.95,
        loop: true
      }
    ],
    shuffle: false,
    crossfadeDuration: 1000
  },

  [MusicContext.VICTORY]: {
    context: MusicContext.VICTORY,
    tracks: [
      {
        name: 'Victory',
        path: partyMusic1, // Placeholder - add your victory music
        volume: 0.8,
        loop: false // Victory music plays once
      }
    ],
    shuffle: false,
    crossfadeDuration: 1000
  },

  [MusicContext.DEFEAT]: {
    context: MusicContext.DEFEAT,
    tracks: [
      {
        name: 'Defeat',
        path: partyMusic2, // Placeholder - add your defeat music
        volume: 0.7,
        loop: false // Defeat music plays once
      }
    ],
    shuffle: false,
    crossfadeDuration: 1500
  },

  [MusicContext.SHOP]: {
    context: MusicContext.SHOP,
    tracks: [
      {
        name: 'Merchant\'s Haven',
        path: partyMusic1, // Placeholder - add your shop music
        volume: 0.65,
        loop: true
      }
    ],
    shuffle: false,
    crossfadeDuration: 1500
  },

  [MusicContext.REST]: {
    context: MusicContext.REST,
    tracks: [
      {
        name: 'Peaceful Rest',
        path: partyMusic1, // Placeholder - add your rest music
        volume: 0.6,
        loop: true
      }
    ],
    shuffle: false,
    crossfadeDuration: 2000 // Slower transition for peaceful music
  }
};

/**
 * Helper function to get playlist for a context
 */
export function getPlaylistForContext(context: MusicContext): MusicPlaylist {
  return musicPlaylists[context];
}
