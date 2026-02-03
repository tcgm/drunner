import { MusicContext } from '@/types/audio';
import type { MusicTrack, MusicPlaylist } from '@/types/audio';

class AudioManager {
  private currentAudio: HTMLAudioElement | null = null;
  private nextAudio: HTMLAudioElement | null = null;
  private currentPlaylist: MusicPlaylist | null = null;
  private lastPlaylist: MusicPlaylist | null = null; // Store last playlist for resume after mute
  private currentTrackIndex: number = 0;
  private masterVolume: number = 0.7;
  private musicEnabled: boolean = true;
  private isFading: boolean = false;
  private fadeInterval: number | null = null;
  private shuffleHistory: number[] = [];
  private pendingContext: MusicPlaylist | null = null; // Store context until user interaction

  constructor() {
    // Load preferences from localStorage
    const savedVolume = localStorage.getItem('musicVolume');
    const savedMusicEnabled = localStorage.getItem('musicEnabled');
    
    if (savedVolume) this.masterVolume = parseFloat(savedVolume);
    if (savedMusicEnabled) this.musicEnabled = savedMusicEnabled === 'true';

    // Listen for first user interaction to enable audio
    this.setupAutoplayUnlock();
  }

  /**
   * Setup listener for first user interaction to unlock audio
   */
  private setupAutoplayUnlock(): void {
    const unlockAudio = () => {
      console.log('[Audio] User interaction detected, unlocking audio');
      
      // If we have a pending context, play it now
      if (this.pendingContext) {
        console.log('[Audio] Playing pending music context:', this.pendingContext.context);
        const pending = this.pendingContext;
        this.pendingContext = null;
        this.changeContext(pending);
      }
      
      // Remove listeners after first interaction
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
  }

  /**
   * Set the master music volume
   */
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('musicVolume', this.masterVolume.toString());
    
    if (this.currentAudio) {
      const trackVolume = this.getCurrentTrack()?.volume ?? 1;
      this.currentAudio.volume = this.masterVolume * trackVolume;
    }
  }

  /**
   * Get the current master volume
   */
  getVolume(): number {
    return this.masterVolume;
  }

  /**
   * Enable or disable music
   */
  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    localStorage.setItem('musicEnabled', enabled.toString());
    
