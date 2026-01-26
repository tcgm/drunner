import { Button, Box, HStack, Spacer } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiFootprint, GiBackpack, GiBookCover, GiExitDoor, GiReturnArrow } from 'react-icons/gi'

interface DungeonActionBarProps {
  showContinue: boolean
  onContinue: () => void
  onInventory: () => void
  onJournal: () => void
  onRetreat: () => void
  onExit: () => void
}

export default function DungeonActionBar({ showContinue, onContinue, onInventory, onJournal, onRetreat, onExit }: DungeonActionBarProps) {
  return (
    <Box className="dungeon-action-bar" bg="gray.800" borderRadius="lg" p={4}>
      <HStack className="dungeon-action-bar-content" spacing={4}>
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
