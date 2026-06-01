import { useDisclosure, IconButton, Tooltip, Box } from '@chakra-ui/react'
import { useMultiplayerStore } from '@/multiplayer'
import { MultiplayerModal } from './MultiplayerModal'
import { GiCrossedSwords, GiSwordsEmblem } from 'react-icons/gi'

const SwordsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
    <path d="M6.5 2L2 6.5l2.5 2.5-4 4L2 15l4-4 2.5 2.5L13 9zm11 0l4.5 4.5-2.5 2.5 4 4L22 15l-4-4-2.5 2.5L11 9z" />
  </svg>
)

/**
 * Fixed multiplayer button shown on every screen, next to the music controls.
 * Shows a green dot when in a room.
 */
export function GlobalMultiplayerButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const role = useMultiplayerStore((s) => s.role)
  const players = useMultiplayerStore((s) => s.players)

  const inRoom = role !== null

  return (
    <>
      <Box
        position="fixed"
        bottom="clamp(10px, 2vh, 20px)"
        left="calc(clamp(10px, 2vw, 20px) + clamp(40px, 4vw, 56px) + 8px)"
        zIndex={9999}
      >
        <Tooltip
          label={inRoom ? `Multiplayer · ${players.length} player${players.length !== 1 ? 's' : ''}` : 'Multiplayer'}
          placement="top"
          hasArrow
        >
          <Box position="relative" display="inline-flex">
            <IconButton
              aria-label="Multiplayer"
              icon={<GiSwordsEmblem />}
              onClick={onOpen}
              isRound
              w="clamp(40px, 4vw, 56px)"
              h="clamp(40px, 4vw, 56px)"
              minW={0}
              fontSize="clamp(18px, 1.8vw, 24px)"
              bg={inRoom ? 'rgba(128, 0, 200, 0.75)' : 'rgba(0, 0, 0, 0.6)'}
              color={inRoom ? '#e0b8ff' : '#aaa'}
              backdropFilter="blur(10px)"
              boxShadow={inRoom ? '0 0 12px rgba(160, 32, 240, 0.6)' : '0 4px 12px rgba(0,0,0,0.3)'}
              border="none"
              transition="all 0.2s"
              _hover={{
                bg: inRoom ? 'rgba(128, 0, 200, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                transform: 'scale(1.1)',
              }}
              _active={{ transform: 'scale(0.95)' }}
            />
            {inRoom && (
              <Box
                position="absolute"
                top="4px"
                right="4px"
                w="10px"
                h="10px"
                borderRadius="full"
                bg="#48BB78"
                border="2px solid rgba(0,0,0,0.5)"
                pointerEvents="none"
              />
            )}
          </Box>
        </Tooltip>
      </Box>

      <MultiplayerModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
