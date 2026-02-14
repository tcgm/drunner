import { VStack, HStack, SimpleGrid, Box, Text, Badge, Tooltip } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { HeroClass } from '@/types'
import { calculateMaxHp } from '@/utils/heroUtils'
import { GAME_CONFIG } from '@/config/gameConfig'
import { formatDefenseReduction } from '@/utils/defenseUtils'
import { useRef, useEffect, useState } from 'react'

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
  const textRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(16)

  useEffect(() => {
    const adjustFontSize = () => {
      if (!textRef.current) return
      const container = textRef.current
      const maxWidth = container.offsetWidth
      let size = 16

      container.style.fontSize = `${size}px`

      while (container.scrollWidth > maxWidth && size > 8) {
        size -= 0.5
        container.style.fontSize = `${size}px`
      }

      setFontSize(size)
    }

    adjustFontSize()
  }, [heroClass.name])
  
  const tooltipLabel = (
    <VStack className="class-card-tooltip" align="start" spacing={1} p={1}>
      <Text className="class-card-tooltip-name" fontWeight="bold" fontSize="sm">{heroClass.name}</Text>
      <Text className="class-card-tooltip-desc" fontSize="xs" color="gray.300">{heroClass.description}</Text>
      <HStack spacing={4} pt={1} align="start">
        <VStack align="start" spacing={1}>
          <Text fontSize="xs" fontWeight="bold" color="gray.400">Base Stats</Text>
          <SimpleGrid className="class-card-tooltip-stats" columns={2} spacing={2} fontSize="xs">
            <Text>HP: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.hp.light}>{maxHp}</Text></Text>
            <Text>ATK: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.attack}>{heroClass.baseStats.attack}</Text></Text>
            <Text>DEF: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.defense}>{heroClass.baseStats.defense} <Text as="span" fontSize="2xs" color="gray.400">{formatDefenseReduction(heroClass.baseStats.defense)}</Text></Text></Text>
            <Text>SPD: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.speed}>{heroClass.baseStats.speed}</Text></Text>
            <Text>LCK: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.luck}>{heroClass.baseStats.luck}</Text></Text>
            <Text>WIS: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.wisdom}>{heroClass.baseStats.wisdom}</Text></Text>
            <Text>CHA: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.charisma}>{heroClass.baseStats.charisma}</Text></Text>
            {heroClass.baseStats.magicPower !== undefined && (
              <Text>MAG: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.magicPower}>{heroClass.baseStats.magicPower}</Text></Text>
            )}
          </SimpleGrid>
        </VStack>
        <VStack align="start" spacing={1}>
          <Text fontSize="xs" fontWeight="bold" color="gray.400">Per Level</Text>
          <SimpleGrid className="class-card-tooltip-gains" columns={2} spacing={2} fontSize="xs">
            <Text>HP: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.hp.light}>+{heroClass.statGains.maxHp}</Text></Text>
            <Text>ATK: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.attack}>+{heroClass.statGains.attack}</Text></Text>
            <Text>DEF: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.defense}>+{heroClass.statGains.defense}</Text></Text>
            <Text>SPD: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.speed}>+{heroClass.statGains.speed}</Text></Text>
            <Text>LCK: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.luck}>+{heroClass.statGains.luck}</Text></Text>
            <Text>WIS: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.wisdom}>+{heroClass.statGains.wisdom}</Text></Text>
            <Text>CHA: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.charisma}>+{heroClass.statGains.charisma}</Text></Text>
            {heroClass.statGains.magicPower !== undefined && (
              <Text>MAG: <Text as="span" fontWeight="bold" color={GAME_CONFIG.colors.stats.magicPower}>+{heroClass.statGains.magicPower}</Text></Text>
            )}
          </SimpleGrid>
        </VStack>
      </HStack>
    </VStack>
  )
  
  return (
    <Tooltip label={tooltipLabel} placement="right" hasArrow bg="gray.800" color="white" p={2}>
      <Box
        className={`class-card ${isSelected ? 'class-card--selected' : ''} ${partyHasClass ? 'class-card--in-party' : ''}`}
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
        <Box className="class-card-icon-bg" position="absolute" top={-2} right={2} opacity={0.08}>
          <Icon as={IconComponent} boxSize={24} color="orange.400" />
        </Box>
        
        <VStack className="class-card-content" h="100%" spacing="5%" p="2%" position="relative" zIndex={1} justify="center">
          <Box
            className="class-card-icon"
            bg={isSelected ? 'orange.800' : 'gray.900'}
            borderRadius="md"
            p="3%"
            borderWidth="2px"
            borderColor={isSelected ? 'orange.600' : 'gray.700'}
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="60%"
            h="60%"
          >
            <Icon as={IconComponent} w="100%" h="100%" color="orange.300" />
          </Box>
          
          <VStack className="class-card-info" spacing={1} w="100%" position="relative">
            <Box w="100%" px={1}>
              <Text
                ref={textRef}
                className="class-card-name"
                fontWeight="bold"
                color="orange.200"
                textAlign="center"
                whiteSpace="nowrap"
                fontSize={`${fontSize}px`}
              >
                {heroClass.name}
              </Text>
            </Box>
            {partyHasClass && (
              <Badge className="class-card-in-party-badge" colorScheme="green" fontSize="xs">In Party</Badge>
            )}
          </VStack>
        </VStack>
        
        {isSelected && (
          <Box
            className="class-card-selected-indicator"
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="clamp(1px, 0.2vh, 3px)"
            bg="orange.400"
            boxShadow="0 0 8px rgba(251, 146, 60, 0.8)"
          />
        )}
      </Box>
    </Tooltip>
  )
}
