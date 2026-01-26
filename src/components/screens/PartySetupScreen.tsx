import { VStack, Heading, Button, HStack, SimpleGrid, Box, Text, Badge, Flex } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { CORE_CLASSES } from '@data/classes'
import { createHero } from '@utils/heroUtils'
import { useGameStore } from '@store/gameStore'
import type { HeroClass } from '@/types'
import HeroSlot from '@components/party/HeroSlot'
import ClassCard from '@components/party/ClassCard'
import PartySummary from '@components/party/PartySummary'

interface PartySetupScreenProps {
  onStart: () => void
  onBack: () => void
}

export default function PartySetupScreen({ onStart, onBack }: PartySetupScreenProps) {
  const { party, addHero, removeHero, startDungeon, hasPendingPenalty, applyPenalty } = useGameStore()
  const [selectedClass, setSelectedClass] = useState<HeroClass | null>(null)
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null)
  const maxPartySize = 4
  
  // Apply penalty when entering party setup if there's a pending penalty
  useEffect(() => {
    if (hasPendingPenalty) {
      applyPenalty()
    }
  }, [hasPendingPenalty, applyPenalty])
  
  const handleAddHero = (slotIndex: number) => {
    if (selectedClass && !party[slotIndex]) {
      const heroName = `${selectedClass.name}`
      const newHero = createHero(selectedClass, heroName)
      addHero(newHero)
      setSelectedClass(null)
    }
  }
  
  const handleRemoveHero = (heroId: string) => {
    removeHero(heroId)
  }
  
  const handleStart = () => {
    startDungeon()
    onStart()
  }
  
  const canStart = party.length > 0
  const partySlots = Array.from({ length: maxPartySize }, (_, i) => party[i] || null)
  
  return (
    <Box h="100vh" w="100vw" bg="gray.900" display="flex" flexDirection="column" overflow="hidden">
      {/* Top Bar - Fixed height */}
      <Box bg="gray.950" borderBottom="2px solid" borderColor="orange.800" px={4} py={2} flexShrink={0}>
        <HStack justify="space-between">
          <Heading size="sm" color="orange.400">Assemble Your Party</Heading>
          <HStack spacing={2}>
            <Button variant="outline" colorScheme="gray" onClick={onBack} size="xs">
              Back
            </Button>
            <Button 
              colorScheme="orange" 
              onClick={handleStart}
              isDisabled={!canStart}
              size="sm"
              px={6}
            >
              Enter Dungeon
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Main Content: 3-column layout */}
      <Flex flex={1} minH={0} overflow="hidden">
        {/* Left: Class Selection - Single column scrollable */}
        <Box w="280px" minW="280px" overflowY="auto" px={3} py={3} bg="gray.900" borderRight="2px solid" borderColor="gray.800">
          <VStack align="stretch" spacing={2}>
            <Box flexShrink={0} mb={2}>
              <Heading size="sm" color="orange.300" mb={1}>
                Hero Classes
              </Heading>
              <Text fontSize="xs" color="gray.500">
                {selectedClass ? `Selected: ${selectedClass.name}` : 'Select a hero'}
              </Text>
            </Box>
            
            {CORE_CLASSES.map((heroClass) => (
              <ClassCard
                key={heroClass.id}
                heroClass={heroClass}
                isSelected={selectedClass?.id === heroClass.id}
                partyHasClass={party.some(h => h.class.id === heroClass.id)}
                onClick={() => setSelectedClass(heroClass)}
              />
            ))}
          </VStack>
        </Box>

        {/* Center: Party Slots - Main area */}
        <Box flex={1} minW={0} display="flex" flexDirection="column" bg="gray.950" p={3}>
          <VStack spacing={2} h="full">
            <HStack justify="space-between" w="full" flexShrink={0}>
              <Heading size="sm" color="orange.300">
                Your Party
              </Heading>
              <Badge colorScheme="orange" fontSize="sm" px={2}>
                {party.length}/{maxPartySize}
              </Badge>
            </HStack>
            
            <Text fontSize="xs" color="gray.400" w="full" textAlign="center" flexShrink={0}>
              {selectedClass ? `Click a slot to add ${selectedClass.name}` : 'Select a hero class on the left'}
            </Text>
            
            <HStack spacing={4} w="full" flex={1} minH={0}>
              {partySlots.map((hero, index) => (
                <HeroSlot
                  key={index}
                  hero={hero}
                  index={index}
                  selectedClass={selectedClass}
                  isHovered={hoveredSlot === index}
                  onAdd={() => handleAddHero(index)}
                  onRemove={handleRemoveHero}
                  onHover={setHoveredSlot}
                />
              ))}
            </HStack>
            
            <PartySummary party={party} />
          </VStack>
        </Box>

        {/* Right: Future area (artifacts, powers, etc) */}
        <Box w="300px" minW="300px" bg="gray.900" borderLeft="2px solid" borderColor="gray.800" p={4}>
          <VStack spacing={3} h="full">
            <Heading size="sm" color="orange.300">
              Equipment & Powers
            </Heading>
            <Box flex={1} display="flex" alignItems="center" justifyContent="center">
              <VStack spacing={2}>
                <Text color="gray.600" fontSize="sm" textAlign="center">
                  Coming Soon
                </Text>
                <Text color="gray.700" fontSize="xs" textAlign="center">
                  Artifacts, abilities, and party buffs will appear here
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Box>
  )
}
