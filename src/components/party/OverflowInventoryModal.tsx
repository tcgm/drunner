import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, VStack, HStack, Box, Text, Button, SimpleGrid, Badge, Flex } from '@chakra-ui/react'
import type { Item } from '../../types'

interface OverflowInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  overflowInventory: Item[]
  bankInventory: Item[]
  bankStorageSlots: number
  bankGold: number
  onExpandBank: (slots: number) => void
  onKeepItem: (itemId: string) => void
  onDiscardItem: (itemId: string) => void
  onClearAll: () => void
}

const COST_PER_SLOT = 50

export function OverflowInventoryModal({
  isOpen,
  onClose,
  overflowInventory,
  bankInventory,
  bankStorageSlots,
  bankGold,
  onExpandBank,
  onKeepItem,
  onDiscardItem,
  onClearAll
}: OverflowInventoryModalProps) {
  const bankInventoryCount = bankInventory.length
  const availableSlots = bankStorageSlots - bankInventoryCount

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent className="overflow-inventory-modal" bg="gray.800">
        <ModalHeader color="orange.400">
          Items from Last Run
        </ModalHeader>
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Box bg="gray.900" p={3} borderRadius="md">
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.300">
                  Bank Storage: {bankInventoryCount}/{bankStorageSlots} slots used
                </Text>
                <Text fontSize="sm" color={availableSlots > 0 ? 'green.400' : 'red.400'}>
                  {availableSlots} slots available
                </Text>
              </HStack>
              {availableSlots === 0 && (
                <HStack spacing={2} mt={2}>
                  <Text fontSize="sm" color="yellow.400">
                    Bank is full! Buy more slots:
                  </Text>
                  <Button 
                    size="xs" 
                    colorScheme="green"
                    onClick={() => onExpandBank(5)}
                    isDisabled={bankGold < COST_PER_SLOT * 5}
                  >
                    +5 ({COST_PER_SLOT * 5}g)
                  </Button>
                  <Button 
                    size="xs" 
                    colorScheme="green"
                    onClick={() => onExpandBank(10)}
                    isDisabled={bankGold < COST_PER_SLOT * 10}
                  >
                    +10 ({COST_PER_SLOT * 10}g)
                  </Button>
                </HStack>
              )}
            </Box>
            
            <Text fontSize="sm" color="gray.400">
              Items from your run ({overflowInventory.length}):
            </Text>
            
            {overflowInventory.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={4}>
                No overflow items
              </Text>
            ) : (
              <SimpleGrid columns={1} spacing={2} maxH="400px" overflowY="auto">
                {overflowInventory.map((item) => (
                  <Box
                    key={item.id}
                    p={3}
                    bg="gray.700"
                    borderRadius="md"
                    borderWidth="2px"
                    borderColor={`${item.rarity}.500`}
                  >
                    <Flex justify="space-between" align="start">
                      <VStack align="start" spacing={1} flex={1}>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" fontWeight="bold" color={`${item.rarity}.300`}>
                            {item.name}
                          </Text>
                          <Badge colorScheme={item.rarity} fontSize="2xs">
                            {item.type}
                          </Badge>
                        </HStack>
                        <Text fontSize="2xs" color="gray.400">
                          {item.description}
                        </Text>
                        {Object.keys(item.stats).length > 0 && (
                          <SimpleGrid columns={3} spacing={1} w="full" fontSize="2xs" color="gray.400">
                            {Object.entries(item.stats).map(([stat, value]) => (
                              <Text key={stat}>
                                {stat}: +{value}
                              </Text>
                            ))}
                          </SimpleGrid>
                        )}
                      </VStack>
                      <VStack spacing={1} ml={2}>
                        <Button
                          size="xs"
                          colorScheme="green"
                          onClick={() => onKeepItem(item.id)}
                          isDisabled={availableSlots === 0}
                        >
                          Keep
                        </Button>
                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => onDiscardItem(item.id)}
                        >
                          Discard
                        </Button>
                      </VStack>
                    </Flex>
                  </Box>
                ))}
              </SimpleGrid>
            )}
            
            <HStack justify="space-between" mt={4}>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={() => {
                  onClearAll()
                  onClose()
                }}
              >
                Discard All
              </Button>
              <Button
                size="sm"
                colorScheme="orange"
                onClick={onClose}
              >
                Done
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
