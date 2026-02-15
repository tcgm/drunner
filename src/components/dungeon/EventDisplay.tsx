import './EventDisplay.css'
import { Box, VStack, Heading, Text, Button, HStack, Badge, Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { DungeonEvent, EventChoice } from '@/types'
import { checkRequirements } from '@systems/events/eventResolver'
import type { Hero } from '@/types'
import { calculateTotalStats } from '@/utils/statCalculator'
import { GAME_CONFIG } from '@/config/gameConfig'
import { GiCrossedSwords, GiSkullCrossedBones } from 'react-icons/gi'

const MotionButton = motion.create(Button)
const MotionBox = motion.create(Box)

interface EventDisplayProps {
  event: DungeonEvent
  party: Hero[]
  depth: number
  gold: number
  bossType?: 'floor' | 'major' | null
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

/**
 * Select text from string or weighted text variations
 */
function selectText(text: string | string[] | Array<{ weight: number; text: string }>): string {
  if (typeof text === 'string') {
    return text
  }
  
  // Convert string array to weighted format (equal weight)
  const weighted = Array.isArray(text) && text.length > 0 && typeof text[0] === 'string'
    ? (text as string[]).map(t => ({ weight: 1, text: t }))
    : text as Array<{ weight: number; text: string }>
  
  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0)
  let roll = Math.random() * totalWeight
  
  for (const item of weighted) {
    roll -= item.weight
    if (roll <= 0) {
      return item.text
    }
  }
  
  return weighted[weighted.length - 1].text // Fallback to last option
}

export default function EventDisplay({ event, party, depth, gold, bossType, onSelectChoice }: EventDisplayProps) {
  // Select description text once when event loads
  const description = useMemo(() => selectText(event.description), [event.description])
  
  // Determine danger level for boss styling
  const isFloorBoss = bossType === 'floor'
  const isZoneBoss = bossType === 'major'
  const isDangerous = isFloorBoss || isZoneBoss

  return (
    <VStack className="event-display" spacing={3} align="stretch" h="full" overflow="hidden">
      {/* Event Header */}
      <MotionBox
        className="event-display-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
        // Boss styling - dramatic danger appearance
        bg={
          isZoneBoss 
            ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(153, 27, 27, 0.4) 100%)'
            : isFloorBoss
              ? 'linear-gradient(135deg, rgba(196, 67, 224, 0.25) 0%, rgba(126, 34, 206, 0.3) 100%)'
              : 'transparent'
        }
        borderWidth={isDangerous ? '3px' : '0'}
        borderColor={
          isZoneBoss 
            ? 'red.500' 
            : isFloorBoss 
              ? 'purple.500' 
              : 'transparent'
        }
        borderRadius={isDangerous ? 'lg' : 'none'}
        p={isDangerous ? 4 : 0}
        pt={isDangerous ? 2 : 0}
        boxShadow={
          isZoneBoss 
            ? '0 0 30px rgba(220, 38, 38, 0.6), inset 0 0 20px rgba(220, 38, 38, 0.2)'
            : isFloorBoss
              ? '0 0 20px rgba(196, 67, 224, 0.5), inset 0 0 15px rgba(196, 67, 224, 0.15)'
              : 'none'
        }
        position="relative"
        _before={isZoneBoss ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(220, 38, 38, 0.4) 50%, transparent 100%)',
          animation: 'pulse 2s ease-in-out infinite',
          borderRadius: 'lg',
          pointerEvents: 'none'
        } : undefined}
      >
        {/* Floating Boss Labels - positioned to overlap top border */}
        {isFloorBoss && (
          <Badge 
            className="event-display-boss-badge event-display-boss-badge--floor"
            position="absolute"
            top="-14px"
            left="50%"
            transform="translateX(-50%)"
            zIndex={10}
            colorScheme="purple" 
            fontSize="md" 
            px={3} 
            py={1} 
            variant="solid"
            boxShadow="0 0 10px rgba(196, 67, 224, 0.6)"
            display="flex"
            alignItems="center"
            gap={1.5}
          >
            <Icon className="event-display-boss-icon" as={GiCrossedSwords} boxSize={4} />
            FLOOR BOSS
            <Icon className="event-display-boss-icon" as={GiCrossedSwords} boxSize={4} />
          </Badge>
        )}
        {isZoneBoss && (
          <Badge 
            className="event-display-boss-badge event-display-boss-badge--zone"
            position="absolute"
            top="-18px"
            left="50%"
            transform="translateX(-50%)"
            zIndex={10}
            colorScheme="red" 
            fontSize="lg" 
            px={4} 
            py={1} 
            variant="solid"
            boxShadow="0 0 20px rgba(220, 38, 38, 0.8)"
            fontWeight="black"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Icon className="event-display-boss-icon" as={GiSkullCrossedBones} boxSize={5} />
            ZONE BOSS
            <Icon className="event-display-boss-icon" as={GiSkullCrossedBones} boxSize={5} />
          </Badge>
        )}
      
        <HStack className="event-display-type" justify="flex-start" w="full" mb={1.5}>
          {!isDangerous && (
            <Badge 
              className="event-display-type-badge"
              colorScheme={EVENT_TYPE_COLORS[event.type]} 
              fontSize="xs" 
              px={2} 
              py={0.5}
            >
              {event.type.toUpperCase()}
            </Badge>
          )}
        </HStack>
        <HStack 
          className="event-display-title-container"
          spacing={3} 
          align="center" 
          justify={isDangerous ? "center" : "flex-start"}
          mb={1}
          w="full"
        >
          {event.icon && (
            <Icon 
              className="event-display-icon"
              as={event.icon} 
              boxSize={isDangerous ? 12 : 8} 
              color={
                isZoneBoss 
                  ? 'red.400' 
                  : isFloorBoss 
                    ? 'purple.400' 
                    : 'orange.400'
              }
              flexShrink={0}
              filter={
                isZoneBoss 
                  ? 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.8))'
                  : isFloorBoss
                    ? 'drop-shadow(0 0 6px rgba(196, 67, 224, 0.6))'
                    : 'none'
              }
            />
          )}
          <Heading 
            className="event-display-title" 
            size={isDangerous ? 'lg' : 'sm'} 
            color={
              isZoneBoss 
                ? 'red.300' 
                : isFloorBoss 
                  ? 'purple.300' 
                  : 'orange.400'
            }
            textShadow={
              isZoneBoss 
                ? '0 0 10px rgba(220, 38, 38, 0.8)' 
                : isFloorBoss
                  ? '0 0 8px rgba(196, 67, 224, 0.6)'
                  : 'none'
            }
            fontWeight={isDangerous ? 'black' : 'bold'}
            textAlign={isDangerous ? 'center' : 'left'}
          >
            {event.title}
          </Heading>
        </HStack>
        <Box 
          className="event-display-description-container"
          maxH="150px"
          overflowY="auto"
          pr={2}
          css={{
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(237, 137, 54, 0.4)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(237, 137, 54, 0.6)',
            },
          }}
        >
          <Text 
            className="event-display-description" 
            fontSize={isDangerous ? 'md' : 'sm'} 
            color={isDangerous ? 'gray.200' : 'gray.300'} 
            lineHeight="short"
            fontWeight={isDangerous ? 'semibold' : 'normal'}
          >
            {description}
          </Text>
        </Box>
      </MotionBox>

      {/* Choices */}
      <Heading className="event-display-choices-heading" size="sm" color="gray.400" fontSize="md" mb={0.5} flexShrink={0}>
        What will you do?
      </Heading>
      <VStack 
        className="event-display-choices" 
        spacing={2} 
        align="stretch" 
        flex={1} 
        minH={0} 
        overflowY="auto"
        pr={1}
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(237, 137, 54, 0.5)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(237, 137, 54, 0.7)',
          },
        }}
      >
        {/* Sort choices: available first, unavailable last */}
        {[...event.choices]
          .map((choice, originalIndex) => ({ choice, originalIndex }))
          .sort((a, b) => {
            const canSelectA = checkRequirements(a.choice.requirements, party, depth, gold)
            const canSelectB = checkRequirements(b.choice.requirements, party, depth, gold)
            // Available choices (true) come before unavailable (false)
            if (canSelectA === canSelectB) return 0
            return canSelectA ? -1 : 1
          })
          .map(({ choice, originalIndex }, index) => {
          const canSelect = checkRequirements(choice.requirements, party, depth, gold)
          const successChance = calculateSuccessChance(choice, party)
          
          return (
            <MotionButton
              className={`event-display-choice ${canSelect ? 'event-display-choice--enabled' : 'event-display-choice--disabled'}`}
              key={originalIndex}
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
              <VStack className="event-display-choice-content" align="start" spacing={0.5}>
                <HStack className="event-display-choice-header" justify="space-between" w="full">
                  <Text className="event-display-choice-text" fontWeight="bold" fontSize="sm">
                    {choice.text}
                  </Text>
                  {successChance !== null && (
                    <Badge 
                      className="event-display-choice-chance"
                      colorScheme={
                        successChance >= 0.75 ? 'green' : 
                        successChance >= 0.5 ? 'yellow' : 
                        successChance >= 0.25 ? 'orange' : 'red'
                      }
                      fontSize="xs"
                    >
                      {Math.round(successChance * 100)}%
                    </Badge>
                  )}
                </HStack>
                {choice.requirements && (
                  <Text className="event-display-choice-requirements" fontSize="xs" color={canSelect ? 'gray.400' : 'red.400'}>
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

function calculateSuccessChance(choice: EventChoice, party: (Hero | null)[]): number | null {
  // Only calculate for choices with success/failure outcomes
  if (!choice.successOutcome || !choice.failureOutcome) {
    return null
  }

  const baseChance = choice.successChance || GAME_CONFIG.chances.defaultSuccess
  let finalChance = baseChance

  // Apply stat modifier if specified
  if (choice.statModifier) {
    const aliveHeroes = party.filter((h): h is Hero => h !== null && h.isAlive)
    if (aliveHeroes.length > 0) {
      // Use the highest stat value among alive heroes
      // Use effective stats (includes equipment and active effect bonuses)
      const maxStat = Math.max(...aliveHeroes.map(h => {
        const effectiveStats = calculateTotalStats(h)
        return effectiveStats[choice.statModifier!] || 0
      }))
      // Calculate final chance with stat bonus
      finalChance = Math.min(
        GAME_CONFIG.chances.maxSuccess,
        Math.max(
          GAME_CONFIG.chances.minSuccess,
          baseChance + (maxStat * GAME_CONFIG.chances.statBonusPerPoint)
        )
      )
    }
  }

  return finalChance
}

function getRequirementText(requirements: EventChoice['requirements'], depth: number): string {
  if (!requirements) return ''
  
  const parts: string[] = []
  
  if (requirements.class) {
    const classes = Array.isArray(requirements.class) ? requirements.class : [requirements.class]
    if (classes.length === 1) {
      parts.push(`Requires ${classes[0]}`)
    } else {
      parts.push(`Requires ${classes.join(' or ')}`)
    }
  }
  
  if (requirements.stat && requirements.minValue) {
    // Show scaled requirement value
    const scaledValue = Math.floor(requirements.minValue * (1 + (depth - 1) * GAME_CONFIG.scaling.statRequirements))
    parts.push(`Requires any hero with ${requirements.stat} ≥ ${scaledValue}`)
  }
  
  if (requirements.gold !== undefined) {
    // Show scaled gold requirement
    const scaledGold = Math.floor(requirements.gold * (1 + (depth - 1) * GAME_CONFIG.scaling.rewards))
    parts.push(`Requires ${scaledGold} gold`)
  }
  
  if (requirements.item) {
    parts.push(`Requires ${requirements.item}`)
  }
  
  return parts.join(' • ')
}
