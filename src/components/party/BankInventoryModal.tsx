import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, SimpleGrid, Box, VStack, HStack, Text, Badge } from '@chakra-ui/react'
import type { Item, ItemSlot } from '@/types'

interface BankInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  bankInventory: Item[]
  selectedSlotForEquip: { heroId: string; slot: ItemSlot } | null
  onEquipItem: (item: Item) => void
}

export function BankInventoryModal({ isOpen, onClose, bankInventory, selectedSlotForEquip, onEquipItem }: BankInventoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader color="orange.400">
          Bank Inventory {selectedSlotForEquip && `- Select item for ${selectedSlotForEquip.slot}`}
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
                .filter(item => !selectedSlotForEquip || item.type === selectedSlotForEquip.slot || 
                  (selectedSlotForEquip.slot.startsWith('accessory') && item.type.startsWith('accessory')))
                .map((item) => (
                  <Box
                    key={item.id}
                    p={2}
                    bg="gray.700"
                    borderRadius="md"
                    borderWidth="2px"
                    borderColor={`${item.rarity}.500`}
                    cursor={selectedSlotForEquip ? 'pointer' : 'default'}
                    _hover={selectedSlotForEquip ? { bg: 'gray.600' } : {}}
                    onClick={() => selectedSlotForEquip && onEquipItem(item)}
                  >
                    <VStack align="start" spacing={1}>
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
