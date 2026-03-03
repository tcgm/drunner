/**
 * Turn Order Display Component - Speed-Based Turn Queue
 * 
 * Shows the initiative order for boss and heroes
 */

import { Box, VStack, HStack, Text, Icon, Badge } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import type { Hero, BossCombatState } from '@/types'
import * as GameIcons from 'react-icons/gi'
import { GiSkullCrossedBones } from 'react-icons/gi'

const MotionBox = motion.create(Box)

interface TurnOrderDisplayProps {
    combatState: BossCombatState
    party: Hero[]
}

export default function TurnOrderDisplay({ combatState, party }: TurnOrderDisplayProps) {
    const turnOrder = combatState.turnOrder || []
    const currentIndex = combatState.currentTurnIndex || 0

    return (
        <Box
            className="turn-order-display"
            bg="blackAlpha.700"
            borderWidth="2px"
            borderColor="purple.600"
            borderRadius="lg"
            p={4}
            h="full"
            boxShadow="0 0 20px rgba(147, 51, 234, 0.4)"
        >
            <VStack spacing={3} align="stretch" h="full">
                {/* Header */}
                <VStack spacing={1}>
                    <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color="purple.300"
                        textAlign="center"
                        letterSpacing="wider"
                    >
                        ⚡ TURN ORDER
                    </Text>
                    <Text fontSize="xs" color="gray.400" textAlign="center">
                        Speed-Based Initiative
                    </Text>
                </VStack>

                {/* Turn Queue */}
                <VStack spacing={2} flex={1} overflow="auto" align="stretch">
                    {turnOrder.length === 0 ? (
                        <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
                            Calculating turn order...
                        </Text>
                    ) : (
                        turnOrder.map((combatant, index) => {
                            const isBoss = combatant.id === 'boss'
                            const hero = isBoss ? null : party.find(h => h.id === combatant.id)
                            const isCurrent = index === currentIndex
                            const isPast = index < currentIndex

                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const CombatantIcon = isBoss
                                ? GiSkullCrossedBones
                                : hero
                                    ? (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman
                                    : GameIcons.GiSwordman

                            return (
                                <MotionBox
                                    key={`${combatant.id}-${index}`}
                                    bg={isCurrent ? 'purple.900' : isPast ? 'gray.900' : 'gray.800'}
                                    borderWidth="2px"
                                    borderColor={isCurrent ? 'yellow.400' : isPast ? 'gray.700' : isBoss ? 'red.600' : 'blue.600'}
                                    borderRadius="md"
                                    p={2}
                                    opacity={isPast ? 0.5 : 1}
                                    boxShadow={isCurrent ? '0 0 15px rgba(250, 204, 21, 0.6)' : 'none'}
                                    position="relative"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: isPast ? 0.5 : 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    {/* Current Turn Indicator */}
                                    {isCurrent && (
                                        <Box
                                            position="absolute"
                                            top={0}
                                            left={0}
                                            right={0}
                                            h="clamp(1px, 0.2vh, 3px)"
                                            bgGradient="linear(to-r, yellow.400, orange.400, yellow.400)"
                                            animation="shimmer 2s linear infinite"
                                        />
                                    )}

                                    <HStack spacing={2} justify="space-between">
                                        {/* Position Number */}
                                        <Badge
                                            colorScheme={isCurrent ? 'yellow' : isPast ? 'gray' : 'purple'}
                                            fontSize="xs"
                                            w="clamp(20px, 2vw, 28px)"
                                            h="clamp(20px, 2vw, 28px)"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            borderRadius="full"
                                        >
                                            {index + 1}
                                        </Badge>

                                        {/* Icon & Name */}
                                        <HStack flex={1} spacing={2} minW={0}>
                                            <Icon
                                                as={CombatantIcon}
                                                boxSize={5}
                                                color={isBoss ? 'red.400' : 'blue.300'}
                                            />
                                            <VStack spacing={0} align="start" flex={1} minW={0}>
                                                <Text
                                                    fontSize="xs"
                                                    fontWeight="bold"
                                                    color="white"
                                                    noOfLines={1}
                                                >
                                                    {isBoss ? 'BOSS' : hero?.name || 'Hero'}
                                                </Text>
                                                {!isBoss && hero && (
                                                    <Text fontSize="2xs" color="gray.400">
                                                        {hero.class.name}
                                                    </Text>
                                                )}
                                            </VStack>
                                        </HStack>

                                        {/* Speed */}
                                        <VStack spacing={0} align="end">
                                            <Text fontSize="2xs" color="gray.500">SPD</Text>
                                            <Text fontSize="xs" fontWeight="bold" color="green.300">
                                                {combatant.speed}
                                            </Text>
                                        </VStack>
                                    </HStack>

                                    {/* Current Turn Label */}
                                    {isCurrent && (
                                        <Text
                                            position="absolute"
                                            bottom={-2}
                                            right={2}
                                            fontSize="2xs"
                                            color="yellow.400"
                                            fontWeight="bold"
                                            textTransform="uppercase"
                                            letterSpacing="wider"
                                        >
                                            Active →
                                        </Text>
                                    )}
                                </MotionBox>
                            )
                        })
                    )}
                </VStack>

                {/* Round Info */}
                <Box
                    bg="purple.900"
                    borderRadius="md"
                    p={2}
                    borderWidth="1px"
                    borderColor="purple.600"
                >
                    <Text fontSize="xs" color="purple.200" textAlign="center">
                        {currentIndex >= turnOrder.length
                            ? `Round Complete`
                            : `Turn ${currentIndex + 1} / ${turnOrder.length}`
                        }
                    </Text>
                </Box>
            </VStack>
        </Box>
    )
}
