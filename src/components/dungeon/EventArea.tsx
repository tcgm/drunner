import { Box } from '@chakra-ui/react'
import EventDisplay from './EventDisplay'
import OutcomeDisplay from './OutcomeDisplay'
import ContinuePrompt from './ContinuePrompt'
import type { DungeonEvent, EventChoice, Hero } from '@/types'
import type { ResolvedOutcome } from '@systems/events/eventResolver'

interface EventAreaProps {
  currentEvent: DungeonEvent | null
  currentOutcome: ResolvedOutcome | null
  party: Hero[]
  depth: number
  onSelectChoice: (choice: EventChoice) => void
  onContinue: () => void
  onAdvance: () => void
}

export default function EventArea({ 
  currentEvent, 
  currentOutcome, 
  party, 
  depth,
  onSelectChoice, 
  onContinue,
  onAdvance
}: EventAreaProps) {
  return (
    <Box 
      flex={1} 
      bg="gray.800" 
      borderRadius="lg" 
      p={2}
      display="flex"
      flexDirection="column"
      minH={0}
      position="relative"
      backgroundImage="radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.05) 0%, transparent 50%)"
      overflowY="auto"
    >
      {currentOutcome ? (
        <OutcomeDisplay 
          outcome={currentOutcome} 
          onContinue={onContinue}
        />
      ) : currentEvent ? (
        <EventDisplay 
          event={currentEvent} 
          party={party}
          depth={depth}
          onSelectChoice={onSelectChoice}
        />
      ) : (
        <ContinuePrompt onContinue={onAdvance} />
      )}
    </Box>
  )
}
