import { VStack, Heading, Button, HStack, SimpleGrid, Box, Text, Badge, Flex, Icon as ChakraIcon, Tooltip, IconButton } from '@chakra-ui/react'
import { useState } from 'react'
import { Icon } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import { CORE_CLASSES } from '@data/classes'
import { createHero } from '@utils/heroUtils'
import { useGameStore } from '@store/gameStore'
import type { HeroClass, Hero } from '@/types'

interface PartySetupScreenProps {
  onStart: () => void
  onBack: () => void
}

// Hero Slot Component
function HeroSlot({ 
  hero, 
  index, 
  selectedClass,
  isHovered,
  onAdd,
  onRemove,
  onHover
}: { 
  hero: Hero | null
  index: number
  selectedClass: HeroClass | null
  isHovered: boolean
  onAdd: () => void
  onRemove: (id: string) => void
  onHover: (index: number | null) => void
}) {
  const isEmpty = !hero
  
  return (
    <Box
      position="relative"
      h="auto"
      w="full"
      bg={isEmpty ? 'gray.800' : 'linear-gradient(135deg, rgba(26, 32, 44, 0.9) 0%, rgba(45, 55, 72, 0.9) 100%)'}
      borderRadius="xl"
      borderWidth="3px"
      borderColor={isHovered ? 'orange.500' : isEmpty ? 'gray.700' : 'orange.800'}
      cursor={isEmpty && selectedClass ? 'pointer' : 'default'}
      onClick={() => isEmpty && selectedClass && onAdd()}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      transition="all 0.3s"
      _hover={isEmpty && selectedClass ? { borderColor: 'orange.400', transform: 'scale(1.02)', boxShadow: '0 8px 24px rgba(251, 146, 60, 0.3)' } : {}}
      overflow="hidden"
      boxShadow={isEmpty ? 'none' : '0 4px 16px rgba(0,0,0,0.4)'}
    >
      {isEmpty ? (
        <Flex h="120px" align="center" justify="center" direction="column">
          <ChakraIcon as={GameIcons.GiPlusCircle} boxSize={12} color="gray.600" mb={2} />
          <Text color="gray.500" fontSize="sm" fontWeight="bold" textAlign="center" px={2}>
            {selectedClass ? selectedClass.name : 'Empty Slot'}
          </Text>
          <Text color="gray.600" fontSize="xs" mt={1}>Slot {index + 1}</Text>
        </Flex>
      ) : (
        <>
          {/* Background Icon Effect */}
          <Box
            position="absolute"
            top="-20px"
            right="-20px"
            opacity={0.08}
            transform="rotate(-15deg)"
          >
            <Icon 
              as={(GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman} 
              boxSize={40} 
              color="orange.400"
            />
          </Box>
          
          <VStack spacing={1} p={1} position="relative" zIndex={1}>
            {/* Main Icon */}
            <Box
              bg="linear-gradient(135deg, rgba(194, 65, 12, 0.3) 0%, rgba(234, 88, 12, 0.3) 100%)"
              borderRadius="lg"
              p={1}
              borderWidth="2px"
              borderColor="orange.700"
              boxShadow="0 0 20px rgba(234, 88, 12, 0.2)"
              position="relative"
            >
              <ChakraIcon 
                as={(GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman} 
                boxSize={12} 
                color="orange.300"
              />
              {/* Glow effect */}
              <Box
                position="absolute"
                inset={0}
                borderRadius="lg"
                bg="orange.500"
                opacity={0.1}
                filter="blur(10px)"
              />
            </Box>
            
            {/* Hero Info */}
            <VStack spacing={0.5} w="full">
              <Text fontWeight="bold" fontSize="sm" color="orange.200" w="full" textAlign="center">
                {hero.name}
              </Text>
              <Badge colorScheme="orange" fontSize="xs">
                Lv{hero.level}
              </Badge>
              
              {/* Stats Grid */}
              <SimpleGrid columns={2} spacing={1} w="full" pt={1} fontSize="xs">
                <VStack spacing={0} bg="gray.900" borderRadius="md" p={1}>
                  <Text color="gray.500">HP</Text>
                  <Text fontWeight="bold" color="cyan.400">{hero.stats.maxHp}</Text>
                </VStack>
                <VStack spacing={0} bg="gray.900" borderRadius="md" p={1}>
                  <Text color="gray.500">ATK</Text>
                  <Text fontWeight="bold" color="red.400">{hero.stats.attack}</Text>
                </VStack>
                <VStack spacing={0} bg="gray.900" borderRadius="md" p={1}>
                  <Text color="gray.500">DEF</Text>
                  <Text fontWeight="bold" color="blue.400">{hero.stats.defense}</Text>
                </VStack>
                <VStack spacing={0} bg="gray.900" borderRadius="md" p={1}>
                  <Text color="gray.500">SPD</Text>
                  <Text fontWeight="bold" color="green.400">{hero.stats.speed}</Text>
                </VStack>
              </SimpleGrid>
            </VStack>
            
            {/* Remove Button */}
            <Button
              size="sm"
              colorScheme="red"
              variant="solid"
              w="full"
              leftIcon={<ChakraIcon as={GameIcons.GiCancel} />}
              onClick={(e) => {
                e.stopPropagation()
                onRemove(hero.id)
              }}
              fontSize="xs"
              mt={1}
            >
              Remove
            </Button>
          </VStack>
        </>
      )}
      
      {/* Slot Number Badge */}
      <Box
        position="absolute"
        top={2}
        right={2}
        bg="gray.900"
        borderRadius="full"
        w={7}
        h={7}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="xs"
        fontWeight="bold"
        color="gray.400"
        borderWidth="2px"
        borderColor="gray.700"
      >
        {index + 1}
      </Box>
      
      {/* Selected glow */}
      {!isEmpty && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="3px"
          bg="linear-gradient(90deg, transparent, orange.400, transparent)"
          boxShadow="0 0 10px rgba(251, 146, 60, 0.8)"
        />
      )}
    </Box>
  )
}

// Class Card Component
function ClassCard({ 
  heroClass, 
  isSelected, 
  partyHasClass, 
  onClick 
}: { 
  heroClass: HeroClass
  isSelected: boolean
  partyHasClass: boolean
  onClick: () => void
}) {
  const IconComponent = (GameIcons as any)[heroClass.icon] || GameIcons.GiSwordman
  
  const tooltipLabel = (
    <VStack align="start" spacing={1} p={1}>
      <Text fontWeight="bold" fontSize="sm">{heroClass.name}</Text>
      <Text fontSize="xs" color="gray.300">{heroClass.description}</Text>
      <SimpleGrid columns={2} spacing={2} pt={1} fontSize="xs">
        <Text>HP: <Text as="span" fontWeight="bold" color="cyan.300">{heroClass.baseStats.hp}</Text></Text>
        <Text>ATK: <Text as="span" fontWeight="bold" color="red.300">{heroClass.baseStats.attack}</Text></Text>
        <Text>DEF: <Text as="span" fontWeight="bold" color="blue.300">{heroClass.baseStats.defense}</Text></Text>
        <Text>SPD: <Text as="span" fontWeight="bold" color="green.300">{heroClass.baseStats.speed}</Text></Text>
        <Text>LCK: <Text as="span" fontWeight="bold" color="yellow.300">{heroClass.baseStats.luck}</Text></Text>
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
              <Text>HP:{heroClass.baseStats.hp}</Text>
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
              onClick={onStart}
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
            
            {party.length > 0 && (
              <Box w="full" p={3} bg="gray.900" borderRadius="lg" borderWidth="2px" borderColor="gray.700" flexShrink={0}>
                <Text fontSize="sm" color="gray.400" mb={2} fontWeight="bold">Party Summary</Text>
                <HStack spacing={6} fontSize="sm" justify="center">
                  <VStack spacing={0}>
                    <Text color="gray.400">Total HP</Text>
                    <Text color="cyan.400" fontWeight="bold" fontSize="lg">{party.reduce((sum, h) => sum + h.stats.maxHp, 0)}</Text>
                  </VStack>
                  <VStack spacing={0}>
                    <Text color="gray.400">Avg ATK</Text>
                    <Text color="red.400" fontWeight="bold" fontSize="lg">{Math.round(party.reduce((sum, h) => sum + h.stats.attack, 0) / party.length)}</Text>
                  </VStack>
                  <VStack spacing={0}>
                    <Text color="gray.400">Avg DEF</Text>
                    <Text color="blue.400" fontWeight="bold" fontSize="lg">{Math.round(party.reduce((sum, h) => sum + h.stats.defense, 0) / party.length)}</Text>
                  </VStack>
                  <VStack spacing={0}>
                    <Text color="gray.400">Avg SPD</Text>
                    <Text color="green.400" fontWeight="bold" fontSize="lg">{Math.round(party.reduce((sum, h) => sum + h.stats.speed, 0) / party.length)}</Text>
                  </VStack>
                </HStack>
              </Box>
            )}
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
