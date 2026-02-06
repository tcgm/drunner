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
  HStack,
  Icon,
  Flex,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GiSwordClash, 
  GiChest, 
  GiTwoCoins, 
  GiSwordWound, 
  GiHearts, 
  GiLevelEndFlag,
  GiSkullCrossedBones,
  GiDodge,
  GiGooExplosion
} from 'react-icons/gi'
import { useGameStore } from '@/core/gameStore'

const MotionBox = motion.create(Box)

interface CombatLogModalProps {
  isOpen: boolean
  onClose: () => void
}

const EVENT_TYPE_ICONS = {
  combat: GiSwordClash,
  treasure: GiChest,
  choice: GiLevelEndFlag,
  rest: GiHearts,
  merchant: GiTwoCoins,
  trap: GiSkullCrossedBones,
  boss: GiGooExplosion,
}

const EVENT_TYPE_COLORS = {
  combat: 'red.400',
  treasure: 'yellow.400',
  choice: 'blue.400',
  rest: 'green.400',
  merchant: 'orange.400',
  trap: 'purple.400',
  boss: 'red.500',
}

export default function CombatLogModal({ isOpen, onClose }: CombatLogModalProps) {
  const eventLog = useGameStore((state) => state.dungeon.eventLog)

  // Most recent first
  const entries = [...eventLog].reverse()

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
      <ModalContent 
        className="combat-log-modal"
        bg="gray.900" 
        color="gray.200"
        border="2px solid"
        borderColor="red.900"
        boxShadow="0 0 20px rgba(245, 101, 101, 0.3)"
      >
        <ModalHeader 
          borderBottom="2px solid" 
          borderColor="red.900"
          textAlign="center"
          py={4}
          bg="gray.800"
        >
          <HStack justify="center" spacing={3}>
            <Icon as={GiSwordClash} boxSize={8} color="red.400" />
            <Text 
              fontSize="2xl" 
              fontWeight="bold"
              color="red.400"
              textShadow="0 2px 4px rgba(0,0,0,0.5)"
            >
              Combat Log
            </Text>
            <Icon as={GiSwordClash} boxSize={8} color="red.400" />
          </HStack>
          <Text 
            fontSize="xs" 
            color="gray.500" 
            fontWeight="normal"
            mt={1}
          >
            {entries.length} {entries.length === 1 ? 'event' : 'events'} recorded
          </Text>
        </ModalHeader>
        <ModalCloseButton color="red.400" />
        <ModalBody 
          pb={4}
          px={4}
          maxH="70vh"
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.3)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(245, 101, 101, 0.4)',
              borderRadius: '4px',
            },
          }}
        >
          {entries.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Icon as={GiSwordClash} boxSize={16} color="gray.700" mb={4} />
              <Text color="gray.500" fontSize="lg">
                No events recorded yet
              </Text>
              <Text color="gray.600" fontSize="sm" mt={2}>
                Start exploring the dungeon to see combat logs!
              </Text>
            </Box>
          ) : (
            <VStack spacing={3} align="stretch" py={2}>
              <AnimatePresence>
                {entries.map((entry, index) => {
                  const IconComponent = EVENT_TYPE_ICONS[entry.eventType] || GiSwordClash
                  const iconColor = EVENT_TYPE_COLORS[entry.eventType] || 'gray.400'
                  
                  return (
                    <MotionBox
                      key={`${entry.eventId}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <Box
                        className="combat-log-entry"
                        bg="gray.800"
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="gray.700"
                        p={3}
                        _hover={{ borderColor: iconColor, bg: 'gray.750' }}
                        transition="all 0.2s"
                      >
                        <HStack align="start" spacing={3}>
                          <Icon 
                            as={IconComponent} 
                            boxSize={6} 
                            color={iconColor}
                            flexShrink={0}
                            mt={1}
                          />
                          <VStack align="start" spacing={1} flex={1}>
                            <HStack justify="space-between" w="full">
                              <Text 
                                fontSize="md" 
                                fontWeight="bold" 
                                color="gray.200"
                              >
                                {entry.eventTitle}
                              </Text>
                              <Badge 
                                colorScheme={entry.eventType === 'combat' || entry.eventType === 'boss' ? 'red' : 'blue'}
                                fontSize="xs"
                              >
                                Floor {entry.floor}
                              </Badge>
                            </HStack>
                            
                            <Text fontSize="sm" color="gray.400" fontStyle="italic">
                              {entry.choiceMade}
                            </Text>
                            
                            <Text fontSize="sm" color="gray.300" mt={1}>
                              {entry.outcomeText}
                            </Text>
                            
                            {/* Stats row */}
                            <Flex 
                              mt={2} 
                              gap={3} 
                              flexWrap="wrap" 
                              fontSize="xs"
                            >
                              {entry.damageTaken > 0 && (
                                <HStack spacing={1}>
                                  <Icon as={GiSwordWound} color="red.400" />
                                  <Text color="red.400">-{entry.damageTaken} HP</Text>
                                </HStack>
                              )}
                              {entry.healingReceived > 0 && (
                                <HStack spacing={1}>
                                  <Icon as={GiHearts} color="green.400" />
                                  <Text color="green.400">+{entry.healingReceived} HP</Text>
                                </HStack>
                              )}
                              {entry.xpGained > 0 && (
                                <HStack spacing={1}>
                                  <Icon as={GiLevelEndFlag} color="cyan.400" />
                                  <Text color="cyan.400">+{entry.xpGained} XP</Text>
                                </HStack>
                              )}
                              {entry.goldChange !== 0 && (
                                <HStack spacing={1}>
                                  <Icon as={GiTwoCoins} color="yellow.400" />
                                  <Text color={entry.goldChange > 0 ? 'yellow.400' : 'red.400'}>
                                    {entry.goldChange > 0 ? '+' : ''}{entry.goldChange} Gold
                                  </Text>
                                </HStack>
                              )}
                              {entry.itemsGained.length > 0 && (
                                <HStack spacing={1}>
                                  <Icon as={GiChest} color="purple.400" />
                                  <Text color="purple.400">
                                    {entry.itemsGained.length} {entry.itemsGained.length === 1 ? 'item' : 'items'}
                                  </Text>
                                </HStack>
                              )}
                            </Flex>
                            
                            {/* Item details if any */}
                            {entry.itemsGained.length > 0 && (
                              <Box mt={1} pl={2} borderLeftWidth="2px" borderColor="purple.900">
                                {entry.itemsGained.map((itemName, idx) => (
                                  <Text key={idx} fontSize="xs" color="purple.300">
                                    • {itemName}
                                  </Text>
                                ))}
                              </Box>
                            )}
                            
                            {/* Heroes affected */}
                            {entry.heroesAffected.length > 0 && (
                              <Text fontSize="xs" color="gray.500" mt={1}>
                                Affected: {entry.heroesAffected.join(', ')}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                      </Box>
                    </MotionBox>
                  )
                })}
              </AnimatePresence>
            </VStack>
          )}
          
          {entries.length > 10 && (
            <Box mt={4} textAlign="center">
              <Divider mb={2} />
              <Text fontSize="xs" color="gray.600">
                Showing all {entries.length} events
              </Text>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
