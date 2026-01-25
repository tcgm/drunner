import { Box, Flex, Center, Card, CardBody, HStack, VStack, Heading, Text, Badge, Button } from '@chakra-ui/react'
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
  const partyCount = party.filter(h => h !== null).length
  
  return (
    <Box flex={1} minW={0} display="flex" flexDirection="column" bg="gray.950" p={3}>
      <VStack spacing={2} h="full">
        <HStack justify="space-between" w="full" flexShrink={0}>
          <Heading size="sm" color="orange.300">
            Your Party
          </Heading>
          <Badge colorScheme="orange" fontSize="sm" px={2}>
            {partyCount}/{party.length}
          </Badge>
        </HStack>
        
        <Text fontSize="xs" color="gray.400" w="full" textAlign="center" flexShrink={0}>
          Select a class or hero from the left, then click a slot to add
        </Text>
        
        <HStack spacing={4} w="full" flex={1} minH={0}>
          {party.map((hero, index) => (
            <Card
              key={index}
              variant="outline"
              bg={hero ? 'gray.800' : 'gray.900'}
              borderColor={hero ? 'orange.700' : 'gray.700'}
              borderWidth="2px"
              flex={1}
              cursor={hero ? 'pointer' : 'default'}
              onClick={() => hero && onSelectHero(index)}
              _hover={hero ? { borderColor: 'orange.500' } : {}}
              transition="all 0.2s"
            >
              <CardBody p={3} display="flex" flexDirection="column">
                {hero ? (
                  <VStack align="start" flex={1} spacing={2}>
                    <HStack justify="space-between" w="full">
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="bold" color="orange.300">{hero.name}</Text>
                        <Text fontSize="xs" color="gray.400">
                          {CORE_CLASSES.find(c => c.id === hero.class.id)?.name}
                        </Text>
                      </VStack>
                      <Badge colorScheme="blue" fontSize="xs">Lvl {hero.level}</Badge>
                    </HStack>
                    
                    <VStack align="start" spacing={1} fontSize="xs" w="full">
                      <HStack justify="space-between" w="full">
                        <Text color="gray.500">HP:</Text>
                        <Text fontWeight="bold" color="red.300">{hero.stats.hp}/{hero.stats.maxHp}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="gray.500">ATK:</Text>
                        <Text fontWeight="bold" color="orange.300">{hero.stats.attack}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="gray.500">DEF:</Text>
                        <Text fontWeight="bold" color="blue.300">{hero.stats.defense}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="gray.500">SPD:</Text>
                        <Text fontWeight="bold" color="green.300">{hero.stats.speed}</Text>
                      </HStack>
                    </VStack>
                    
                    <Button
                      size="xs"
                      colorScheme="red"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveHero(index)
                      }}
                      w="full"
                      mt="auto"
                    >
                      Remove
                    </Button>
                  </VStack>
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
        </HStack>
      </VStack>
    </Box>
  )
}
