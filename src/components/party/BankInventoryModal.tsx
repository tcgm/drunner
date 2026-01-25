import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, SimpleGrid, Box, VStack, HStack, Text, Badge } from '@chakra-ui/react'
import type { Item, EquipmentSlot } from '../../types'

interface BankInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  bankInventory: Item[]
  pendingSlot: EquipmentSlot | null
  onEquipItem: (itemId: string) => void
}

export function BankInventoryModal({ isOpen, onClose, bankInventory, pendingSlot, onEquipItem }: BankInventoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader color="orange.400">
          Bank Inventory {pendingSlot && `- Select item for ${pendingSlot}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {bankInventory.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No items in bank
            </Text>
          ) : (
            <SimpleGrid columns={2} spacing={2}>
              {bankInventory
                .filter(item => !pendingSlot || item.slot === pendingSlot)
                .map((item) => (
                  <Box
                    key={item.id}
                    p={2}
                    bg="gray.700"
                    borderRadius="md"
                    borderWidth="2px"
                    borderColor={`${item.rarity}.500`}
                    cursor={pendingSlot ? 'pointer' : 'default'}
                    _hover={pendingSlot ? { bg: 'gray.600' } : {}}
                    onClick={() => pendingSlot && onEquipItem(item.id)}
                  >
                    <VStack align="start" spacing={1}>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" fontWeight="bold" color={`${item.rarity}.300`}>
                          {item.name}
                        </Text>
                        <Badge colorScheme={item.rarity} fontSize="2xs">
                          {item.slot}
                        </Badge>
                      </HStack>
                      <Text fontSize="2xs" color="gray.400">
                        {item.description}
                      </Text>
                      {Object.keys(item.stats).length > 0 && (
                        <SimpleGrid columns={2} spacing={1} w="full" fontSize="2xs" color="gray.400">
                          {Object.entries(item.stats).map(([stat, value]) => (
                            <Text key={stat}>
                              {stat}: +{value}
                            </Text>
                          ))}
                        </SimpleGrid>
                      )}
                    </VStack>
                  </Box>
                ))}
            </SimpleGrid>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
