import { VStack, HStack, Box, Heading, Text, Button, Center, Card, CardBody } from '@chakra-ui/react'
import type { Hero, Item, EquipmentSlot } from '../../types'

interface EquipmentPanelProps {
  party: (Hero | null)[]
  selectedHeroIndex: number | null
  bankInventory: Item[]
  bankStorageSlots: number
  onSelectHero: (index: number) => void
  onOpenBank: () => void
  onSlotClick: (heroIndex: number, slot: EquipmentSlot) => void
}

export function EquipmentPanel({
  party,
  selectedHeroIndex,
  bankInventory,
  bankStorageSlots,
  onSelectHero,
  onOpenBank,
  onSlotClick
}: EquipmentPanelProps) {
  const selectedHero = selectedHeroIndex !== null ? party[selectedHeroIndex] : null

  return (
    <Box w="300px" bg="gray.900" borderLeft="1px solid" borderColor="gray.700" p={4} overflow="auto">
      {selectedHeroIndex !== null && selectedHero ? (
        <VStack align="stretch" spacing={3}>
          <Heading size="sm" color="orange.400">Equipment</Heading>
          <Text fontSize="sm" color="gray.400">
            {selectedHero.name}
          </Text>
          
          {/* Equipment Slots */}
          <VStack align="stretch" spacing={2}>
            {Object.entries(selectedHero.equipment).map(([slot, item]) => (
              <Box key={slot}>
                <Text fontSize="xs" color="gray.500" mb={1} textTransform="capitalize">
                  {slot}
                </Text>
                {item ? (
                  <Card size="xs" variant="outline" bg="gray.800">
                    <CardBody py={2} px={3}>
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" fontWeight="bold" color="purple.300">
                            {item.name}
                          </Text>
                          <Text fontSize="2xs" color="gray.500">
                            {item.rarity} • {item.slot}
                          </Text>
                        </VStack>
                        <Button
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => {/* unequip */}}
                        >
                          Unequip
                        </Button>
                      </HStack>
                    </CardBody>
                  </Card>
                ) : (
                  <Card size="xs" variant="outline" bg="gray.850" borderStyle="dashed">
                    <CardBody py={2} px={3}>
                      <HStack justify="space-between">
                        <Text fontSize="xs" color="gray.600">Empty</Text>
                        <Button
                          size="xs"
                          variant="ghost"
                          colorScheme="gray"
                          onClick={() => onSlotClick(selectedHeroIndex, slot as EquipmentSlot)}
                        >
                          Equip
                        </Button>
                      </HStack>
                    </CardBody>
                  </Card>
                )}
              </Box>
            ))}
          </VStack>
        </VStack>
      ) : (
        <Center h="full">
          <Text fontSize="sm" color="gray.600">Select a hero to manage equipment</Text>
        </Center>
      )}
    </Box>
  )
}
