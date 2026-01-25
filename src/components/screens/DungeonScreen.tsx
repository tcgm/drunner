import { Flex } from '@chakra-ui/react'
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
  const { dungeon, party, advanceDungeon, selectChoice, isGameOver, lastOutcome } = useGameStore()
  
  const handleSelectChoice = (choice: EventChoice) => {
    selectChoice(choice)
  }
  
  const handleContinue = () => {
    advanceDungeon()
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
          onSelectChoice={handleSelectChoice}
          onContinue={handleContinue}
          onAdvance={advanceDungeon}
        />
        
        <DungeonActionBar
          showContinue={!dungeon.currentEvent && !lastOutcome}
          onContinue={advanceDungeon}
          onExit={onExit}
        />
      </Flex>
      
      <InfoSidebar party={party} />
    </Flex>
  )
}
