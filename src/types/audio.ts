export const MusicContext = {
  MAIN_MENU: 'MAIN_MENU',
  PARTY_SCREEN: 'PARTY_SCREEN',
  DUNGEON_NORMAL: 'DUNGEON_NORMAL',
  DUNGEON_BOSS: 'DUNGEON_BOSS',
  FLOOR_BOSS: 'FLOOR_BOSS',
  ZONE_BOSS: 'ZONE_BOSS',
  FINAL_BOSS: 'FINAL_BOSS',
  VICTORY: 'VICTORY',
  DEFEAT: 'DEFEAT',
  SHOP: 'SHOP',
  REST: 'REST'
} as const

export type MusicContext = typeof MusicContext[keyof typeof MusicContext]

export interface MusicTrack {
  name: string;
  path: string;
  volume?: number; // 0-1, default 1
  loop?: boolean; // default true for background music
}

export interface MusicPlaylist {
  context: MusicContext;
  tracks: MusicTrack[];
  shuffle?: boolean; // default false
  crossfadeDuration?: number; // in ms, default 1000
}

export interface AudioState {
  currentContext: MusicContext | null;
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number; // master volume 0-1
  musicEnabled: boolean;
  sfxEnabled: boolean;
}
