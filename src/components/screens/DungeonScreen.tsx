import { VStack, Heading, Button, Text, Box, HStack, Flex, Spacer } from '@chakra-ui/react'
import { useGameStore } from '@store/gameStore'
import { Icon } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import PartyMemberCard from '@components/party/PartyMemberCard'

interface DungeonScreenProps {
  onExit: () => void
}

export default function DungeonScreen({ onExit }: DungeonScreenProps) {
  const { dungeon, party } = useGameStore()
  
  return (
    <Flex h="calc(100vh - 4rem)" gap={4}>
      {/* Left Sidebar - Party */}
      <Box w="240px" bg="gray.800" borderRadius="lg" p={3} overflowY="auto">
        <VStack spacing={3} align="stretch">
          <Heading size="sm" color="orange.400" px={1}>
            Party ({party.length})
          </Heading>
          
          {party.map((hero) => (
            <PartyMemberCard key={hero.id} hero={hero} />
          ))}
          
          {party.length === 0 && (
            <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
              No party members
            </Text>
          )}
        </VStack>
      </Box>
      
      {/* Main Content Area */}
      <Flex direction="column" flex={1} gap={4}>
        {/* Top Bar */}
        <Box bg="gray.800" borderRadius="lg" p={4}>
          <HStack>
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" color="gray.400">Current Location</Text>
              <Heading size="lg" color="orange.400">
                Floor {dungeon.depth}
              </Heading>
            </VStack>
            
            <Spacer />
            
            <HStack spacing={6}>
              <VStack spacing={0}>
                <Text fontSize="sm" color="gray.400">Gold</Text>
                <HStack>
                  <Icon as={GameIcons.GiTwoCoins} color="yellow.400" />
                  <Text fontSize="lg" fontWeight="bold">{dungeon.gold}</Text>
                </HStack>
              </VStack>
              
              <VStack spacing={0}>
                <Text fontSize="sm" color="gray.400">Depth</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {dungeon.depth}/{dungeon.maxDepth}
                </Text>
              </VStack>
            </HStack>
          </HStack>
        </Box>
        
        {/* Event/Combat Area */}
        <Box 
          flex={1} 
          bg="gray.800" 
          borderRadius="lg" 
          p={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          backgroundImage="radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.05) 0%, transparent 50%)"
        >
          <VStack spacing={4}>
            <Icon as={GameIcons.GiDungeonGate} boxSize={20} color="gray.600" />
            <Text color="gray.400" fontSize="xl" fontWeight="semibold">
              Dungeon Exploration
            </Text>
            <Text color="gray.500" fontSize="md" textAlign="center" maxW="md">
              Events, combat encounters, and treasure discoveries will appear here
            </Text>
          </VStack>
        </Box>
        
        {/* Action Bar */}
        <Box bg="gray.800" borderRadius="lg" p={4}>
          <HStack spacing={4}>
            <Button 
              colorScheme="orange" 
              leftIcon={<Icon as={GameIcons.GiFootprint} />}
              size="lg"
            >
              Continue
            </Button>
            <Button 
              colorScheme="blue" 
              variant="outline"
              leftIcon={<Icon as={GameIcons.GiBackpack} />}
            >
              Inventory
            </Button>
            <Button 
              colorScheme="purple" 
              variant="outline"
              leftIcon={<Icon as={GameIcons.GiBookCover} />}
            >
              Journal
            </Button>
            
            <Spacer />
            
            <Button 
              colorScheme="red" 
              variant="ghost"
              onClick={onExit}
              leftIcon={<Icon as={GameIcons.GiExitDoor} />}
            >
              Exit Dungeon
            </Button>
          </HStack>
        </Box>
      </Flex>
      
      {/* Right Sidebar - Info Panel (Future: Minimap, Buffs, etc.) */}
      <Box w="250px" bg="gray.800" borderRadius="lg" p={4}>
        <VStack spacing={4} align="stretch">
          <Heading size="md" color="orange.400">Info</Heading>
          
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2}>Current Floor</Text>
            <VStack align="stretch" spacing={1} fontSize="xs" color="gray.400">
              <HStack justify="space-between">
                <Text>Events Cleared:</Text>
                <Text color="white" fontWeight="bold">0</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Enemies Defeated:</Text>
                <Text color="white" fontWeight="bold">0</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Treasure Found:</Text>
                <Text color="white" fontWeight="bold">0</Text>
              </HStack>
            </VStack>
          </Box>
          
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2}>Party Status</Text>
            <VStack align="stretch" spacing={1} fontSize="xs" color="gray.400">
              <HStack justify="space-between">
                <Text>Alive:</Text>
                <Text color="green.400" fontWeight="bold">
                  {party.filter(h => h.isAlive).length}/{party.length}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Avg Level:</Text>
                <Text color="white" fontWeight="bold">
                  {party.length > 0 ? Math.floor(party.reduce((sum, h) => sum + h.level, 0) / party.length) : 0}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Total HP:</Text>
                <Text color="white" fontWeight="bold">
                  {party.reduce((sum, h) => sum + h.stats.hp, 0)}/
                  {party.reduce((sum, h) => sum + h.stats.maxHp, 0)}
                </Text>
              </HStack>
            </VStack>
          </Box>
          
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2}>Quick Stats</Text>
            <VStack align="stretch" spacing={2} fontSize="xs">
              <HStack>
                <Icon as={GameIcons.GiSwordman} color="orange.400" />
                <Text color="gray.400">Total ATK:</Text>
                <Text color="white" fontWeight="bold">
                  {party.reduce((sum, h) => sum + h.stats.attack, 0)}
                </Text>
              </HStack>
              <HStack>
                <Icon as={GameIcons.GiShield} color="blue.400" />
                <Text color="gray.400">Total DEF:</Text>
                <Text color="white" fontWeight="bold">
                  {party.reduce((sum, h) => sum + h.stats.defense, 0)}
                </Text>
              </HStack>
              <HStack>
                <Icon as={GameIcons.GiRun} color="green.400" />
                <Text color="gray.400">Avg SPD:</Text>
                <Text color="white" fontWeight="bold">
                  {party.length > 0 ? Math.floor(party.reduce((sum, h) => sum + h.stats.speed, 0) / party.length) : 0}
                </Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Flex>
  )
}
