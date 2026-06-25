import './EventArea.css'
import { Box } from '@chakra-ui/react'
import EventDisplay from './EventDisplay'
import OutcomeDisplay from './OutcomeDisplay'
import ContinuePrompt from './ContinuePrompt'
import FloorMapScreen from './FloorMapScreen'
import type { DungeonEvent, EventChoice, FloorMap, Hero } from '@/types'
import type { ResolvedOutcome } from '@systems/events/eventResolver'
import type { VoteState, NodeVoteState } from '@/multiplayer/types'

interface EventAreaProps {
  currentEvent: DungeonEvent | null
  currentOutcome: ResolvedOutcome | null
  party: Hero[]
  depth: number
  gold: number
  bossType?: 'floor' | 'major' | null
  floorMap?: FloorMap | null
  floor?: number
  onSelectChoice: (choice: EventChoice) => void
  onContinue: () => void
  onAdvance: () => void
  onSelectMapNode?: (nodeId: string) => void
  voteState?: VoteState | null
  nodeVoteState?: NodeVoteState | null
  myPlayerId?: string
}

export default function EventArea({ 
  currentEvent, 
  currentOutcome, 
  party, 
  depth,
  gold,
  bossType,
  floorMap,
  floor = 1,
  onSelectChoice, 
  onContinue,
  onAdvance,
  onSelectMapNode,
  voteState,
  nodeVoteState,
  myPlayerId,
}: EventAreaProps) {
  // Trap detection: true when any alive party member is a Rogue or has a
  // trap-detection ability (hook for future research / passive skill system).
  const canDetectTraps = party.some(
    (hero) =>
      hero.isAlive &&
      (hero.class.id === 'rogue' ||
        hero.abilities.some((a) => a.id === 'trap_detection'))
  )

  // Determine background based on boss type
  const isZoneBoss = bossType === 'major'
  const isFloorBoss = bossType === 'floor'
  
  const backgroundGradient = isZoneBoss
    ? 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.2) 0%, rgba(153, 27, 27, 0.1) 40%, transparent 70%)'
    : isFloorBoss
      ? 'radial-gradient(circle at 50% 50%, rgba(196, 67, 224, 0.15) 0%, rgba(126, 34, 206, 0.08) 40%, transparent 70%)'
      : 'radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.05) 0%, transparent 50%)'
  
  return (
    <Box 
      className="event-area"
      flex={1} 
      bg="gray.800" 
      borderRadius="lg" 
      p={2}
      display="flex"
      flexDirection="column"
      minH={0}
      position="relative"
      backgroundImage={backgroundGradient}
      overflowY="auto"
      borderWidth={isZoneBoss ? '2px' : isFloorBoss ? '1px' : '0'}
      borderColor={isZoneBoss ? 'red.600' : isFloorBoss ? 'purple.600' : 'transparent'}
      boxShadow={
        isZoneBoss 
          ? '0 0 25px rgba(220, 38, 38, 0.4), inset 0 0 40px rgba(220, 38, 38, 0.1)'
          : isFloorBoss
            ? '0 0 15px rgba(196, 67, 224, 0.3), inset 0 0 25px rgba(196, 67, 224, 0.08)'
            : 'none'
      }
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
          gold={gold}
          bossType={bossType}
          onSelectChoice={onSelectChoice}
          voteState={voteState}
          myPlayerId={myPlayerId}
        />
      ) : floorMap && onSelectMapNode ? (
        <FloorMapScreen
          floorMap={floorMap}
          floor={floor}
          onSelectNode={onSelectMapNode}
          canDetectTraps={canDetectTraps}
          nodeVoteState={nodeVoteState}
          myPlayerId={myPlayerId}
        />
      ) : (
        <ContinuePrompt onContinue={onAdvance} />
      )}
    </Box>
  )
}
