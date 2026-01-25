import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton, 
  ModalFooter,
  SimpleGrid, 
  Text, 
  Button, 
  HStack, 
  VStack,
  Checkbox,
  Badge,
  useToast
} from '@chakra-ui/react'
import { useState } from 'react'
import type { Item, ItemSlot as ItemSlotType } from '../../types'
import { ItemSlot } from '@/components/ui/ItemSlot'
import { useGameStore } from '@/store/gameStore'
import { GAME_CONFIG } from '@/config/game'

interface BankInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  bankInventory: Item[]
  pendingSlot: ItemSlotType | null
  onEquipItem: (itemId: string) => void
}

export function BankInventoryModal({ isOpen, onClose, bankInventory, pendingSlot, onEquipItem }: BankInventoryModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const { alkahest, discardItems } = useGameStore()
  const toast = useToast()

  const handleItemClick = (item: Item) => {
    if (isSelectionMode && !pendingSlot) {
      const newSelection = new Set(selectedItems)
      if (newSelection.has(item.id)) {
        newSelection.delete(item.id)
      } else {
        newSelection.add(item.id)
      }
      setSelectedItems(newSelection)
    } else if (pendingSlot) {
      onEquipItem(item.id)
    }
    // If not in selection mode and no pending slot, let ItemSlot handle the click (detail modal)
  }

  const handleSelectAll = () => {
    if (selectedItems.size === bankInventory.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(bankInventory.map(item => item.id)))
    }
  }

  const handleDiscardSelected = () => {
    const itemsToDiscard = bankInventory.filter(item => selectedItems.has(item.id))
    const totalValue = itemsToDiscard.reduce((sum, item) => sum + item.value, 0)
    const alkahestGained = Math.floor(totalValue * GAME_CONFIG.items.alkahestConversionRate)
    
    discardItems(Array.from(selectedItems))
    setSelectedItems(new Set())
    setIsSelectionMode(false)
    
    toast({
      title: "Items Discarded",
      description: `Gained ${alkahestGained} alkahest from ${itemsToDiscard.length} items`,
      status: "success",
      duration: 3000
    })
  }

  const handleClose = () => {
    setSelectedItems(new Set())
    setIsSelectionMode(false)
    onClose()
  }
  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader color="orange.400">
          <HStack justify="space-between">
            <Text>
              Bank Inventory {pendingSlot && `- Select item for ${pendingSlot}`}
            </Text>
            <HStack spacing={4}>
              <Badge colorScheme="yellow" fontSize="sm">
                {alkahest} Alkahest
              </Badge>
              {isSelectionMode && (
                <Badge colorScheme="blue" fontSize="sm">
                  {selectedItems.size} Selected
                </Badge>
              )}
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {bankInventory.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No items in bank
            </Text>
          ) : (
            <>
              {!pendingSlot && (
                <HStack mb={4} justify="space-between">
                  <HStack>
                    <Button 
                      size="sm"
                      colorScheme={isSelectionMode ? "red" : "blue"}
                      onClick={() => {
                        setIsSelectionMode(!isSelectionMode)
                        setSelectedItems(new Set())
                      }}
                    >
                      {isSelectionMode ? "Cancel" : "Select Items"}
                    </Button>
                    {isSelectionMode && (
                      <Button size="sm" variant="outline" onClick={handleSelectAll}>
                        {selectedItems.size === bankInventory.length ? "Deselect All" : "Select All"}
                      </Button>
                    )}
                  </HStack>
                  {isSelectionMode && selectedItems.size > 0 && (
                    <Button 
                      size="sm" 
                      colorScheme="red" 
                      variant="outline"
                      onClick={handleDiscardSelected}
                    >
                      Discard {selectedItems.size} Items
                    </Button>
                  )}
                </HStack>
              )}
              
              <SimpleGrid columns={6} spacing={3} justifyItems="center">
                {bankInventory
                  .filter(item => !pendingSlot || item.type === pendingSlot)
                  .map((item) => (
                    <VStack key={item.id} spacing={1}>
                      {isSelectionMode && !pendingSlot && (
                        <Checkbox 
                          isChecked={selectedItems.has(item.id)}
                          onChange={() => handleItemClick(item)}
                          size="sm"
                        />
                      )}
                      <ItemSlot
                        item={item}
                        size="md"
                        onClick={(isSelectionMode && !pendingSlot) || pendingSlot ? () => handleItemClick(item) : undefined}
                        isClickable={true}
                      />
                    </VStack>
                  ))}
              </SimpleGrid>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
