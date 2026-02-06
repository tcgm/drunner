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
  HStack,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react'
import { GiTwoCoins, GiSwordWound, GiHearts, GiChest, GiLevelEndFlag } from 'react-icons/gi'
import { useGameStore } from '@/core/gameStore'

interface JournalModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function JournalModal({ isOpen, onClose }: JournalModalProps) {
  const eventLog = useGameStore((state) => state.dungeon.eventLog)

  // Most recent first
  const entries = [...eventLog].reverse()

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
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
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} recorded
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
          {entries.length === 0 ? (
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
              {entries.map((entry, index) => (
                <Box key={`${entry.eventId}-${entries.length - index}`}>
                  <Box
                    position="relative"
                    bg="rgba(0,0,0,0.3)"
                    p={5}
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderColor={
                      entry.eventType === 'combat' || entry.eventType === 'boss' ? 'red.700' :
                      entry.eventType === 'treasure' ? 'yellow.700' :
                      entry.eventType === 'rest' ? 'green.700' :
                      entry.eventType === 'merchant' ? 'purple.700' :
                      entry.eventType === 'trap' ? 'orange.700' :
                      'blue.700'
                    }
                    boxShadow="inset 0 1px 3px rgba(0,0,0,0.5)"
                  >
                    <Flex justify="space-between" align="start" mb={3}>
                      <HStack spacing={2}>
                        <Badge
                          colorScheme={
                            entry.eventType === 'combat' || entry.eventType === 'boss' ? 'red' :
                            entry.eventType === 'treasure' ? 'yellow' :
                            entry.eventType === 'rest' ? 'green' :
                            entry.eventType === 'merchant' ? 'purple' :
                            entry.eventType === 'trap' ? 'orange' :
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
                          {entry.eventType}
                        </Badge>
                        {entry.eventType === 'boss' && (
                          <Badge colorScheme="red" fontSize="xs" px={2}>
                            BOSS
                          </Badge>
                        )}
                      </HStack>
                      <VStack align="end" spacing={0}>
                        <Text 
                          fontSize="xs" 
                          color="gray.600"
                          fontFamily="serif"
                          fontStyle="italic"
                        >
                          Floor {entry.floor} • Event {entry.depth}
                        </Text>
                      </VStack>
                    </Flex>
                    
                    <Text 
                      fontWeight="bold" 
                      fontSize="xl"
                      color="yellow.500"
                      mb={2}
                      fontFamily="serif"
                    >
                      {entry.eventTitle}
                    </Text>

                    <Box mb={3}>
                      <Text fontSize="xs" color="gray.500" mb={1}>Choice:</Text>
                      <Text 
                        color="cyan.300" 
                        fontSize="md"
                        fontFamily="serif"
                        fontStyle="italic"
                      >
                        "{entry.choiceMade}"
                      </Text>
                    </Box>
                    
                    <Box mb={3}>
                      <Text fontSize="xs" color="gray.500" mb={1}>Outcome:</Text>
                      <Text 
                        color="gray.400" 
                        fontSize="md"
                        lineHeight="tall"
                        fontFamily="serif"
                        fontStyle="italic"
                      >
                        "{entry.outcomeText}"
                      </Text>
                    </Box>

                    {/* Statistics Grid */}
                    <SimpleGrid columns={5} spacing={3} mt={4} pt={3} borderTop="1px solid" borderColor="gray.700">
                      {entry.goldChange !== 0 && (
                        <Box textAlign="center">
                          <Icon 
                            as={GiTwoCoins} 
                            boxSize={4} 
                            color={entry.goldChange > 0 ? 'yellow.400' : 'orange.400'} 
                            mb={1} 
                          />
                          <Text fontSize="xs" color="gray.500">Gold</Text>
                          <Text 
                            fontSize="sm" 
                            fontWeight="bold" 
                            color={entry.goldChange > 0 ? 'yellow.400' : 'orange.400'}
                          >
                            {entry.goldChange > 0 ? `+${entry.goldChange}` : entry.goldChange}
                          </Text>
                        </Box>
                      )}
                      {entry.damageTaken > 0 && (
                        <Box textAlign="center">
                          <Icon as={GiSwordWound} boxSize={4} color="red.400" mb={1} />
                          <Text fontSize="xs" color="gray.500">Damage</Text>
                          <Text fontSize="sm" fontWeight="bold" color="red.400">
                            {entry.damageTaken}
                          </Text>
                        </Box>
                      )}
                      {entry.healingReceived > 0 && (
                        <Box textAlign="center">
                          <Icon as={GiHearts} boxSize={4} color="green.400" mb={1} />
                          <Text fontSize="xs" color="gray.500">Healing</Text>
                          <Text fontSize="sm" fontWeight="bold" color="green.400">
                            +{entry.healingReceived}
                          </Text>
                        </Box>
                      )}
                      {entry.xpGained > 0 && (
                        <Box textAlign="center">
                          <Icon as={GiLevelEndFlag} boxSize={4} color="purple.400" mb={1} />
                          <Text fontSize="xs" color="gray.500">XP</Text>
                          <Text fontSize="sm" fontWeight="bold" color="purple.400">
                            +{entry.xpGained}
                          </Text>
                        </Box>
                      )}
                      {entry.itemsGained.length > 0 && (
                        <Box textAlign="center">
                          <Icon as={GiChest} boxSize={4} color="blue.400" mb={1} />
                          <Text fontSize="xs" color="gray.500">Items</Text>
                          <Text fontSize="sm" fontWeight="bold" color="blue.400">
                            {entry.itemsGained.length}
                          </Text>
                        </Box>
                      )}
                    </SimpleGrid>

                    {/* Items and Heroes Affected */}
                    {(entry.itemsGained.length > 0 || entry.heroesAffected.length > 0) && (
                      <Box mt={3} pt={3} borderTop="1px solid" borderColor="gray.700">
                        {entry.itemsGained.length > 0 && (
                          <Box mb={2}>
                            <Text fontSize="xs" color="gray.500" mb={1}>Items Gained:</Text>
                            <Flex gap={2} flexWrap="wrap">
                              {entry.itemsGained.map((itemName, idx) => (
                                <Badge key={idx} colorScheme="blue" fontSize="xs">
                                  {itemName}
                                </Badge>
                              ))}
                            </Flex>
                          </Box>
                        )}
                        {entry.heroesAffected.length > 0 && (
                          <Box>
                            <Text fontSize="xs" color="gray.500" mb={1}>Heroes Affected:</Text>
                            <Flex gap={2} flexWrap="wrap">
                              {entry.heroesAffected.map((heroName, idx) => (
                                <Badge key={idx} colorScheme="purple" fontSize="xs">
                                  {heroName}
                                </Badge>
                              ))}
                            </Flex>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                  
                  {index < entries.length - 1 && (
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
