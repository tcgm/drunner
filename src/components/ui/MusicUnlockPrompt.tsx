import { useState, useEffect } from 'react';
import { Box, Button, Icon } from '@chakra-ui/react';
import { GiMusicalNotes } from 'react-icons/gi';
import { audioManager } from '@/systems/audio/audioManager';

/**
 * Shows a prompt to enable music if autoplay is blocked
 */
export const MusicUnlockPrompt = () => {
  const [needsUnlock, setNeedsUnlock] = useState(false);

  useEffect(() => {
    // Check if there's pending music that needs user interaction
    const checkInterval = setInterval(() => {
      // This is a simple check - in practice, we'd need to expose this from audioManager
      if (!audioManager.isPlaying()) {
        const hasInteracted = localStorage.getItem('music-user-interacted');
        if (!hasInteracted) {
          setNeedsUnlock(true);
        }
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  const handleUnlock = () => {
    localStorage.setItem('music-user-interacted', 'true');
    setNeedsUnlock(false);
    // The audio manager's event listeners will handle starting music
    window.location.reload(); // Reload to reinitialize with interaction
  };

  if (!needsUnlock) return null;

  return (
    <Box
      position="fixed"
      bottom="clamp(10px, 2vh, 20px)"
      right="clamp(10px, 2vw, 20px)"
      zIndex={9999}
    >
      <Button
        colorScheme="orange"
        size="lg"
        leftIcon={<Icon as={GiMusicalNotes} />}
        onClick={handleUnlock}
        boxShadow="lg"
        animation="pulse 2s infinite"
      >
        Enable Music
      </Button>
    </Box>
  );
};
