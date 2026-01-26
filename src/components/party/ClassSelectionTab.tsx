import { Box, Heading, VStack, Text, HStack, Tooltip, SimpleGrid } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import { CORE_CLASSES } from '../../data/classes'
import type { HeroClass } from '../../types'
import { calculateMaxHp } from '../../utils/heroUtils'
import { GAME_CONFIG } from '@/config/gameConfig'

interface ClassSelectionTabProps {
  selectedClass: HeroClass | null
  onClassSelect: (classId: string) => void
}

export function ClassSelectionTab({ selectedClass, onClassSelect }: ClassSelectionTabProps) {
  return (
    <VStack align="stretch" spacing={2}>
      <Box flexShrink={0} mb={2}>
        <Heading size="xs" color="orange.300" mb={1}>
          Hero Classes
        </Heading>
        <Text fontSize="xs" color="gray.500">
          {selectedClass ? `Selected: ${selectedClass.name}` : 'Select a class'}
        </Text>
      </Box>
      
      {CORE_CLASSES.map((cls) => {
        const IconComponent = ((GameIcons as Record<string, IconType>)[cls.icon] || GameIcons.GiSwordman) as IconType
        const maxHp = calculateMaxHp(1, cls.baseStats.defense)
        const isSelected = selectedClass?.id === cls.id
        
        const tooltipLabel = (
          <VStack align="start" spacing={1} p={1}>
            <Text fontWeight="bold" fontSize="sm">{cls.name}</Text>
            <Text fontSize="xs" color="gray.300">{cls.description}</Text>
            <SimpleGrid columns={2} spacing={2} pt={1} fontSize="xs">
              <Text>HP: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.hp.light}>{maxHp}</Text></Text>
              <Text>ATK: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.attack}>{cls.baseStats.attack}</Text></Text>
              <Text>DEF: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.defense}>{cls.baseStats.defense}</Text></Text>
              <Text>SPD: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.speed}>{cls.baseStats.speed}</Text></Text>
              <Text>LCK: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.luck}>{cls.baseStats.luck}</Text></Text>
            </SimpleGrid>
          </VStack>
        )
        
        return (
          <Tooltip key={cls.id} label={tooltipLabel} placement="right" hasArrow bg="gray.800" color="white" p={2}>
            <Box
              position="relative"
              h="12vh"
              bg={isSelected ? 'orange.900' : 'gray.800'}
              borderRadius="md"
              borderWidth="2px"
              borderColor={isSelected ? 'orange.500' : 'gray.700'}
              cursor="pointer"
              onClick={() => onClassSelect(cls.id)}
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
                    {cls.name}
                  </Text>
                  <HStack spacing={1} fontSize="xs" color="gray.400" flexWrap="wrap">
                    <Text>HP:{maxHp}</Text>
                    <Text>•</Text>
                    <Text>ATK:{cls.baseStats.attack}</Text>
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
                  bg="orange.400"
                  boxShadow="0 0 8px rgba(251, 146, 60, 0.8)"
                />
              )}
            </Box>
          </Tooltip>
        )
      })}
    </VStack>
  )
}
