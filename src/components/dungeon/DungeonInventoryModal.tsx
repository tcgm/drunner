import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  SimpleGrid,
  HStack,
} from '@chakra-ui/react'
import type { Item } from '@/types'
import { ItemSlot } from '@/components/ui/ItemSlot'

interface DungeonInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  inventory: Item[]
  gold: number
}

export default function DungeonInventoryModal({ isOpen, onClose, inventory, gold }: DungeonInventoryModalProps) {
  return (
    <Modal scrollBehavior={"inside"} isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader color="orange.400">
          <HStack justify="space-between">
            <Text>Dungeon Inventory</Text>
            <Text color="yellow.400" fontSize="md">{gold} Gold</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {inventory.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No items found yet. Explore treasure events to find loot!
            </Text>
          ) : (
            <>
              <Text fontSize="sm" color="gray.400" mb={4}>
                Items found during this run ({inventory.length} items):
              </Text>
              <SimpleGrid columns={6} spacing={3} justifyItems="center">
                {inventory.map((item, index) => (
                  <ItemSlot
                    key={`${item.id}-${index}`}
                    item={item}
                    size="md"
                  />
                ))}
              </SimpleGrid>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}