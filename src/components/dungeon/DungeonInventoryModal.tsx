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
  HStack,
  Box,
} from '@chakra-ui/react'
import type { Item } from '@/types'
import { ItemGrid } from '@/components/inventory/ItemGrid'
import { useLazyLoading } from '@/components/inventory/useLazyLoading'

interface DungeonInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  inventory: Item[]
  gold: number
}

export default function DungeonInventoryModal({ isOpen, onClose, inventory, gold }: DungeonInventoryModalProps) {
  const visibleCount = useLazyLoading({
    isOpen,
    totalItems: inventory.length,
    initialCount: 20,
    batchSize: 100,
    batchDelay: 32
  })

  return (
    <Modal scrollBehavior={"inside"} isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent className="dungeon-inventory-modal" bg="gray.800" color="white">
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
            <Box>
              <Text fontSize="sm" color="gray.400" mb={4}>
                Items found during this run ({inventory.length} items):
              </Text>
              <ItemGrid
                items={inventory}
                visibleCount={visibleCount}
                isClickable={true}
              />
            </Box>
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