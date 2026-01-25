import { VStack, Heading, Button, HStack, SimpleGrid, Box, Text, Badge, Flex, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { CORE_CLASSES } from '@data/classes'
import { createHero } from '@utils/heroUtils'
import { useGameStore } from '@store/gameStore'
import type { HeroClass, Hero } from '@/types'
import HeroSlot from '@components/party/HeroSlot'
import ClassCard from '@components/party/ClassCard'
import PartySummary from '@components/party/PartySummary'
import InventoryPanel from '@components/dungeon/InventoryPanel'

interface PartySetupScreenProps {
  onStart: () => void
  onBack: () => void
}

export default function PartySetupScreen({ onStart, onBack }: PartySetupScreenProps) {
  const { party, heroRoster, addHero, addHeroByClass, removeHero, startDungeon, hasPendingPenalty, applyPenalty } = useGameStore()
  const [selectedClass, setSelectedClass] = useState<HeroClass | null>(null)
  const [selectedStoredHero, setSelectedStoredHero] = useState<Hero | null>(null)
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null)
  const [selectedHeroIndex, setSelectedHeroIndex] = useState<number>(0)
  const maxPartySize = 4
  
  // Apply penalty IMMEDIATELY when entering party setup if there's a pending penalty
  // This runs synchronously before the first render
  if (hasPendingPenalty) {
    applyPenalty()
  }
  
  const handleAddHeroByClass = (slotIndex: number) => {
    if (selectedClass && !party[slotIndex]) {
      addHeroByClass(selectedClass)
      setSelectedClass(null)
    }
  }
  
  const handleAddStoredHero = (slotIndex: number) => {
    if (selectedStoredHero && !party[slotIndex]) {
      addHero(selectedStoredHero)
      setSelectedStoredHero(null)
    }
  }
  
  // Get stored heroes that aren't currently in the party
  const availableStoredHeroes = heroRoster.filter(
    h => !party.some(p => p.id === h.id)
  )
  
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
        {/* Left: Class/Hero Selection with Tabs */}
        <Box w="280px" minW="280px" overflowY="auto" px={3} py={3} bg="gray.900" borderRight="2px solid" borderColor="gray.800">
          <Tabs size="sm" colorScheme="orange" isLazy>
            <TabList mb={3}>
              <Tab>Classes</Tab>
              <Tab>
                Roster
                {availableStoredHeroes.length > 0 && (
                  <Badge ml={2} colorScheme="orange" fontSize="xs">
                    {availableStoredHeroes.length}
                  </Badge>
                )}
              </Tab>
            </TabList>

            <TabPanels>
              {/* Tab 1: Class Selection */}
              <TabPanel p={0}>
                <VStack align="stretch" spacing={2}>
                  <Box flexShrink={0} mb={2}>
                    <Heading size="xs" color="orange.300" mb={1}>
                      Hero Classes
                    </Heading>
                    <Text fontSize="xs" color="gray.500">
                      {selectedClass ? `Selected: ${selectedClass.name}` : 'Select a class'}
                    </Text>
                  </Box>
                  
                  {CORE_CLASSES.map((heroClass) => {
                    // Check if there's a stored hero of this class available
                    const storedHeroOfClass = availableStoredHeroes.find(h => h.class.id === heroClass.id)
                    
                    return (
                      <ClassCard
                        key={heroClass.id}
                        heroClass={heroClass}
                        isSelected={selectedClass?.id === heroClass.id}
                        partyHasClass={party.some(h => h.class.id === heroClass.id)}
                        onClick={() => {
                          setSelectedClass(heroClass)
                          setSelectedStoredHero(null)
                        }}
                      />
                    )
                  })}
                </VStack>
              </TabPanel>

              {/* Tab 2: Stored Heroes */}
              <TabPanel p={0}>
                <VStack align="stretch" spacing={2}>
                  <Box flexShrink={0} mb={2}>
                    <Heading size="xs" color="orange.300" mb={1}>
                      Hero Roster
                    </Heading>
                    <Text fontSize="xs" color="gray.500">
                      {availableStoredHeroes.length === 0 
                        ? 'No stored heroes available'
                        : selectedStoredHero 
                          ? `Selected: ${selectedStoredHero.class.name} (Lvl ${selectedStoredHero.level})` 
                          : 'Select a hero'}
                    </Text>
                  </Box>
                  
                  {availableStoredHeroes.length === 0 ? (
                    <Text fontSize="sm" color="gray.600" textAlign="center" py={4}>
                      Create heroes from the Classes tab
                    </Text>
                  ) : (
                    availableStoredHeroes.map((hero) => (
                      <Box
                        key={hero.id}
                        p={2}
                        bg={selectedStoredHero?.id === hero.id ? 'orange.900' : 'gray.800'}
                        borderRadius="md"
                        borderWidth="2px"
                        borderColor={selectedStoredHero?.id === hero.id ? 'orange.500' : 'gray.700'}
                        cursor="pointer"
                        _hover={{ bg: selectedStoredHero?.id === hero.id ? 'orange.900' : 'gray.700', borderColor: 'orange.600' }}
                        onClick={() => {
                          setSelectedStoredHero(hero)
                          setSelectedClass(null)
                        }}
                        transition="all 0.2s"
                      >
                        <VStack align="start" spacing={1}>
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm" fontWeight="bold" color="orange.200">
                              {hero.class.name}
                            </Text>
                            <Badge colorScheme="orange" fontSize="xs">
                              Lvl {hero.level}
                            </Badge>
                          </HStack>
                          <SimpleGrid columns={2} spacing={1} w="full" fontSize="2xs" color="gray.400">
                            <Text>HP: {Math.floor(hero.stats.hp)}/{hero.stats.maxHp}</Text>
                            <Text>ATK: {hero.stats.attack}</Text>
                            <Text>DEF: {hero.stats.defense}</Text>
                            <Text>SPD: {hero.stats.speed}</Text>
                          </SimpleGrid>
                          {Object.values(hero.equipment).filter(e => e !== null).length > 0 && (
                            <Badge colorScheme="blue" fontSize="2xs">
                              {Object.values(hero.equipment).filter(e => e !== null).length} items equipped
                            </Badge>
                          )}
                        </VStack>
                      </Box>
                    ))
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
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
              {selectedClass 
                ? `Click a slot to add ${selectedClass.name}` 
                : selectedStoredHero 
                  ? `Click a slot to add ${selectedStoredHero.class.name} (Lvl ${selectedStoredHero.level})` 
                  : 'Select a hero from the left'}
            </Text>
            
            <HStack spacing={4} w="full" flex={1} minH={0}>
              {partySlots.map((hero, index) => (
                <Box
                  key={index}
                  onClick={() => hero && setSelectedHeroIndex(index)}
                  cursor={hero ? 'pointer' : 'default'}
                  opacity={hero && selectedHeroIndex === index ? 1 : hero ? 0.7 : 1}
                  transition="opacity 0.2s"
                  _hover={hero ? { opacity: 1 } : {}}
                >
                  <HeroSlot
                    hero={hero}
                    index={index}
                    selectedClass={selectedClass || selectedStoredHero?.class || null}
                    isHovered={hoveredSlot === index}
                    onAdd={() => {
                      if (selectedClass) {
                        handleAddHeroByClass(index)
                      } else if (selectedStoredHero) {
                        handleAddStoredHero(index)
                      }
                    }}
                    onRemove={handleRemoveHero}
                    onHover={setHoveredSlot}
                  />
                </Box>
              ))}
            </HStack>
            
            <PartySummary party={party} />
          </VStack>
        </Box>

        {/* Right: Equipment Management */}
        <Box w="300px" minW="300px" bg="gray.900" borderLeft="2px solid" borderColor="gray.800" p={4} overflowY="auto">
          <VStack spacing={3} h="full">
            <Heading size="sm" color="orange.300">
              Equipment
            </Heading>
            {party.length > 0 ? (
              <>
                {/* Hero selector tabs */}
                {party.length > 1 && (
                  <HStack spacing={1} w="full" flexWrap="wrap">
                    {party.map((hero, index) => (
                      <Button
                        key={hero.id}
                        size="xs"
                        variant={selectedHeroIndex === index ? 'solid' : 'outline'}
                        colorScheme="orange"
                        onClick={() => setSelectedHeroIndex(index)}
                        flex={1}
                        minW="60px"
                      >
                        {hero.name.split(' ')[0]}
                      </Button>
                    ))}
                  </HStack>
                )}
                
                {/* Inventory panel for selected hero */}
                <Box flex={1} w="full">
                  <InventoryPanel hero={party[selectedHeroIndex]} />
                </Box>
              </>
            ) : (
              <Box flex={1} display="flex" alignItems="center" justifyContent="center">
                <VStack spacing={2}>
                  <Text color="gray.600" fontSize="sm" textAlign="center">
                    No Heroes
                  </Text>
                  <Text color="gray.700" fontSize="xs" textAlign="center">
                    Add heroes to manage their equipment
                  </Text>
                </VStack>
              </Box>
            )}
          </VStack>
        </Box>
      </Flex>
    </Box>
  )
}