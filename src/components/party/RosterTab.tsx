import { VStack, Box, Text, Badge, HStack, Heading, Tooltip, SimpleGrid } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
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
      <Box flexShrink={0} mb={2}>
        <Heading size="xs" color="orange.300" mb={1}>
          Stored Heroes
        </Heading>
        <Text fontSize="xs" color="gray.500">
          {storedHeroes.length === 0 ? 'No stored heroes' : `${storedHeroes.length} hero${storedHeroes.length !== 1 ? 'es' : ''} available`}
        </Text>
      </Box>
      {storedHeroes.length === 0 ? (
        <Box bg="gray.850" p={4} borderRadius="md" textAlign="center">
          <Text fontSize="xs" color="gray.600">
            No heroes in your roster yet.
          </Text>
          <Text fontSize="2xs" color="gray.700" mt={1}>
            Heroes that survive runs will be stored here.
          </Text>
        </Box>
      ) : (
        storedHeroes.map((hero, index) => {
          const isSelected = selectedHeroFromRoster === index
          const IconComponent = ((GameIcons as Record<string, IconType>)[hero.class.icon] || GameIcons.GiSwordman) as IconType
          
          const tooltipLabel = (
            <VStack align="start" spacing={1} p={1}>
              <Text fontWeight="bold" fontSize="sm">{hero.name}</Text>
              <Text fontSize="xs" color="gray.300">{hero.class.name}</Text>
              <SimpleGrid columns={2} spacing={2} pt={1} fontSize="xs">
                <Text>HP: <Text as="span" fontWeight="bold" color="red.300">{hero.stats.hp}/{hero.stats.maxHp}</Text></Text>
                <Text>ATK: <Text as="span" fontWeight="bold" color="orange.300">{hero.stats.attack}</Text></Text>
                <Text>DEF: <Text as="span" fontWeight="bold" color="blue.300">{hero.stats.defense}</Text></Text>
                <Text>SPD: <Text as="span" fontWeight="bold" color="green.300">{hero.stats.speed}</Text></Text>
              </SimpleGrid>
            </VStack>
          )
          
          return (
            <Tooltip key={hero.id} label={tooltipLabel} placement="right" hasArrow bg="gray.800" color="white" p={2}>
              <Box
                position="relative"
                h="10vh"
                bg={isSelected ? 'blue.900' : 'gray.800'}
                borderRadius="md"
                borderWidth="2px"
                borderColor={isSelected ? 'blue.500' : 'gray.700'}
                cursor="pointer"
                onClick={() => onRosterHeroClick(index)}
                transition="all 0.2s"
                overflow="hidden"
                _hover={{ 
                  borderColor: 'blue.400', 
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              >
                {/* Icon Background */}
                <Box position="absolute" top={-2} right={-2} opacity={0.08}>
                  <Icon as={IconComponent} boxSize={16} color="blue.400" />
                </Box>
                
                <HStack h="full" spacing={2} p={2} position="relative" zIndex={1}>
                  <Box
                    bg={isSelected ? 'blue.800' : 'gray.900'}
                    borderRadius="md"
                    p={2}
                    borderWidth="2px"
                    borderColor={isSelected ? 'blue.600' : 'gray.700'}
                    flexShrink={0}
                  >
                    <Icon as={IconComponent} boxSize={8} color="blue.300" />
                  </Box>
                  
                  <VStack align="start" spacing={0} flex={1} minW={0}>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold" fontSize="sm" color="orange.200" isTruncated>
                        {hero.name}
                      </Text>
                      <Badge fontSize="2xs" colorScheme="blue">
                        Lvl {hero.level}
                      </Badge>
                    </HStack>
                    <Text fontSize="2xs" color="gray.400">
                      {CORE_CLASSES.find(c => c.id === hero.class.id)?.name}
                    </Text>
                    <HStack spacing={2} fontSize="2xs" color="gray.500">
                      <Text color="red.400">❤ {hero.stats.hp}/{hero.stats.maxHp}</Text>
                      <Text color="blue.400">🛡 {hero.stats.defense}</Text>
                    </HStack>
                  </VStack>
                </HStack>
                
                {isSelected && (
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="2px"
                    bg="blue.400"
                    boxShadow="0 0 8px rgba(59, 130, 246, 0.8)"
                  />
                )}
              </Box>
            </Tooltip>
          )
        })
      )}
    </VStack>
  )
}
