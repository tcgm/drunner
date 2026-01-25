import { Box, HStack, VStack, Text, Progress, Icon, Collapse, useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import type { Hero } from '@/types'
import * as GameIcons from 'react-icons/gi'

interface PartyMemberCardProps {
  hero: Hero
}

export default function PartyMemberCard({ hero }: PartyMemberCardProps) {
  const { isOpen, onToggle } = useDisclosure()
  const [isHovered, setIsHovered] = useState(false)
  
  const IconComponent = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman
  const hpPercent = (hero.stats.hp / hero.stats.maxHp) * 100
  const xpPercent = (hero.xp / (hero.level * 100)) * 100
  
  return (
    <Box
      bg="gray.900"
      borderRadius="md"
      borderWidth="2px"
      borderColor={isHovered ? 'orange.500' : hero.isAlive ? 'gray.700' : 'red.600'}
      opacity={hero.isAlive ? 1 : 0.5}
      transition="all 0.2s"
      cursor="pointer"
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      overflow="hidden"
    >
      {/* Compact View */}
      <HStack spacing={2} p={2}>
        <Icon as={IconComponent} boxSize={8} color="orange.400" flexShrink={0} />
        
        <VStack spacing={1} align="stretch" flex={1} minW={0}>
          <HStack spacing={2}>
            <Text fontWeight="bold" fontSize="xs" noOfLines={1} flex={1}>
              {hero.name}
            </Text>
            <Text fontSize="xs" color="orange.300" flexShrink={0}>
              Lv{hero.level}
            </Text>
          </HStack>
          
          {/* HP Bar */}
          <Box>
            <Progress 
              value={hpPercent} 
              size="xs"
              colorScheme={hpPercent > 50 ? 'green' : hpPercent > 25 ? 'yellow' : 'red'}
              borderRadius="full"
              bg="gray.700"
            />
            <HStack justify="space-between" mt={0.5}>
              <Text fontSize="2xs" color="gray.500">HP</Text>
              <Text fontSize="2xs" color="gray.400">
                {hero.stats.hp}/{hero.stats.maxHp}
              </Text>
            </HStack>
          </Box>
        </VStack>
      </HStack>
      
      {/* Expanded Details */}
      <Collapse in={isOpen || isHovered} animateOpacity>
        <VStack spacing={2} p={2} pt={0} align="stretch" borderTop="1px" borderColor="gray.700">
          {/* Class Name */}
          <Text fontSize="2xs" color="gray.500" textAlign="center">
            {hero.class.name}
          </Text>
          
          {/* XP Bar */}
          <Box>
            <HStack justify="space-between" mb={0.5}>
              <Text fontSize="2xs" color="gray.500">XP</Text>
              <Text fontSize="2xs" color="gray.400">
                {hero.xp}/{hero.level * 100}
              </Text>
            </HStack>
            <Progress 
              value={xpPercent} 
              size="xs" 
              colorScheme="blue"
              borderRadius="full"
              bg="gray.700"
            />
          </Box>
          
          {/* Stats Grid */}
          <HStack spacing={1} fontSize="2xs" justify="space-around">
            <VStack spacing={0}>
              <Text color="gray.500">ATK</Text>
              <Text fontWeight="bold" color="orange.300">{hero.stats.attack}</Text>
            </VStack>
            <VStack spacing={0}>
              <Text color="gray.500">DEF</Text>
              <Text fontWeight="bold" color="blue.300">{hero.stats.defense}</Text>
            </VStack>
            <VStack spacing={0}>
              <Text color="gray.500">SPD</Text>
              <Text fontWeight="bold" color="green.300">{hero.stats.speed}</Text>
            </VStack>
            <VStack spacing={0}>
              <Text color="gray.500">LCK</Text>
              <Text fontWeight="bold" color="purple.300">{hero.stats.luck}</Text>
            </VStack>
          </HStack>
          
          {/* Abilities Count */}
          <HStack justify="center" fontSize="2xs" color="gray.500">
            <Icon as={GameIcons.GiSparkles} boxSize={3} />
            <Text>{hero.abilities.length} Abilities</Text>
          </HStack>
        </VStack>
      </Collapse>
    </Box>
  )
}
