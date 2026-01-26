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
  Badge,
  VStack,
  HStack,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react'
import type { Item } from '@/types'

const RARITY_COLORS = {
  junk: {
    border: '#4A5568',
    borderHover: '#2D3748',
    text: '#9CA3AF',
    textLight: '#D1D5DB',
    bg: '#4A5568'
  },
  common: {
    border: '#22C55E',
    borderHover: '#16A34A',
    text: '#4ADE80',
    textLight: '#BBF7D0',
    bg: '#22C55E'
  },
  uncommon: {
    border: '#3B82F6',
    borderHover: '#2563EB',
    text: '#60A5FA',
    textLight: '#DBEAFE',
    bg: '#3B82F6'
  },
  rare: {
    border: '#A855F7',
    borderHover: '#9333EA',
    text: '#C084FC',
    textLight: '#E9D5FF',
    bg: '#A855F7'
  },
  epic: {
    border: '#EC4899',
    borderHover: '#DB2777',
    text: '#F472B6',
    textLight: '#FCE7F3',
    bg: '#EC4899'
  },
  legendary: {
    border: '#F97316',
    borderHover: '#EA580C',
    text: '#FB923C',
    textLight: '#FED7AA',
    bg: '#F97316'
  },
  mythic: {
    border: '#EF4444',
    borderHover: '#DC2626',
    text: '#F87171',
    textLight: '#FEE2E2',
    bg: '#EF4444'
  },
  artifact: {
    border: '#EAB308',
    borderHover: '#CA8A04',
    text: '#FACC15',
    textLight: '#FEF3C7',
    bg: '#EAB308'
  },
  cursed: {
    border: '#1F2937',
    borderHover: '#111827',
    text: '#6B7280',
    textLight: '#F3F4F6',
    bg: '#1F2937'
  },
  set: {
    border: '#14B8A6',
    borderHover: '#0D9488',
    text: '#5EEAD4',
    textLight: '#CCFBF1',
    bg: '#14B8A6'
  }
}

interface ItemDetailModalProps {
  item: Item
  isOpen: boolean
  onClose: () => void
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="bold" color={RARITY_COLORS[item.rarity]?.text || '#9CA3AF'}>
                {item.name}
              </Text>
              <Badge 
                fontSize="xs"
                bg={RARITY_COLORS[item.rarity]?.bg || '#4A5568'}
                color="white"
              >
                {item.type} - {item.rarity.toUpperCase()}
              </Badge>
            </VStack>
            <Text color="yellow.300" fontSize="md" fontWeight="bold">
              {item.value} Gold
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={6}>
          <VStack align="start" spacing={4}>
            <Text fontSize="sm" color="gray.300">
              {item.description}
            </Text>

            {item.stats && Object.keys(item.stats).length > 0 && (
              <>
                <Divider borderColor="gray.600" />
                <VStack align="start" spacing={2} w="full">
                  <Text fontSize="sm" fontWeight="bold" color="gray.200">
                    Item Statistics
                  </Text>
                  <SimpleGrid columns={2} spacing={3} w="full">
                    {Object.entries(item.stats).map(([stat, value]) => (
                      <HStack key={stat} justify="space-between">
                        <Text fontSize="sm" color="gray.400">
                          {stat.charAt(0).toUpperCase() + stat.slice(1)}:
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color="green.300">
                          +{value}
                        </Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </VStack>
              </>
            )}
          </VStack>
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