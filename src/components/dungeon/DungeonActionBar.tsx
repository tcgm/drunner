import './DungeonActionBar.css'
import { Button, Box, HStack, Spacer, VStack, SimpleGrid, Tooltip, Badge } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiFootprint, GiBackpack, GiBookCover, GiExitDoor, GiReturnArrow, GiScrollQuill } from 'react-icons/gi'
import { useOrientation } from '@/contexts/OrientationContext'
import { useGameStore } from '@/core/gameStore'
// import { GiSwordClash } from 'react-icons/gi' // Disabled - Combat Log merged into Journal

interface DungeonActionBarProps {
  showContinue: boolean
  onContinue: () => void
  onInventory: () => void
  onJournal: () => void
  // onCombatLog: () => void // Disabled
  onRetreat: () => void
  onExit: () => void
  onQuests: () => void
}

export default function DungeonActionBar({ showContinue, onContinue, onInventory, onJournal, onRetreat, onExit, onQuests }: DungeonActionBarProps) {
  const { isPortrait } = useOrientation()
  const quests = useGameStore(s => s.quests)
  const activeCount = quests.filter(q => q.status === 'active').length
  const completedCount = quests.filter(q => q.status === 'completed').length

  if (isPortrait) {
    // Portrait Mode - Compact grid layout
    return (
      <Box className="dungeon-action-bar dungeon-action-bar-portrait" bg="gray.800" borderRadius="lg" p={2}>
        <VStack spacing={2} align="stretch">
          {showContinue && (
            <Tooltip label="Continue exploring the dungeon" placement="top">
              <Button 
                colorScheme="orange" 
                leftIcon={<Icon as={GiFootprint} />}
                size="md"
                onClick={onContinue}
                w="full"
              >
                Continue
              </Button>
            </Tooltip>
          )}
          <SimpleGrid columns={4} spacing={2}>
            <Tooltip label="Inventory" placement="top">
              <Button 
                colorScheme="blue" 
                variant="outline"
                onClick={onInventory}
                size="md"
              >
                <Icon as={GiBackpack} boxSize={5} />
              </Button>
            </Tooltip>
            <Tooltip label="Journal" placement="top">
              <Button 
                colorScheme="purple" 
                variant="outline"
                onClick={onJournal}
                size="md"
              >
                <Icon as={GiBookCover} boxSize={5} />
              </Button>
            </Tooltip>
            <Tooltip label="Quests" placement="top">
              <Button
                colorScheme={completedCount > 0 ? 'green' : activeCount > 0 ? 'orange' : 'gray'}
                variant="outline"
                onClick={onQuests}
                size="md"
                position="relative"
              >
                <Icon as={GiScrollQuill} boxSize={5} />
                {(completedCount > 0 || activeCount > 0) && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    colorScheme={completedCount > 0 ? 'green' : 'orange'}
                    borderRadius="full"
                    fontSize="2xs"
                    minW={4}
                    h={4}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {completedCount > 0 ? completedCount : activeCount}
                  </Badge>
                )}
              </Button>
            </Tooltip>
            <Tooltip label="Retreat" placement="top">
              <Button 
                colorScheme="yellow" 
                variant="outline"
                onClick={onRetreat}
                size="md"
              >
                <Icon as={GiReturnArrow} boxSize={5} />
              </Button>
            </Tooltip>
            <Tooltip label="Exit to Menu" placement="top">
              <Button 
                colorScheme="gray" 
                variant="ghost"
                onClick={onExit}
                size="md"
              >
                <Icon as={GiExitDoor} boxSize={5} />
              </Button>
            </Tooltip>
          </SimpleGrid>
        </VStack>
      </Box>
    )
  }

  // Desktop Mode - Horizontal layout
  return (
    <Box className="dungeon-action-bar dungeon-action-bar-desktop" bg="gray.800" borderRadius="lg" p={4}>
      <HStack spacing={4} flexWrap="wrap">
        {showContinue && (
          <Button 
            className="dungeon-action-bar-continue"
            colorScheme="orange" 
            leftIcon={<Icon as={GiFootprint} />}
            size="lg"
            onClick={onContinue}
          >
            Continue
          </Button>
        )}
        <Button 
          className="dungeon-action-bar-inventory"
          colorScheme="blue" 
          variant="outline"
          leftIcon={<Icon as={GiBackpack} />}
          onClick={onInventory}
        >
          Inventory
        </Button>
        <Button 
          className="dungeon-action-bar-journal"
          colorScheme="purple" 
          variant="outline"
          leftIcon={<Icon as={GiBookCover} />}
          onClick={onJournal}
        >
          Journal
        </Button>
        <Button
          className="dungeon-action-bar-quests"
          colorScheme={completedCount > 0 ? 'green' : activeCount > 0 ? 'orange' : 'gray'}
          variant="outline"
          leftIcon={<Icon as={GiScrollQuill} />}
          onClick={onQuests}
          position="relative"
        >
          Quests
          {completedCount > 0 && (
            <Badge colorScheme="green" borderRadius="full" fontSize="2xs" ml={1}>
              {completedCount}
            </Badge>
          )}
          {completedCount === 0 && activeCount > 0 && (
            <Badge colorScheme="orange" borderRadius="full" fontSize="2xs" ml={1}>
              {activeCount}
            </Badge>
          )}
        </Button>
        {/* Combat Log button disabled - functionality merged into Journal */}
        {/* <Button className="dungeon-action-bar-combat-log" colorScheme="red" variant="outline" leftIcon={<Icon as={GiSwordClash} />} onClick={onCombatLog}>Combat Log</Button> */}
        
        <Spacer />
        
        <Button 
          className="dungeon-action-bar-retreat"
          colorScheme="yellow" 
          variant="outline"
          leftIcon={<Icon as={GiReturnArrow} />}
          onClick={onRetreat}
        >
          Retreat
        </Button>
        
        <Button 
          className="dungeon-action-bar-exit"
          colorScheme="gray" 
          variant="ghost"
          onClick={onExit}
          leftIcon={<Icon as={GiExitDoor} />}
          size="sm"
        >
          Exit to Menu
        </Button>
      </HStack>
    </Box>
  )
}
