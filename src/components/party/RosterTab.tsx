import { VStack, Card, CardBody, Text, Badge, HStack } from '@chakra-ui/react'
import { CORE_CLASSES } from '../../data/classes'
import type { Hero } from '../../types'

interface RosterTabProps {
  storedHeroes: Hero[]
  selectedHeroFromRoster: number | null
  onRosterHeroClick: (index: number) => void
}

export function RosterTab({ storedHeroes, selectedHeroFromRoster, onRosterHeroClick }: RosterTabProps) {
  return (
    <VStack align="stretch" spacing={2}>
      {storedHeroes.length === 0 ? (
        <Text fontSize="xs" color="gray.500" textAlign="center" py={4}>
          No heroes stored
        </Text>
      ) : (
        storedHeroes.map((hero, index) => (
          <Card
            key={hero.id}
            size="xs"
            variant="outline"
            cursor="pointer"
            onClick={() => onRosterHeroClick(index)}
            bg={selectedHeroFromRoster === index ? 'blue.900' : 'gray.800'}
            borderColor={selectedHeroFromRoster === index ? 'blue.600' : 'gray.700'}
            _hover={{ borderColor: 'blue.500' }}
            transition="all 0.2s"
          >
            <CardBody py={2} px={3}>
              <VStack align="start" spacing={1}>
                <HStack justify="space-between" w="full">
                  <Text fontSize="xs" fontWeight="bold" color="orange.300">
                    {hero.name}
                  </Text>
                  <Badge fontSize="2xs" colorScheme="blue">
                    Lvl {hero.level}
                  </Badge>
                </HStack>
                <Text fontSize="2xs" color="gray.400">
                  {CORE_CLASSES.find(c => c.id === hero.class.id)?.name}
                </Text>
                <HStack spacing={2} fontSize="2xs">
                  <Text color="red.400">❤ {hero.stats.hp}/{hero.stats.maxHp}</Text>
                  <Text color="blue.400">🛡 {hero.stats.defense}</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))
      )}
    </VStack>
  )
}
