import { Button, Box, HStack, Spacer } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiFootprint, GiBackpack, GiBookCover, GiExitDoor } from 'react-icons/gi'

interface DungeonActionBarProps {
  showContinue: boolean
  onContinue: () => void
  onExit: () => void
}

export default function DungeonActionBar({ showContinue, onContinue, onExit }: DungeonActionBarProps) {
  return (
    <Box bg="gray.800" borderRadius="lg" p={4}>
      <HStack spacing={4}>
        {showContinue && (
          <Button 
            colorScheme="orange" 
            leftIcon={<Icon as={GiFootprint} />}
            size="lg"
            onClick={onContinue}
          >
            Continue
          </Button>
        )}
        <Button 
          colorScheme="blue" 
          variant="outline"
          leftIcon={<Icon as={GiBackpack} />}
          isDisabled
        >
          Inventory
        </Button>
        <Button 
          colorScheme="purple" 
          variant="outline"
          leftIcon={<Icon as={GiBookCover} />}
          isDisabled
        >
          Journal
        </Button>
        
        <Spacer />
        
        <Button 
          colorScheme="red" 
          variant="ghost"
          onClick={onExit}
          leftIcon={<Icon as={GiExitDoor} />}
        >
          Exit Dungeon
        </Button>
      </HStack>
    </Box>
  )
}
