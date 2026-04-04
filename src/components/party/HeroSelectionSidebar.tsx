import { Box, Text, HStack, Icon } from '@chakra-ui/react'
import { GiStarFormation } from 'react-icons/gi'
import { RosterTab } from './RosterTab'
import type { Hero } from '../../types'

interface HeroSelectionSidebarProps {
  selectedHeroFromRoster: number | null
  storedHeroes: Hero[]
  onRosterHeroClick: (index: number) => void
}

export function HeroSelectionSidebar({
  selectedHeroFromRoster,
  storedHeroes,
  onRosterHeroClick,
}: HeroSelectionSidebarProps) {
  return (
    <Box className="hero-selection-sidebar" w="clamp(220px, 22vw, 320px)" minW="220px" px={3} py={3} bg="gray.900" borderRight="2px solid" borderColor="gray.800" display="flex" flexDirection="column" overflow="hidden">
      <HStack spacing={2} mb={3} flexShrink={0}>
        <Text color="orange.300" fontWeight="bold" fontSize="sm" letterSpacing="wide">
          Roster
        </Text>
        {storedHeroes.length === 0 && (
          <HStack spacing={1} opacity={0.6}>
            <Icon as={GiStarFormation} color="purple.400" boxSize={3} />
            <Text color="gray.500" fontSize="2xs">Hire from Guild Hall</Text>
          </HStack>
        )}
      </HStack>
      <Box flex={1} overflow="hidden">
        <RosterTab
          storedHeroes={storedHeroes}
          selectedHeroFromRoster={selectedHeroFromRoster}
          onRosterHeroClick={onRosterHeroClick}
        />
      </Box>
      {storedHeroes.length === 0 && (
        <Box
          mt={3}
          p={3}
          bg="purple.900"
          border="1px solid"
          borderColor="purple.700"
          borderRadius="lg"
          flexShrink={0}
        >
          <HStack spacing={2} mb={1}>
            <Icon as={GiStarFormation} color="purple.300" boxSize={3.5} />
            <Text color="purple.300" fontSize="xs" fontWeight="bold">No heroes yet</Text>
          </HStack>
          <Text color="gray.400" fontSize="2xs">
            Visit the Guild Hall and click the Adventurers' Board to hire heroes.
          </Text>
        </Box>
      )}
    </Box>
  )
}

