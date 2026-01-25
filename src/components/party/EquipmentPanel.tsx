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
    <Box w="300px" minW="300px" bg="gray.900" borderLeft="2px solid" borderColor="gray.800" p={4} overflowY="auto">
      <VStack spacing={3} h="full" align="stretch">
        <HStack justify="space-between" w="full">
          <Heading size="sm" color="orange.300">
            Equipment
          </Heading>
          <Button size="xs" colorScheme="blue" variant="outline" onClick={onOpenBank}>
            Bank ({bankInventory.length}/{bankStorageSlots})
          </Button>
        </HStack>
        
        {selectedHeroIndex !== null && selectedHero ? (
          <>
            <Text fontSize="sm" color="gray.400" fontWeight="medium">
              {selectedHero.name}
            </Text>
            
            {/* Equipment Slots */}
            <VStack align="stretch" spacing={2} flex={1}>
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
          </>
        ) : (
          <Box flex={1} display="flex" alignItems="center" justifyContent="center">
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Select a hero
              </Text>
              <Text fontSize="xs" color="gray.700" textAlign="center">
                Click a hero card to manage equipment
              </Text>
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  )
}
