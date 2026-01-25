import { Box, VStack, HStack, Text, Badge, Icon, Tooltip, SimpleGrid, Flex } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { Hero, Item } from '../../types'

// Rarity color mapping
const RARITY_COLORS: Record<string, string> = {
  common: 'gray.500',
  uncommon: 'green.400',
  rare: 'blue.400',
  epic: 'purple.400',
  legendary: 'orange.400',
  mythic: 'red.400'
}

interface RosterHeroCardProps {
  hero: Hero
  isSelected: boolean
  onClick: () => void
}

export function RosterHeroCard({ hero, isSelected, onClick }: RosterHeroCardProps) {
  const IconComponent = ((GameIcons as Record<string, IconType>)[hero.class.icon] || GameIcons.GiSwordman) as IconType
  const equippedItems = Object.values(hero.equipment || {}).filter((item): item is Item => item !== null)
  
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
      {equippedItems.length > 0 && (
        <VStack align="start" spacing={0.5} pt={2} w="full">
          <Text fontSize="2xs" color="gray.400" fontWeight="bold">Equipped:</Text>
          {equippedItems.map((item, idx) => (
            <Text key={idx} fontSize="2xs" color={RARITY_COLORS[item.rarity] || 'gray.400'}>
              • {item.name}
            </Text>
          ))}
        </VStack>
      )}
    </VStack>
  )
  
  return (
    <Tooltip label={tooltipLabel} placement="right" hasArrow bg="gray.800" color="white" p={2}>
      <Box
        position="relative"
        bg={isSelected ? 'blue.900' : 'gray.800'}
        borderRadius="lg"
        borderWidth="2px"
        borderColor={isSelected ? 'blue.500' : 'gray.700'}
        cursor="pointer"
        onClick={onClick}
        transition="all 0.2s"
        overflow="hidden"
        p={3}
        _hover={{ 
          borderColor: 'blue.400', 
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        {/* Icon Background */}
        <Box position="absolute" top={-2} right={-2} opacity={0.05}>
          <Icon as={IconComponent} boxSize={20} color="blue.400" />
        </Box>
        
        <Flex gap={3} position="relative" zIndex={1} align="center">
          {/* Hero Icon */}
          <Box
            bg={isSelected ? 'blue.800' : 'gray.900'}
            borderRadius="lg"
            p={3}
            borderWidth="2px"
            borderColor={isSelected ? 'blue.600' : 'gray.700'}
            flexShrink={0}
            position="relative"
          >
            <Icon as={IconComponent} boxSize={10} color="blue.300" />
            
            {/* Equipment pips around icon */}
            {equippedItems.length > 0 && (() => {
              const angleStep = 360 / equippedItems.length
              const radius = 28
              return equippedItems.map((item, idx) => {
                const angle = (angleStep * idx - 90) * (Math.PI / 180)
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius
                return (
                  <Tooltip key={idx} label={item.name} fontSize="xs" placement="top">
                    <Box
                      position="absolute"
                      left="50%"
                      top="50%"
                      transform={`translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`}
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg={RARITY_COLORS[item.rarity] || 'gray.500'}
                      boxShadow={`0 0 6px ${RARITY_COLORS[item.rarity] || 'gray.500'}`}
                      borderWidth="1px"
                      borderColor="gray.900"
                    />
                  </Tooltip>
                )
              })
            })()}
          </Box>
          
          {/* Hero Info */}
          <VStack align="start" spacing={1} flex={1} minW={0}>
            <HStack justify="space-between" w="full" spacing={2}>
              <Text fontWeight="bold" fontSize="md" color="orange.200" isTruncated flex={1}>
                {hero.name}
              </Text>
              <Badge fontSize="xs" colorScheme="blue" flexShrink={0}>
                Lv {hero.level}
              </Badge>
            </HStack>
            
            <Text fontSize="xs" color="gray.400">
              {hero.class.name}
            </Text>
            
            <HStack spacing={3} fontSize="xs" color="gray.500" pt={1}>
              <HStack spacing={1}>
                <Text color="red.400">❤</Text>
                <Text>{hero.stats.hp}/{hero.stats.maxHp}</Text>
              </HStack>
              <HStack spacing={1}>
                <Text color="orange.400">⚔</Text>
                <Text>{hero.stats.attack}</Text>
              </HStack>
              <HStack spacing={1}>
                <Text color="blue.400">🛡</Text>
                <Text>{hero.stats.defense}</Text>
              </HStack>
              <HStack spacing={1}>
                <Text color="green.400">⚡</Text>
                <Text>{hero.stats.speed}</Text>
              </HStack>
            </HStack>
          </VStack>
        </Flex>
        
        {isSelected && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="3px"
            bg="blue.400"
            boxShadow="0 0 12px rgba(59, 130, 246, 0.8)"
          />
        )}
      </Box>
    </Tooltip>
  )
}
