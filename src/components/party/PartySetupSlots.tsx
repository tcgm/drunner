import './PartySetupSlots.css'
import { Box, VStack, Heading, Text, Badge, HStack, SimpleGrid } from '@chakra-ui/react'
import type { Hero } from '../../types'
import { PartySlot } from './PartySlot'

interface PartySlotsProps {
  party: (Hero | null)[]
  onAddHero: (index: number) => void
  onRemoveHero: (index: number) => void
  onSelectHero: (index: number) => void
}

export function PartySetupSlots({
  party,
  onAddHero,
  onRemoveHero,
  onSelectHero
}: PartySlotsProps) {
  const partyCount = party.filter(h => h !== null).length
  
  return (
    <Box className="party-setup-slots" flex={1} minW={0} display="flex" flexDirection="column" bg="gray.950" p={3}>
      <VStack spacing={2} h="full">
        <SimpleGrid columns={3} w="full" flexShrink={0} gap={4} alignItems="center">
          <Heading size="sm" color="orange.300">
            Your Party
          </Heading>
          <Text fontSize="xs" color="gray.400" textAlign="center">
            Select a class or hero from the left, then click a slot to add
          </Text>
          <Badge colorScheme="orange" fontSize="sm" px={2} justifySelf="end">
            {partyCount}/{party.length}
          </Badge>
        </SimpleGrid>
        
        <HStack spacing={4} w="full" flex={1} minH={0}>
          {party.map((hero, index) => (
            <PartySlot
              key={index}
              hero={hero}
              slotIndex={index}
              onAdd={() => onAddHero(index)}
              onRemove={() => onRemoveHero(index)}
              onSelect={() => onSelectHero(index)}
            />
          ))}
        </HStack>
      </VStack>
    </Box>
  )
}