    if (!enabled && this.currentAudio) {
      this.stop();
    } else if (enabled && this.lastPlaylist) {
      // Resume the last playlist when re-enabled
      console.log('[Audio] Music re-enabled, resuming playlist:', this.lastPlaylist.context);
      this.changeContext(this.lastPlaylist);
    }
  }

  /**
   * Check if music is enabled
   */
  isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  /**
   * Change music context with crossfade
   */
  async changeContext(playlist: MusicPlaylist): Promise<void> {
    if (!this.musicEnabled) {
      console.log('[Audio] Music disabled, skipping context change');
      return;
    }

    console.log('[Audio] Changing context to:', playlist.context);

    // If same context and already playing, do nothing
    if (this.currentPlaylist?.context === playlist.context && this.currentAudio && !this.currentAudio.paused) {
      console.log('[Audio] Already playing this context');
      return;
    }

    // Cancel any pending fades
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
      this.isFading = false;
    }

    // Clean up nextAudio if it exists (prevents duplicate audio)
    if (this.nextAudio) {
      this.nextAudio.pause();
      this.nextAudio.src = '';
      this.nextAudio = null;
    }

    this.currentPlaylist = playlist;
    this.currentTrackIndex = 0;
    this.shuffleHistory = [];

    if (playlist.shuffle) {
      this.currentTrackIndex = this.getRandomTrackIndex();
    }

    const fadeDuration = playlist.crossfadeDuration ?? 1000;
    
    try {
      await this.playTrackWithFade(this.currentTrackIndex, fadeDuration);
      console.log('[Audio] Successfully started playing:', playlist.tracks[this.currentTrackIndex].name);
    } catch (error) {
      // If autoplay is blocked, store the context to play after user interaction
      if (error instanceof Error && error.name === 'NotAllowedError') {
        console.warn('[Audio] Autoplay blocked by browser, waiting for user interaction');
        this.pendingContext = playlist;
      } else {
        console.error('[Audio] Failed to change context:', error);
      }
    }
  }

  /**
   * Play a specific track with crossfade
   */
  private async playTrackWithFade(trackIndex: number, fadeDuration: number): Promise<void> {
    if (!this.currentPlaylist || trackIndex >= this.currentPlaylist.tracks.length) {
      return;
    }

    // Prevent concurrent playback attempts
    if (this.isFading) {
      console.log('[Audio] Already fading, skipping play request');
      return;
    }

    const track = this.currentPlaylist.tracks[trackIndex];
    
    // Clean up any existing nextAudio to prevent duplicates
    if (this.nextAudio) {
      this.nextAudio.pause();
      this.nextAudio.src = '';
      this.nextAudio = null;
    }
    
    // Create new audio element
    this.nextAudio = new Audio(track.path);
    this.nextAudio.volume = 0;
    this.nextAudio.loop = track.loop ?? true;
    
    // Set up error handling
    this.nextAudio.onerror = (e) => {
      console.error(`Failed to load music track: ${track.name}`, e);
    };

    // Set up end event for non-looping tracks
    if (!this.nextAudio.loop) {
      this.nextAudio.onended = () => {
        this.playNextTrack();
      };
    }

    try {
      await this.nextAudio.play();
      console.log('[Audio] Playing track:', track.name);
      
      // Crossfade if there's a current track
      if (this.currentAudio && !this.currentAudio.paused) {
        await this.crossfade(fadeDuration);
      } else {
        // Fade in the new track
        await this.fadeIn(this.nextAudio, fadeDuration, track.volume ?? 1);
        this.currentAudio = this.nextAudio;
        this.nextAudio = null;
      }
    } catch (error) {
      console.error(`Failed to play music track: ${track.name}`, error);
      // Re-throw to let caller handle autoplay blocking
      throw error;
    }
  }

  /**
   * Crossfade between current and next audio
   */
  private async crossfade(duration: number): Promise<void> {
    if (!this.currentAudio || !this.nextAudio || this.isFading) return;

    this.isFading = true;
    const steps = 50;
    const stepDuration = duration / steps;
    const currentTrack = this.getCurrentTrack();
    const nextTrack = this.getTrack(this.currentTrackIndex);
    
    const currentStartVolume = this.currentAudio.volume;
    const nextTargetVolume = this.masterVolume * (nextTrack?.volume ?? 1);

    return new Promise((resolve) => {
      let step = 0;
      
      this.fadeInterval = setInterval(() => {
        step++;
        const progress = step / steps;
        
        if (this.currentAudio) {
          this.currentAudio.volume = currentStartVolume * (1 - progress);
        }
        
        if (this.nextAudio) {
          this.nextAudio.volume = nextTargetVolume * progress;
        }

        if (step >= steps) {
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          
          // Stop and clean up old audio
          if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.src = '';
          }
          
          this.currentAudio = this.nextAudio;
          this.nextAudio = null;
          this.isFading = false;
          
          resolve();
        }
      }, stepDuration);
    });
  }

  /**
   * Fade in an audio element
   */
  private async fadeIn(audio: HTMLAudioElement, duration: number, targetVolume: number): Promise<void> {
    const steps = 50;
    const stepDuration = duration / steps;
    const volumeTarget = this.masterVolume * targetVolume;

    return new Promise((resolve) => {
      let step = 0;
      
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        audio.volume = volumeTarget * progress;

        if (step >= steps) {
          clearInterval(interval);
          resolve();
        }
      }, stepDuration);
    });
  }

  /**
   * Stop music with fade out
   */
  async stop(fadeDuration: number = 1000): Promise<void> {
    if (!this.currentAudio || this.currentAudio.paused) return;

    const startVolume = this.currentAudio.volume;
    const steps = 50;
    const stepDuration = fadeDuration / steps;

    return new Promise((resolve) => {
      let step = 0;
      
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        
        if (this.currentAudio) {
          this.currentAudio.volume = startVolume * (1 - progress);
        }

        if (step >= steps) {
          clearInterval(interval);
          
          if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.src = '';
            this.currentAudio = null;
          }
          
          // Save current playlist for resume
          this.lastPlaylist = this.currentPlaylist;
          this.currentPlaylist = null;
          resolve();
        }
      }, stepDuration);
    });
  }

  /**
   * Play next track in playlist
   */
  private playNextTrack(): void {
    if (!this.currentPlaylist) return;

    if (this.currentPlaylist.shuffle) {
      this.currentTrackIndex = this.getRandomTrackIndex();
    } else {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.currentPlaylist.tracks.length;
    }

    const fadeDuration = this.currentPlaylist.crossfadeDuration ?? 1000;
    this.playTrackWithFade(this.currentTrackIndex, fadeDuration);
  }

  /**
   * Get a random track index (avoiding recent plays)
   */
  private getRandomTrackIndex(): number {
    if (!this.currentPlaylist) return 0;

    const trackCount = this.currentPlaylist.tracks.length;
    
    // If only one track, return 0
    if (trackCount === 1) return 0;

    // Keep history of last played tracks (up to half of playlist)
    const historySize = Math.min(Math.floor(trackCount / 2), 5);
    
    let attempts = 0;
    let index: number;
    
    do {
      index = Math.floor(Math.random() * trackCount);
      attempts++;
    } while (this.shuffleHistory.includes(index) && attempts < 20);

    // Add to history
    this.shuffleHistory.push(index);
    if (this.shuffleHistory.length > historySize) {
      this.shuffleHistory.shift();
    }

    return index;
  }

  /**
   * Get current track
   */
  private getCurrentTrack(): MusicTrack | null {
    if (!this.currentPlaylist) return null;
    return this.currentPlaylist.tracks[this.currentTrackIndex] || null;
  }

  /**
   * Get track by index
   */
  private getTrack(index: number): MusicTrack | null {
    if (!this.currentPlaylist) return null;
    return this.currentPlaylist.tracks[index] || null;
  }

  /**
   * Get current context
   */
  getCurrentContext(): MusicContext | null {
    return this.currentPlaylist?.context || null;
  }

  /**
   * Check if music is playing
   */
  isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    console.log('[Audio] Disposing audio manager');
    
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = '';
      this.currentAudio = null;
    }
    
    if (this.nextAudio) {
      this.nextAudio.pause();
      this.nextAudio.src = '';
      this.nextAudio = null;
    }

    this.currentPlaylist = null;
    this.pendingContext = null;
    this.isFading = false;
  }
}

// Singleton instance with HMR cleanup
let audioManagerInstance: AudioManager | null = null;

function getAudioManager(): AudioManager {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager();
  }
  return audioManagerInstance;
}

export const audioManager = getAudioManager();

// HMR cleanup for development
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    console.log('[Audio] HMR: Disposing old audio manager');
    if (audioManagerInstance) {
      audioManagerInstance.dispose();
      audioManagerInstance = null;
    }
  });
}
