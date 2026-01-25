import { VStack, Heading, Button, HStack, SimpleGrid, Box, Text, Badge } from '@chakra-ui/react'
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
  const { party, addHero } = useGameStore()
  const [selectedClass, setSelectedClass] = useState<HeroClass | null>(null)
  const maxPartySize = 4
  
  const handleAddHero = () => {
    if (selectedClass && party.length < maxPartySize) {
      const heroName = `${selectedClass.name} ${party.length + 1}`
      const newHero = createHero(selectedClass, heroName)
      addHero(newHero)
      setSelectedClass(null)
    }
  }
  
  const canStart = party.length > 0
  
  return (
    <VStack spacing={8} align="stretch">
      <Heading size="xl" textAlign="center">Create Your Party</Heading>
      
      {/* Current Party */}
      <Box>
        <Heading size="md" mb={3}>
          Your Party ({party.length}/{maxPartySize})
        </Heading>
        {party.length === 0 ? (
          <Text color="gray.500">No heroes yet. Select a class below to add a hero.</Text>
        ) : (
          <VStack spacing={2} align="stretch">
            {party.map((hero) => (
              <Box
                key={hero.id}
                p={3}
                bg="gray.800"
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.700"
              >
                <HStack justify="space-between">
                  <HStack>
                    <Text fontWeight="bold">{hero.name}</Text>
                    <Badge colorScheme="blue">Lv {hero.level}</Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.400">{hero.class.name}</Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
      
      {/* Class Selection */}
      {party.length < maxPartySize && (
        <Box>
          <Heading size="md" mb={3}>Select a Class</Heading>
          <SimpleGrid columns={[1, 2, 4]} spacing={4}>
            {CORE_CLASSES.map((heroClass) => {
              const IconComponent = (GameIcons as any)[heroClass.icon] || GameIcons.GiSwordman
              const isSelected = selectedClass?.id === heroClass.id
              
              return (
                <Box
                  key={heroClass.id}
                  p={4}
                  bg={isSelected ? 'orange.900' : 'gray.800'}
                  borderRadius="md"
                  borderWidth="2px"
                  borderColor={isSelected ? 'orange.500' : 'gray.700'}
                  cursor="pointer"
                  onClick={() => setSelectedClass(heroClass)}
                  _hover={{ borderColor: 'orange.400', bg: 'gray.750' }}
                  transition="all 0.2s"
                >
                  <VStack spacing={2}>
                    <Icon as={IconComponent} boxSize={12} color="orange.400" />
                    <Text fontWeight="bold" fontSize="lg">{heroClass.name}</Text>
                    <Text fontSize="xs" color="gray.400" textAlign="center" noOfLines={2}>
                      {heroClass.description.split(' - ')[0]}
                    </Text>
                  </VStack>
                </Box>
              )
            })}
          </SimpleGrid>
          
          {selectedClass && (
            <Box mt={4} p={4} bg="gray.800" borderRadius="md">
              <VStack align="stretch" spacing={2}>
                <Heading size="sm">{selectedClass.name}</Heading>
                <Text fontSize="sm" color="gray.300">{selectedClass.description}</Text>
                <HStack spacing={4} mt={2}>
                  <Text fontSize="sm">ATK: {selectedClass.baseStats.attack}</Text>
                  <Text fontSize="sm">DEF: {selectedClass.baseStats.defense}</Text>
                  <Text fontSize="sm">SPD: {selectedClass.baseStats.speed}</Text>
                  <Text fontSize="sm">LCK: {selectedClass.baseStats.luck}</Text>
                  {selectedClass.baseStats.magicPower && (
                    <Text fontSize="sm">MAG: {selectedClass.baseStats.magicPower}</Text>
                  )}
                </HStack>
                <Button colorScheme="orange" size="sm" onClick={handleAddHero} mt={2}>
                  Add to Party
                </Button>
              </VStack>
            </Box>
          )}
        </Box>
      )}
      
      {/* Action Buttons */}
      <HStack spacing={4} justify="center" pt={4}>
        <Button colorScheme="gray" onClick={onBack} size="lg">
          Back
        </Button>
        <Button 
          colorScheme="orange" 
          onClick={onStart} 
          size="lg"
          isDisabled={!canStart}
        >
          Start Adventure
        </Button>
      </HStack>
    </VStack>
  )
}
