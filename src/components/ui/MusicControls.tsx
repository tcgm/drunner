import type { FC } from 'react'
import { useState, useRef, useEffect } from 'react'
import { useGameStore } from '@/core/gameStore'
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi'
import { audioManager } from '@/systems/audio/audioManager'

/**
 * Floating music control component - appears at bottom left of screen
 * Click to mute/unmute, long press or right click for volume slider
 */
export const MusicControls: FC = () => {
  const musicVolume = useGameStore(state => state.musicVolume)
  const musicEnabled = useGameStore(state => state.musicEnabled)
  const setMusicVolume = useGameStore(state => state.setMusicVolume)
  const setMusicEnabled = useGameStore(state => state.setMusicEnabled)
  
  const [showSlider, setShowSlider] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null)
  const [isLongPress, setIsLongPress] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Handle click outside to close slider
  useEffect(() => {
    if (!showSlider) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        sliderRef.current &&
        buttonRef.current &&
        !sliderRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowSlider(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSlider])

  const handleMouseDown = () => {
    setIsLongPress(false)
    const timer = window.setTimeout(() => {
      setShowSlider(true)
      setIsLongPress(true)
      setLongPressTimer(null)
    }, 500) // 500ms for long press
    setLongPressTimer(timer)
  }

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
      
      // Only toggle if it wasn't a long press and we're not already toggling
      if (!isLongPress && !isToggling) {
        handleToggleMute()
      }
    }
    setIsLongPress(false)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLongPress(true) // Mark as long press to prevent toggle on mouseup
    setShowSlider(true)
    
    // Clear any pending timer
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  const handleToggleMute = () => {
    // Prevent rapid toggling
    if (isToggling) return
    
    setIsToggling(true)
    const newEnabled = !musicEnabled
    setMusicEnabled(newEnabled)
    
    // Wait a bit before allowing another toggle
    setTimeout(() => {
      setIsToggling(false)
    }, 300)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value) / 100
    setMusicVolume(newVolume)
  }

  return (
    <>
      {/* Volume Button */}
      <button
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={(e) => {
        // Clear long press timer
          if (longPressTimer) {
            clearTimeout(longPressTimer)
            setLongPressTimer(null)
          }
          // Reset hover styles
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'
        }}
        onContextMenu={handleContextMenu}
        style={{
          position: 'fixed',
          bottom: 'clamp(10px, 2vh, 20px)',
          left: 'clamp(10px, 2vw, 20px)',
          width: 'clamp(40px, 4vw, 56px)',
          height: 'clamp(40px, 4vw, 56px)',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          color: musicEnabled ? '#fff' : '#888',
          fontSize: 'clamp(20px, 2vw, 28px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'all 0.2s',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'
        }}
        title={musicEnabled ? 'Click to mute | Long press for volume' : 'Click to unmute | Long press for volume'}
      >
        {musicEnabled ? <GiSpeaker /> : <GiSpeakerOff />}
      </button>

      {/* Vertical Volume Slider */}
      {showSlider && (
        <div
          ref={sliderRef}
          style={{
            position: 'fixed',
            bottom: 'clamp(50px, 8vh, 80px)',
            left: 'clamp(10px, 2vw, 20px)',
            width: 'clamp(40px, 4vw, 56px)',
            height: 'clamp(120px, 15vh, 180px)',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'clamp(20px, 2vw, 28px)',
            padding: '12px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 9999,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
            animation: 'slideUp 0.2s ease-out',
          }}
        >
          <style>
            {`
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>
          
          <span style={{
            fontSize: 'clamp(10px, 1vw, 14px)',
            color: '#fff',
            fontWeight: 'bold',
          }}>
            {Math.round(musicVolume * 100)}%
          </span>

          <input
            type="range"
            min="0"
            max="100"
            value={musicVolume * 100}
            onChange={handleVolumeChange}
            disabled={!musicEnabled}
            style={{
              width: 'clamp(100px, 12vw, 140px)',
              height: 'clamp(20px, 2vw, 28px)',
              cursor: musicEnabled ? 'pointer' : 'not-allowed',
              opacity: musicEnabled ? 1 : 0.5,
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
            }}
          />
        </div>
      )}
    </>
  )
}
