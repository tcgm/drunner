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
import { useState, useEffect } from 'react'
import type { Item } from '@/types'
import { ItemSlot } from '@/components/ui/ItemSlot'

interface DungeonInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  inventory: Item[]
  gold: number
}

export default function DungeonInventoryModal({ isOpen, onClose, inventory, gold }: DungeonInventoryModalProps) {
  const [visibleCount, setVisibleCount] = useState(50)
  const lastOpenState = useRef(isOpen)

  // Progressive loading effect
  useEffect(() => {
    // Reset when modal opens
    if (isOpen && !lastOpenState.current) {
      setVisibleCount(50)
      lastOpenState.current = true
    } else if (!isOpen && lastOpenState.current) {
      lastOpenState.current = false
    }
    
    if (isOpen && visibleCount < inventory.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 50, inventory.length))
      }, 16) // ~60fps
      return () => clearTimeout(timer)
    }
  }, [isOpen, visibleCount, inventory.length])

  const visibleInventory = inventory.slice(0, visibleCount)

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
            <>
              <Text fontSize="sm" color="gray.400" mb={4}>
                Items found during this run ({inventory.length} items):
              </Text>
              <SimpleGrid className="dungeon-inventory-grid" columns={6} spacing={3} justifyItems="center">
                {visibleInventory.map((item, index) => (
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