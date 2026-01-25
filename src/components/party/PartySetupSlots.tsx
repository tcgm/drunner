import { Flex, Center, Card, CardBody, HStack, VStack, Heading, Text, Badge, Button } from '@chakra-ui/react'
import { CORE_CLASSES } from '../../data/classes'
import type { Hero } from '../../types'

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
  return (
    <Flex flex={1} direction="column" p={4} overflow="auto" gap={3}>
      {party.map((hero, index) => (
        <Card
          key={index}
          variant="outline"
          bg={hero ? 'gray.800' : 'gray.900'}
          borderColor={hero ? 'orange.700' : 'gray.700'}
          borderWidth="2px"
          h="120px"
        >
          <CardBody p={3}>
            {hero ? (
              <HStack spacing={3} h="full">
                <VStack align="start" flex={1} spacing={1}>
                  <HStack justify="space-between" w="full">
                    <Heading size="sm" color="orange.300">{hero.name}</Heading>
                    <Badge colorScheme="blue">Level {hero.level}</Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.400">
                    {CORE_CLASSES.find(c => c.id === hero.classId)?.name}
                  </Text>
                  <HStack spacing={4} fontSize="sm">
                    <HStack>
                      <Text color="gray.400">HP:</Text>
                      <Text fontWeight="bold" color="red.300">{hero.currentHp}/{hero.maxHp}</Text>
                    </HStack>
                    <HStack>
                      <Text color="gray.400">ATK:</Text>
                      <Text fontWeight="bold" color="orange.300">{hero.attack}</Text>
                    </HStack>
                    <HStack>
                      <Text color="gray.400">DEF:</Text>
                      <Text fontWeight="bold" color="blue.300">{hero.defense}</Text>
                    </HStack>
                    <HStack>
                      <Text color="gray.400">SPD:</Text>
                      <Text fontWeight="bold" color="green.300">{hero.speed}</Text>
                    </HStack>
                  </HStack>
                </VStack>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => onRemoveHero(index)}
                >
                  Remove
                </Button>
              </HStack>
            ) : (
              <Center h="full">
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="gray"
                  onClick={() => onAddHero(index)}
                  leftIcon={<Text>+</Text>}
                >
                  Add Hero
                </Button>
              </Center>
            )}
          </CardBody>
        </Card>
      ))}
    </Flex>
  )
}
