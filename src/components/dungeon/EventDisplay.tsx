import { Box, VStack, Heading, Text, Button, HStack, Badge } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import type { DungeonEvent, EventChoice } from '@/types'
import { checkRequirements } from '@systems/events/eventResolver'
import type { Hero } from '@/types'

const MotionButton = motion.create(Button)
const MotionBox = motion.create(Box)

interface EventDisplayProps {
  event: DungeonEvent
  party: Hero[]
  depth: number
  gold: number
  onSelectChoice: (choice: EventChoice) => void
}

const EVENT_TYPE_COLORS: Record<DungeonEvent['type'], string> = {
  combat: 'red',
  treasure: 'yellow',
  choice: 'purple',
  rest: 'green',
  merchant: 'blue',
  trap: 'orange',
  boss: 'pink',
}

export default function EventDisplay({ event, party, depth, gold, onSelectChoice }: EventDisplayProps) {
  return (
    <VStack className="event-display" spacing={3} align="stretch" h="full">
      {/* Event Header */}
      <MotionBox
        className="event-display-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
      >
        <HStack className="event-display-type" mb={1.5}>
          <Badge colorScheme={EVENT_TYPE_COLORS[event.type]} fontSize="xs" px={2} py={0.5}>
            {event.type.toUpperCase()}
          </Badge>
        </HStack>
        <Heading className="event-display-title" size="sm" color="orange.400" mb={2}>
          {event.title}
        </Heading>
        <Text className="event-display-description" fontSize="sm" color="gray.300" lineHeight="short">
          {event.description}
        </Text>
      </MotionBox>

      {/* Choices */}
      <VStack className="event-display-choices" spacing={2} align="stretch" flex={1}>
        <Heading size="sm" color="gray.400" fontSize="md">
          What will you do?
        </Heading>
        {event.choices.map((choice, index) => {
          const canSelect = checkRequirements(choice.requirements, party, depth, gold)
          
          return (
            <MotionButton
              className={`event-display-choice ${canSelect ? 'event-display-choice--enabled' : 'event-display-choice--disabled'}`}
              key={index}
              size="sm"
              variant="outline"
              colorScheme={canSelect ? 'orange' : 'gray'}
              isDisabled={!canSelect}
              onClick={() => onSelectChoice(choice)}
              textAlign="left"
              whiteSpace="normal"
              height="auto"
              py={3}
              px={4}
              justifyContent="flex-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: canSelect ? 1 : 0.4, x: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: "easeOut"
              }}
              _hover={canSelect ? {
                backgroundColor: 'rgba(237, 137, 54, 0.2)',
                borderColor: '#ED8936',
                boxShadow: '0 0 12px rgba(237, 137, 54, 0.4)',
                paddingLeft: '20px',
                transition: 'all 0.2s ease-out'
              } : undefined}
              sx={{
                transition: 'background-color 0.2s, border-color 0.2s, box-shadow 0.2s, padding 0.2s'
              }}
            >
              <VStack align="start" spacing={0.5}>
                <Text fontWeight="bold" fontSize="sm">
                  {choice.text}
                </Text>
                {choice.requirements && (
                  <Text fontSize="xs" color={canSelect ? 'gray.400' : 'red.400'}>
                    {getRequirementText(choice.requirements, depth)}
                  </Text>
                )}
              </VStack>
            </MotionButton>
          )
        })}
      </VStack>
    </VStack>
  )
}

function getRequirementText(requirements: EventChoice['requirements'], depth: number): string {
  if (!requirements) return ''
  
  const parts: string[] = []
  
  if (requirements.class) {
    parts.push(`Requires ${requirements.class}`)
  }
  
  if (requirements.stat && requirements.minValue) {
    // Show scaled requirement value
    const scaledValue = Math.floor(requirements.minValue * (1 + (depth - 1) * 0.05))
    parts.push(`Requires any hero with ${requirements.stat} ≥ ${scaledValue}`)
  }
  
  if (requirements.gold !== undefined) {
    // Show scaled gold requirement
    const scaledGold = Math.floor(requirements.gold * (1 + (depth - 1) * 0.15))
    parts.push(`Requires ${scaledGold} gold`)
  }
  
  if (requirements.item) {
    parts.push(`Requires ${requirements.item}`)
  }
  
  return parts.join(' • ')
}
