import { VStack, Heading, Button, HStack, SimpleGrid, Box, Text, Badge, Grid, Flex, Icon as ChakraIcon, Tooltip } from '@chakra-ui/react'
import { useState } from 'react'
import { Icon } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import { CORE_CLASSES } from '@data/classes'
import { createHero } from '@utils/heroUtils'
import { useGameStore } from '@store/gameStore'
import type { HeroClass } from '@/types'

interface PartySetupScreenProps {
  onStart: () => void
  onBack: () => void
}

export default function PartySetupScreen({ onStart, onBack }: PartySetupScreenProps) {
  const { party, addHero, removeHero } = useGameStore()
  const [selectedClass, setSelectedClass] = useState<HeroClass | null>(null)
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null)
  const maxPartySize = 4
  
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
  
  const canStart = party.length > 0
  
  // Create party slots array (filled + empty)
  const partySlots = Array.from({ length: maxPartySize }, (_, i) => party[i] || null)
  
  return (
    <Box h="100vh" bg="gray.900">
      {/* Top Bar */}
      <Box bg="gray.950" borderBottom="2px solid" borderColor="orange.800" p={4}>
        <HStack justify="space-between">
          <Heading size="lg" color="orange.400">Assemble Your Party</Heading>
          <HStack spacing={4}>
            <Button variant="outline" colorScheme="gray" onClick={onBack}>
              Back to Menu
            </Button>
            <Button 
              colorScheme="orange" 
              onClick={onStart}
              isDisabled={!canStart}
              size="lg"
              px={8}
            >
              Enter Dungeon
            </Button>
          </HStack>
        </HStack>
      </Box>

      <Grid templateColumns="1fr 2fr" h="calc(100vh - 80px)">
        {/* Left: Party Slots */}
        <Box bg="gray.950" borderRight="2px solid" borderColor="gray.800" p={6}>
          <VStack spacing={4} align="stretch" h="full">
            <Heading size="md" color="orange.300" mb={2}>
              Party Roster ({party.length}/{maxPartySize})
            </Heading>
            
            {partySlots.map((hero, index) => {
              const isHovered = hoveredSlot === index
              const isEmpty = !hero
              
              return (
                <Box
                  key={index}
                  position="relative"
                  h="120px"
                  bg={isEmpty ? 'gray.800' : 'gray.850'}
                  borderRadius="lg"
                  borderWidth="3px"
                  borderColor={isHovered ? 'orange.500' : isEmpty ? 'gray.700' : 'orange.800'}
                  cursor={isEmpty && selectedClass ? 'pointer' : 'default'}
                  onClick={() => isEmpty && selectedClass && handleAddHero(index)}
                  onMouseEnter={() => setHoveredSlot(index)}
                  onMouseLeave={() => setHoveredSlot(null)}
                  transition="all 0.2s"
                  _hover={isEmpty && selectedClass ? { borderColor: 'orange.400', transform: 'scale(1.02)' } : {}}
                  overflow="hidden"
                >
                  {isEmpty ? (
                    <Flex h="full" align="center" justify="center" direction="column">
                      <ChakraIcon as={GameIcons.GiPlusCircle} boxSize={8} color="gray.600" mb={2} />
                      <Text color="gray.500" fontSize="sm" fontWeight="bold">
                        {selectedClass ? `Click to add ${selectedClass.name}` : 'Select a class'}
                      </Text>
                      <Text color="gray.600" fontSize="xs">Slot {index + 1}</Text>
                    </Flex>
                  ) : (
                    <HStack h="full" spacing={4} p={4}>
                      <Box
                        bg="orange.900"
                        borderRadius="md"
                        p={3}
                        borderWidth="2px"
                        borderColor="orange.700"
                      >
                        <ChakraIcon 
                          as={(GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman} 
                          boxSize={12} 
                          color="orange.300"
                        />
                      </Box>
                      
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontWeight="bold" fontSize="lg" color="orange.200">
                          {hero.name}
                        </Text>
                        <Badge colorScheme="orange" fontSize="xs">
                          {hero.class.name} • Level {hero.level}
                        </Badge>
                        <HStack spacing={2} fontSize="xs" color="gray.400">
                          <Text>HP: {hero.stats.maxHp}</Text>
                          <Text>ATK: {hero.stats.attack}</Text>
                          <Text>DEF: {hero.stats.defense}</Text>
                        </HStack>
                      </VStack>
                      
                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveHero(hero.id)
                        }}
                      >
                        Remove
                      </Button>
                    </HStack>
                  )}
                  
                  {/* Slot Number Badge */}
                  <Box
                    position="absolute"
                    top={2}
                    right={2}
                    bg="gray.900"
                    borderRadius="full"
                    w={6}
                    h={6}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                    fontWeight="bold"
                    color="gray.500"
                  >
                    {index + 1}
                  </Box>
                </Box>
              )
            })}
            
            <Box flex={1} />
            
            {party.length > 0 && (
              <Box p={4} bg="gray.900" borderRadius="md" borderWidth="1px" borderColor="gray.700">
                <Text fontSize="sm" color="gray.400" mb={2}>Party Stats</Text>
                <SimpleGrid columns={2} spacing={2} fontSize="sm">
                  <Text>Total HP: {party.reduce((sum, h) => sum + h.stats.maxHp, 0)}</Text>
                  <Text>Avg ATK: {Math.round(party.reduce((sum, h) => sum + h.stats.attack, 0) / party.length)}</Text>
                  <Text>Avg DEF: {Math.round(party.reduce((sum, h) => sum + h.stats.defense, 0) / party.length)}</Text>
                  <Text>Avg SPD: {Math.round(party.reduce((sum, h) => sum + h.stats.speed, 0) / party.length)}</Text>
                </SimpleGrid>
              </Box>
            )}
          </VStack>
        </Box>

        {/* Right: Class Selection */}
        <Box p={6} overflow="auto">
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="md" color="orange.300" mb={1}>
                Choose Your Heroes
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Select a class, then click an empty slot to add them to your party
              </Text>
            </Box>
            
            <SimpleGrid columns={[2, 3, 4]} spacing={4}>
              {CORE_CLASSES.map((heroClass) => {
                const IconComponent = (GameIcons as any)[heroClass.icon] || GameIcons.GiSwordman
                const isSelected = selectedClass?.id === heroClass.id
                const partyHasClass = party.some(h => h.class.id === heroClass.id)
                
                return (
                  <Tooltip
                    key={heroClass.id}
                    label={heroClass.description}
                    placement="top"
                    hasArrow
                  >
                    <Box
                      position="relative"
                      h="200px"
                      bg={isSelected ? 'orange.900' : 'gray.800'}
                      borderRadius="lg"
                      borderWidth="3px"
                      borderColor={isSelected ? 'orange.500' : 'gray.700'}
                      cursor="pointer"
                      onClick={() => setSelectedClass(heroClass)}
                      transition="all 0.2s"
                      overflow="hidden"
                      _hover={{ 
                        borderColor: 'orange.400', 
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
                      }}
                    >
                      {/* Class Icon Background */}
                      <Box
                        position="absolute"
                        top={-4}
                        right={-4}
                        opacity={0.1}
                      >
                        <Icon as={IconComponent} boxSize={32} color="orange.400" />
                      </Box>
                      
                      <VStack h="full" justify="space-between" p={4} position="relative" zIndex={1}>
                        <VStack spacing={2} flex={1} justify="center">
                          <Box
                            bg={isSelected ? 'orange.800' : 'gray.900'}
                            borderRadius="full"
                            p={3}
                            borderWidth="2px"
                            borderColor={isSelected ? 'orange.600' : 'gray.700'}
                          >
                            <Icon as={IconComponent} boxSize={12} color="orange.300" />
                          </Box>
                          
                          <Text fontWeight="bold" fontSize="xl" textAlign="center" color="orange.200">
                            {heroClass.name}
                          </Text>
                        </VStack>
                        
                        <VStack spacing={1} w="full">
                          <SimpleGrid columns={2} spacing={1} w="full" fontSize="xs" color="gray.400">
                            <Text>ATK: {heroClass.baseStats.attack}</Text>
                            <Text>DEF: {heroClass.baseStats.defense}</Text>
                            <Text>SPD: {heroClass.baseStats.speed}</Text>
                            <Text>LCK: {heroClass.baseStats.luck}</Text>
                          </SimpleGrid>
                          
                          {partyHasClass && (
                            <Badge colorScheme="green" fontSize="xs" mt={1}>
                              In Party
                            </Badge>
                          )}
                        </VStack>
                      </VStack>
                      
                      {isSelected && (
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          h="3px"
                          bg="orange.400"
                          boxShadow="0 0 10px rgba(251, 146, 60, 0.8)"
                        />
                      )}
                    </Box>
                  </Tooltip>
                )
              })}
            </SimpleGrid>
            
            {/* Selected Class Detail Panel */}
            {selectedClass && (
              <Box
                p={6}
                bg="gray.850"
                borderRadius="lg"
                borderWidth="2px"
                borderColor="orange.700"
                boxShadow="0 4px 12px rgba(0,0,0,0.3)"
              >
                <HStack spacing={6} align="start">
                  <Box
                    bg="orange.900"
                    borderRadius="lg"
                    p={6}
                    borderWidth="2px"
                    borderColor="orange.700"
                  >
                    <Icon 
                      as={(GameIcons as any)[selectedClass.icon] || GameIcons.GiSwordman} 
                      boxSize={20} 
                      color="orange.300"
                    />
                  </Box>
                  
                  <VStack align="start" spacing={3} flex={1}>
                    <Heading size="lg" color="orange.300">{selectedClass.name}</Heading>
                    <Text color="gray.300">{selectedClass.description}</Text>
                    
                    <Box w="full" pt={2}>
                      <Text fontSize="sm" fontWeight="bold" color="gray.400" mb={2}>
                        Base Stats
                      </Text>
                      <SimpleGrid columns={[2, 3, 5]} spacing={3}>
                        <VStack spacing={0}>
                          <Text fontSize="2xl" fontWeight="bold" color="red.400">
                            {selectedClass.baseStats.attack}
                          </Text>
                          <Text fontSize="xs" color="gray.500">Attack</Text>
                        </VStack>
                        <VStack spacing={0}>
                          <Text fontSize="2xl" fontWeight="bold" color="blue.400">
                            {selectedClass.baseStats.defense}
                          </Text>
                          <Text fontSize="xs" color="gray.500">Defense</Text>
                        </VStack>
                        <VStack spacing={0}>
                          <Text fontSize="2xl" fontWeight="bold" color="green.400">
                            {selectedClass.baseStats.speed}
                          </Text>
                          <Text fontSize="xs" color="gray.500">Speed</Text>
                        </VStack>
                        <VStack spacing={0}>
                          <Text fontSize="2xl" fontWeight="bold" color="yellow.400">
                            {selectedClass.baseStats.luck}
                          </Text>
                          <Text fontSize="xs" color="gray.500">Luck</Text>
                        </VStack>
                        <VStack spacing={0}>
                          <Text fontSize="2xl" fontWeight="bold" color="cyan.400">
                            {selectedClass.baseStats.hp}
                          </Text>
                          <Text fontSize="xs" color="gray.500">HP</Text>
                        </VStack>
                      </SimpleGrid>
                    </Box>
                    
                    <Text fontSize="xs" color="orange.500" fontStyle="italic">
                      Click an empty party slot on the left to add this hero
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}
          </VStack>
        </Box>
      </Grid>
    </Box>
  )
}
