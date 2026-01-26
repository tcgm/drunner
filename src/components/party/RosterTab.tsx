import { VStack, Box, Text, Heading } from '@chakra-ui/react'
import type { Hero } from '../../types'
import { RosterHeroCard } from './RosterHeroCard'

interface RosterTabProps {
  storedHeroes: Hero[]
  selectedHeroFromRoster: number | null
  onRosterHeroClick: (index: number) => void
}

export function RosterTab({ storedHeroes, selectedHeroFromRoster, onRosterHeroClick }: RosterTabProps) {
  return (
    <VStack className="roster-tab" align="stretch" spacing={3}>
      <Box flexShrink={0}>
        <Heading size="xs" color="orange.300" mb={1}>
          Stored Heroes
        </Heading>
        <Text fontSize="xs" color="gray.500">
          {storedHeroes.length === 0 ? 'No stored heroes' : `${storedHeroes.length} hero${storedHeroes.length !== 1 ? 'es' : ''} available`}
        </Text>
      </Box>
      
      {storedHeroes.length === 0 ? (
        <Box className="roster-tab-empty" bg="gray.850" p={4} borderRadius="md" textAlign="center">
          <Text fontSize="xs" color="gray.600">
            No heroes in your roster yet.
          </Text>
          <Text fontSize="2xs" color="gray.700" mt={1}>
            Heroes that survive runs will be stored here.
          </Text>
        </Box>
      ) : (
        storedHeroes.map((hero, index) => (
          <RosterHeroCard
            key={hero.id}
            hero={hero}
            isSelected={selectedHeroFromRoster === index}
            onClick={() => onRosterHeroClick(index)}
          />
        ))
      )}
    </VStack>
  )
}
