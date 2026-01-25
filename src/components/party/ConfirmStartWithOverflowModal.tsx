import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, VStack, HStack, Box, Text, Button, Badge } from '@chakra-ui/react'
import type { Item } from '../../types'

interface ConfirmStartWithOverflowModalProps {
  isOpen: boolean
  onClose: () => void
  overflowInventory: Item[]
  onConfirm: () => void
}

export function ConfirmStartWithOverflowModal({ isOpen, onClose, overflowInventory, onConfirm }: ConfirmStartWithOverflowModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader color="red.400">
          Warning: Unresolved Items
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.300">
              You have {overflowInventory.length} item{overflowInventory.length > 1 ? 's' : ''} from your last run that haven't been stored. 
              Starting a new run will <Text as="span" fontWeight="bold" color="red.400">permanently lose</Text> these items:
            </Text>
            
            <Box bg="gray.900" p={3} borderRadius="md" maxH="300px" overflowY="auto">
              <VStack spacing={2} align="stretch">
                {overflowInventory.map((item) => (
                  <HStack key={item.id} spacing={2}>
                    <Badge colorScheme={item.rarity} fontSize="xs">
                      {item.rarity}
                    </Badge>
                    <Text fontSize="sm" color={`${item.rarity}.300`} fontWeight="bold">
                      {item.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      ({item.slot})
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
            
            <Text fontSize="xs" color="yellow.400" textAlign="center">
              Are you sure you want to discard these items?
            </Text>
            
            <HStack spacing={2}>
              <Button
                flex={1}
                colorScheme="gray"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                colorScheme="red"
                onClick={onConfirm}
              >
                Discard & Start Run
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
