import { Box, VStack, HStack, Text, Badge, Icon, Tooltip, SimpleGrid, Flex } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { Hero, Item } from '../../types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { formatDefenseReduction } from '@/utils/defenseUtils'

// Rarity color mapping
const RARITY_COLORS = GAME_CONFIG.colors.rarity as Record<string, string>

interface RosterHeroCardProps {
  hero: Hero
  isSelected: boolean
  onClick: () => void
}

export function RosterHeroCard({ hero, isSelected, onClick }: RosterHeroCardProps) {
  const IconComponent = ((GameIcons as Record<string, IconType>)[hero.class.icon] || GameIcons.GiSwordman) as IconType
  const equippedItems = Object.values(hero.slots || {}).filter((item): item is Item => item !== null && 'stats' in item)
  
  const tooltipLabel = (
    <VStack align="start" spacing={1} p={1}>
      <Text fontWeight="bold" fontSize="sm">{hero.name}</Text>
      <Text fontSize="xs" color="gray.300">{hero.class.name}</Text>
      <SimpleGrid columns={2} spacing={2} pt={1} fontSize="xs">
        <Text>HP: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.hp.light}>{hero.stats.hp}/{hero.stats.maxHp}</Text></Text>
        <Text>ATK: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.attack}>{hero.stats.attack}</Text></Text>
        <Text>DEF: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.defense}>{hero.stats.defense} <Text as="span" fontSize="2xs" color="gray.400">{formatDefenseReduction(hero.stats.defense)}</Text></Text></Text>
        <Text>SPD: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.speed}>{hero.stats.speed}</Text></Text>
        <Text>WIS: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.wisdom}>{hero.stats.wisdom ?? 0}</Text></Text>
        <Text>CHA: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.charisma}>{hero.stats.charisma ?? 0}</Text></Text>
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
        className={`roster-hero-card ${isSelected ? 'roster-hero-card--selected' : ''}`}
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
        <Box className="roster-hero-card-bg-icon" position="absolute" top={-2} right={-2} opacity={0.05}>
          <Icon as={IconComponent} boxSize={20} color="blue.400" />
        </Box>
        
        <Flex className="roster-hero-card-content" gap={3} position="relative" zIndex={1} align="center">
          {/* Hero Icon */}
          <Box
            className="roster-hero-card-icon"
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
                      className="roster-hero-card-equipment-pip"
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
          <VStack className="roster-hero-card-info" align="start" spacing={1} flex={1} minW={0}>
            <HStack justify="space-between" w="full" spacing={2}>
              <Text className="roster-hero-card-name" fontWeight="bold" fontSize="md" color="orange.200" isTruncated flex={1}>
                {hero.name}
              </Text>
              <Badge className="roster-hero-card-level" fontSize="xs" colorScheme="blue" flexShrink={0}>
                Lv {hero.level}
              </Badge>
            </HStack>
            
            <Text className="roster-hero-card-class" fontSize="xs" color="gray.400">
              {hero.class.name}
            </Text>
            
            <HStack className="roster-hero-card-stats" spacing={3} fontSize="xs" color="gray.500" pt={1}>
              <HStack spacing={1}>
                <Text color={GAME_CONFIG.colors.hp.base}>❤</Text>
                <Text color={GAME_CONFIG.colors.hp.light}>{hero.stats.hp}/{hero.stats.maxHp}</Text>
              </HStack>
              <HStack spacing={1}>
                <Text color={GAME_CONFIG.colors.stats.attack}>⚔</Text>
                <Text color={GAME_CONFIG.colors.stats.attack}>{hero.stats.attack}</Text>
              </HStack>
              <HStack spacing={1}>
                <Text color={GAME_CONFIG.colors.stats.defense}>🛡</Text>
                <Text color={GAME_CONFIG.colors.stats.defense}>{hero.stats.defense}</Text>
              </HStack>
              <HStack spacing={1}>
                <Text color={GAME_CONFIG.colors.stats.speed}>⚡</Text>
                <Text color={GAME_CONFIG.colors.stats.speed}>{hero.stats.speed}</Text>
              </HStack>
            </HStack>
          </VStack>
        </Flex>
        
        {isSelected && (
          <Box
            className="roster-hero-card-selected-indicator"
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
