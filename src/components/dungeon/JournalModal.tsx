import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Box,
  Divider,
  Badge,
  Flex,
} from '@chakra-ui/react'
import { useGameStore } from '@/store/gameStore'
import { ALL_EVENTS } from '@/data/events'

interface JournalModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function JournalModal({ isOpen, onClose }: JournalModalProps) {
  const eventHistory = useGameStore((state) => state.dungeon.eventHistory)

  // Get full event details for each event ID in history
  const eventEntries = eventHistory
    .map((eventId) => ALL_EVENTS.find((e) => e.id === eventId))
    .filter((event) => event !== undefined)
    .reverse() // Most recent first

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
      <ModalContent 
        className="journal-modal"
        bg="gray.900" 
        color="gray.200"
        border="3px solid"
        borderColor="yellow.900"
        boxShadow="0 0 30px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.5)"
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          pointerEvents: 'none',
          borderRadius: 'md',
        }}
      >
        <ModalHeader 
          borderBottom="2px solid" 
          borderColor="yellow.900"
          textAlign="center"
          py={6}
        >
          <Text 
            fontSize="3xl" 
            fontFamily="serif"
            fontWeight="bold"
            color="yellow.600"
            textShadow="0 2px 4px rgba(0,0,0,0.5)"
            letterSpacing="wide"
          >
            ⚔ Journey Journal ⚔
          </Text>
          <Text 
            fontSize="sm" 
            color="gray.500" 
            fontWeight="normal"
            fontFamily="serif"
            fontStyle="italic"
            mt={2}
          >
            {eventEntries.length} {eventEntries.length === 1 ? 'entry' : 'entries'} recorded
          </Text>
        </ModalHeader>
        <ModalCloseButton color="yellow.600" />
        <ModalBody 
          pb={6}
          px={8}
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.3)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(180,140,80,0.5)',
              borderRadius: '4px',
            },
          }}
        >
          {eventEntries.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Text 
                color="gray.600" 
                fontFamily="serif"
                fontSize="lg"
                fontStyle="italic"
              >
                The pages are yet blank...
              </Text>
              <Text color="gray.700" fontFamily="serif" fontSize="sm" mt={2}>
                Your adventures will be chronicled here as you delve deeper.
              </Text>
            </Box>
          ) : (
            <VStack spacing={6} align="stretch" py={4}>
              {eventEntries.map((event, index) => (
                <Box key={`${event.id}-${index}`}>
                  <Box
                    position="relative"
                    bg="rgba(0,0,0,0.3)"
                    p={5}
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderColor={
                      event.type === 'combat' ? 'red.700' :
                      event.type === 'treasure' ? 'yellow.700' :
                      event.type === 'rest' ? 'green.700' :
                      'blue.700'
                    }
                    boxShadow="inset 0 1px 3px rgba(0,0,0,0.5)"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      fontSize: '80px',
                      opacity: 0.05,
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                  >
                    <Flex justify="space-between" align="start" mb={3}>
                      <Badge
                        colorScheme={
                          event.type === 'combat' ? 'red' :
                          event.type === 'treasure' ? 'yellow' :
                          event.type === 'rest' ? 'green' :
                          'blue'
                        }
                        fontSize="xs"
                        px={3}
                        py={1}
                        borderRadius="full"
                        textTransform="uppercase"
                        fontFamily="serif"
                        letterSpacing="wider"
                      >
                        {event.type}
                      </Badge>
                      <Text 
                        fontSize="xs" 
                        color="gray.600"
                        fontFamily="serif"
                        fontStyle="italic"
                      >
                        Floor {eventEntries.length - index}
                      </Text>
                    </Flex>
                    
                    <Text 
                      fontWeight="bold" 
                      fontSize="xl"
                      color="yellow.500"
                      mb={3}
                      fontFamily="serif"
                    >
                      {event.title}
                    </Text>
                    
                    <Text 
                      color="gray.400" 
                      fontSize="md"
                      lineHeight="tall"
                      fontFamily="serif"
                      fontStyle="italic"
                    >
                      "{event.description}"
                    </Text>
                  </Box>
                  
                  {index < eventEntries.length - 1 && (
                    <Divider 
                      borderColor="yellow.900" 
                      opacity={0.3}
                      my={2}
                    />
                  )}
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
