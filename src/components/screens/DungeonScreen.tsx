import { Flex, Button, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from '@chakra-ui/react'
import { useRef } from 'react'
import { useGameStore } from '@store/gameStore'
import PartySidebar from '@components/dungeon/PartySidebar'
import DungeonHeader from '@components/dungeon/DungeonHeader'
import EventArea from '@components/dungeon/EventArea'
import DungeonActionBar from '@components/dungeon/DungeonActionBar'
import InfoSidebar from '@components/dungeon/InfoSidebar'
import GameOverScreen from '@components/dungeon/GameOverScreen'
import type { EventChoice } from '@/types'

interface DungeonScreenProps {
  onExit: () => void
}

export default function DungeonScreen({ onExit }: DungeonScreenProps) {
  const { dungeon, party, advanceDungeon, selectChoice, isGameOver, lastOutcome, retreatFromDungeon } = useGameStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  
  const handleSelectChoice = (choice: EventChoice) => {
    selectChoice(choice)
  }
  
  const handleContinue = () => {
    advanceDungeon()
  }
  
  const handleRetreat = () => {
    retreatFromDungeon()
    onClose()
    onExit()
  }
  
  // Game over check
  if (isGameOver) {
    return <GameOverScreen depth={dungeon.depth} onExit={onExit} />
  }
  
  return (
    <Flex h="100vh" gap={2} p={2}>
      <PartySidebar party={party} />
      
      <Flex direction="column" flex={1} gap={2} minH={0}>
        <DungeonHeader 
          depth={dungeon.depth} 
          maxDepth={dungeon.maxDepth} 
          gold={dungeon.gold} 
        />
        
        <EventArea
          currentEvent={dungeon.currentEvent}
          currentOutcome={lastOutcome}
          party={party}
          depth={dungeon.depth}
          gold={dungeon.gold}
          onSelectChoice={handleSelectChoice}
          onContinue={handleContinue}
          onAdvance={advanceDungeon}
        />
        
        <DungeonActionBar
          showContinue={!dungeon.currentEvent && !lastOutcome}
          onContinue={advanceDungeon}
          onRetreat={onOpen}
          onExit={onExit}
        />
      </Flex>
      
      <InfoSidebar party={party} />
      
      {/* Retreat Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="orange.400">
              Retreat from Dungeon?
            </AlertDialogHeader>

            <AlertDialogBody color="gray.300">
              Are you sure you want to retreat? Your heroes will keep their levels and equipment,
              but this run will be marked as a retreat in your history.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Stay
              </Button>
              <Button colorScheme="orange" onClick={handleRetreat} ml={3}>
                Retreat
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  )
}
