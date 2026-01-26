import { VStack, HStack, SimpleGrid, Box, Text, Badge, Tooltip } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { HeroClass } from '@/types'
import { calculateMaxHp } from '@/utils/heroUtils'
import { GAME_CONFIG } from '@/config/gameConfig'

interface ClassCardProps {
  heroClass: HeroClass
  isSelected: boolean
  partyHasClass: boolean
  onClick: () => void
}

export default function ClassCard({ 
  heroClass, 
  isSelected, 
  partyHasClass, 
  onClick 
}: ClassCardProps) {
  const IconComponent = ((GameIcons as Record<string, IconType>)[heroClass.icon] || GameIcons.GiSwordman) as IconType
  const maxHp = calculateMaxHp(1, heroClass.baseStats.defense)
  
  const tooltipLabel = (
    <VStack align="start" spacing={1} p={1}>
      <Text fontWeight="bold" fontSize="sm">{heroClass.name}</Text>
      <Text fontSize="xs" color="gray.300">{heroClass.description}</Text>
      <SimpleGrid columns={2} spacing={2} pt={1} fontSize="xs">
        <Text>HP: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.hp.light}>{maxHp}</Text></Text>
        <Text>ATK: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.attack}>{heroClass.baseStats.attack}</Text></Text>
        <Text>DEF: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.defense}>{heroClass.baseStats.defense}</Text></Text>
        <Text>SPD: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.speed}>{heroClass.baseStats.speed}</Text></Text>
        <Text>LCK: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.luck}>{heroClass.baseStats.luck}</Text></Text>
      </SimpleGrid>
    </VStack>
  )
  
  return (
    <Tooltip label={tooltipLabel} placement="top" hasArrow bg="gray.800" color="white" p={2}>
      <Box
        position="relative"
        h="12vh"
        bg={isSelected ? 'orange.900' : 'gray.800'}
        borderRadius="md"
        borderWidth="2px"
        borderColor={isSelected ? 'orange.500' : 'gray.700'}
        cursor="pointer"
        onClick={onClick}
        transition="all 0.2s"
        overflow="hidden"
        _hover={{ 
          borderColor: 'orange.400', 
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        {/* Icon Background */}
        <Box position="absolute" top={-2} right={-2} opacity={0.08}>
          <Icon as={IconComponent} boxSize={18} color="orange.400" />
        </Box>
        
        <HStack h="full" spacing={2} p={2} position="relative" zIndex={1}>
          <Box
            bg={isSelected ? 'orange.800' : 'gray.900'}
            borderRadius="md"
            p={2}
            borderWidth="2px"
            borderColor={isSelected ? 'orange.600' : 'gray.700'}
            flexShrink={0}
          >
            <Icon as={IconComponent} boxSize={9} color="orange.300" />
          </Box>
          
          <VStack align="start" spacing={0} flex={1} minW={0}>
            <Text fontWeight="bold" fontSize="sm" color="orange.200" isTruncated w="full">
              {heroClass.name}
            </Text>
            <HStack spacing={1} fontSize="xs" color="gray.400" flexWrap="wrap">
              <Text>HP:{maxHp}</Text>
              <Text>•</Text>
              <Text>ATK:{heroClass.baseStats.attack}</Text>
            </HStack>
            {partyHasClass && (
              <Badge colorScheme="green" fontSize="xs" mt={0.5}>In Party</Badge>
            )}
          </VStack>
        </HStack>
        
        {isSelected && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="2px"
            bg="orange.400"
            boxShadow="0 0 8px rgba(251, 146, 60, 0.8)"
          />
        )}
      </Box>
    </Tooltip>
  )
}
