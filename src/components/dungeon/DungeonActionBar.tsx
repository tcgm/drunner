import './DungeonActionBar.css'
import { Button, Box, HStack, Spacer, VStack, SimpleGrid, Tooltip } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiFootprint, GiBackpack, GiBookCover, GiExitDoor, GiReturnArrow } from 'react-icons/gi'
import { useOrientation } from '@/contexts/OrientationContext'
// import { GiSwordClash } from 'react-icons/gi' // Disabled - Combat Log merged into Journal

interface DungeonActionBarProps {
  showContinue: boolean
  onContinue: () => void
  onInventory: () => void
  onJournal: () => void
  // onCombatLog: () => void // Disabled
  onRetreat: () => void
  onExit: () => void
}

export default function DungeonActionBar({ showContinue, onContinue, onInventory, onJournal, onRetreat, onExit }: DungeonActionBarProps) {
  const { isPortrait } = useOrientation()

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
