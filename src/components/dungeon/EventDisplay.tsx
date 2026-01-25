import { Box, VStack, Heading, Text, Button, HStack, Badge } from '@chakra-ui/react'
import type { DungeonEvent, EventChoice } from '@/types'
import { checkRequirements } from '@systems/events/eventResolver'
import type { Hero } from '@/types'

interface EventDisplayProps {
  event: DungeonEvent
  party: Hero[]
  depth: number
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

export default function EventDisplay({ event, party, depth, onSelectChoice }: EventDisplayProps) {
  return (
    <VStack spacing={2} align="stretch" flex={1}>
      {/* Event Header */}
      <Box>
        <HStack mb={2}>
          <Badge colorScheme={EVENT_TYPE_COLORS[event.type]} fontSize="sm" px={3} py={1}>
            {event.type.toUpperCase()}
          </Badge>
        </HStack>
        <Heading size="md" color="orange.400" mb={3}>
          {event.title}
        </Heading>
        <Text fontSize="md" color="gray.300" lineHeight="tall">
          {event.description}
        </Text>
      </Box>

      {/* Choices */}
      <VStack spacing={3} align="stretch">
        <Heading size="md" color="gray.400">
          What will you do?
        </Heading>
        {event.choices.map((choice, index) => {
          const canSelect = checkRequirements(choice.requirements, party, depth)
          
          return (
            <Button
              key={index}
              size="md"
              variant="outline"
              colorScheme={canSelect ? 'orange' : 'gray'}
              isDisabled={!canSelect}
              onClick={() => onSelectChoice(choice)}
              textAlign="left"
              whiteSpace="normal"
              height="auto"
              py={4}
              px={6}
              justifyContent="flex-start"
              _hover={canSelect ? {
                bg: 'orange.900',
                borderColor: 'orange.400',
                transform: 'translateX(4px)'
              } : undefined}
              transition="all 0.2s"
            >
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" fontSize="md">
                  {choice.text}
                </Text>
                {choice.requirements && (
                  <Text fontSize="sm" color={canSelect ? 'gray.400' : 'red.400'}>
                    {getRequirementText(choice.requirements, depth)}
                  </Text>
                )}
              </VStack>
            </Button>
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
  
  if (requirements.item) {
    parts.push(`Requires ${requirements.item}`)
  }
  
  return parts.join(' • ')
}
