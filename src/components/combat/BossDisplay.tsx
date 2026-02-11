/**
 * Boss Display Component - Epic Boss Visual with Health Bar
 * 
 * Large, prominent boss display with health bar, phase indicators, and effects
 */

import { Box, VStack, HStack, Text, Progress, Badge, Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useMemo, useEffect, useState } from 'react'
import type { DungeonEvent, BossCombatState } from '@/types'
import * as GameIcons from 'react-icons/gi'
import { GiSkullCrossedBones, GiCrownedSkull, GiDragonHead } from 'react-icons/gi'

const MotionBox = motion.create(Box)
const MotionProgress = motion.create(Progress)

interface BossDisplayProps {
    event: DungeonEvent
    combatState: BossCombatState
    onPhaseChange?: (phase: number) => void
}

export default function BossDisplay({ event, combatState, onPhaseChange }: BossDisplayProps) {
    const [previousPhase, setPreviousPhase] = useState(combatState.currentPhase)
    const [shake, setShake] = useState(false)

    // Detect phase changes
    useEffect(() => {
        if (combatState.currentPhase !== previousPhase) {
            setPreviousPhase(combatState.currentPhase)
            setShake(true)
            onPhaseChange?.(combatState.currentPhase)
            setTimeout(() => setShake(false), 500)
        }
    }, [combatState.currentPhase, previousPhase, onPhaseChange])

    // Calculate health percentage
    const healthPercent = useMemo(() => {
        return (combatState.currentHp / combatState.maxHp) * 100
    }, [combatState.currentHp, combatState.maxHp])

    // Determine boss tier for styling based on event type and stats
    const isFinalBoss = event.id.includes('final') || combatState.maxHp > 1500
    const isZoneBoss = event.id.includes('zone') || event.id.includes('major') || combatState.maxHp > 400
    const tierColor = isFinalBoss ? 'red' : isZoneBoss ? 'purple' : 'pink'

    // Boss icon - safely get from GameIcons
    const iconName = typeof event.icon === 'string' ? event.icon : event.icon?.name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const BossIcon = iconName && (GameIcons as any)[iconName] ? (GameIcons as any)[iconName] : GiSkullCrossedBones
    const TierIcon = isFinalBoss ? GiDragonHead : isZoneBoss ? GiCrownedSkull : GiSkullCrossedBones

    // Dynamic color scheme based on health
    const healthColor = healthPercent > 60 ? 'green' : healthPercent > 30 ? 'yellow' : 'red'

    // Boss tier glow color
    const glowColor = isFinalBoss
        ? 'rgba(220, 38, 38, 0.8)'
        : isZoneBoss
            ? 'rgba(196, 67, 224, 0.6)'
            : 'rgba(236, 72, 153, 0.5)'

    // Current phase info
    const currentPhase = combatState.phases?.find(p => p.phase === combatState.currentPhase)

    return (
        <MotionBox
            className="boss-display"
            w="full"
            bg="blackAlpha.700"
            borderWidth="3px"
            borderColor={`${tierColor}.500`}
            borderRadius="xl"
            p={6}
            boxShadow={`0 0 40px ${glowColor}, inset 0 0 30px ${glowColor}`}
            position="relative"
            overflow="hidden"
            animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
        >
            {/* Background Glow Effect */}
            <Box
                position="absolute"
                top="-50%"
                left="-50%"
                right="-50%"
                bottom="-50%"
                bgGradient={`radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 70%)`}
                opacity={0.3}
                pointerEvents="none"
                animation="pulse 3s ease-in-out infinite"
            />

            <VStack spacing={4} position="relative" zIndex={1}>
                {/* Boss Header */}
                <HStack w="full" justify="space-between" align="start">
                    {/* Boss Info */}
                    <HStack spacing={4} flex={1}>
                        {/* Boss Icon */}
                        <Box
                            position="relative"
                            bg={`${tierColor}.900`}
                            borderRadius="lg"
                            p={4}
                            borderWidth="2px"
                            borderColor={`${tierColor}.500`}
                            boxShadow={`0 0 20px ${glowColor}`}
                        >
                            <Icon
                                as={BossIcon}
                                boxSize={16}
                                color={`${tierColor}.300`}
                                filter="drop-shadow(0 0 8px currentColor)"
                            />
                            {/* Tier Badge Overlay */}
                            <Box
                                position="absolute"
                                bottom={-2}
                                right={-2}
                                bg={`${tierColor}.700`}
                                borderRadius="full"
                                p={1}
                                borderWidth="2px"
                                borderColor={`${tierColor}.400`}
                            >
                                <Icon as={TierIcon} boxSize={4} color={`${tierColor}.200`} />
                            </Box>
                        </Box>

                        {/* Name and Stats */}
                        <VStack align="start" spacing={1} flex={1}>
                            <HStack>
                                <Text
                                    fontSize="3xl"
                                    fontWeight="bold"
                                    color="white"
                                    textShadow={`0 0 10px ${glowColor}, 0 2px 4px black`}
                                    letterSpacing="wide"
                                >
                                    {event.title}
                                </Text>
                                {currentPhase && (
                                    <Badge
                                        colorScheme={tierColor}
                                        fontSize="md"
                                        px={3}
                                        py={1}
                                        borderRadius="md"
                                        boxShadow={`0 0 10px ${glowColor}`}
                                    >
                                        Phase {combatState.currentPhase}
                                    </Badge>
                                )}
                            </HStack>

                            {/* Boss Tier Badge */}
                            <Badge
                                colorScheme={tierColor}
                                fontSize="sm"
                                textTransform="uppercase"
                                letterSpacing="wider"
                            >
                                {isFinalBoss ? '👑 Final Boss' : isZoneBoss ? '⚔️ Zone Boss' : '🛡️ Floor Boss'}
                            </Badge>

                            {/* Boss Stats */}
                            <HStack spacing={6} mt={1}>
                                <HStack spacing={1}>
                                    <Text fontSize="sm" color="gray.400">ATK:</Text>
                                    <Text fontSize="sm" fontWeight="bold" color="red.300">
                                        {combatState.baseStats.attack}
                                    </Text>
                                </HStack>
                                <HStack spacing={1}>
                                    <Text fontSize="sm" color="gray.400">DEF:</Text>
                                    <Text fontSize="sm" fontWeight="bold" color="blue.300">
                                        {combatState.baseStats.defense}
                                    </Text>
                                </HStack>
                                <HStack spacing={1}>
                                    <Text fontSize="sm" color="gray.400">SPD:</Text>
                                    <Text fontSize="sm" fontWeight="bold" color="green.300">
                                        {combatState.baseStats.speed}
                                    </Text>
                                </HStack>
                            </HStack>
                        </VStack>
                    </HStack>

                    {/* Combat Depth Badge */}
                    <Badge
                        colorScheme="orange"
                        fontSize="lg"
                        px={4}
                        py={2}
                        borderRadius="lg"
                    >
                        Round {combatState.combatDepth}
                    </Badge>
                </HStack>

                {/* Health Bar Section */}
                <VStack w="full" spacing={2}>
                    {/* HP Numbers */}
                    <HStack w="full" justify="space-between">
                        <Text fontSize="xl" fontWeight="bold" color="white">
                            HP
                        </Text>
                        <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color={`${healthColor}.300`}
                            textShadow="0 0 8px currentColor"
                        >
                            {combatState.currentHp.toLocaleString()} / {combatState.maxHp.toLocaleString()}
                        </Text>
                    </HStack>

                    {/* Epic Health Bar */}
                    <Box w="full" position="relative">
                        <MotionProgress
                            value={healthPercent}
                            size="lg"
                            colorScheme={healthColor}
                            bg="gray.900"
                            borderRadius="full"
                            h="40px"
                            boxShadow="inset 0 2px 8px rgba(0, 0, 0, 0.8)"
                            sx={{
                                '& > div': {
                                    transition: 'width 0.5s ease-out',
                                    background: healthPercent > 60
                                        ? 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)'
                                        : healthPercent > 30
                                            ? 'linear-gradient(90deg, #eab308 0%, #ca8a04 100%)'
                                            : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                                    boxShadow: '0 0 20px currentColor',
                                }
                            }}
                            animate={{
                                boxShadow: healthPercent < 30
                                    ? ['0 0 10px rgba(239, 68, 68, 0.5)', '0 0 20px rgba(239, 68, 68, 0.8)', '0 0 10px rgba(239, 68, 68, 0.5)']
                                    : 'none'
                            }}
                            // @ts-ignore - framer motion types
                            transition={healthPercent < 30 ? { repeat: Infinity, duration: 1.5 } : {}}
                        />

                        {/* Percentage Text Overlay */}
                        <Text
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            fontSize="lg"
                            fontWeight="bold"
                            color="white"
                            textShadow="0 2px 4px black, 0 0 8px black"
                            pointerEvents="none"
                        >
                            {healthPercent.toFixed(1)}%
                        </Text>
                    </Box>

                    {/* Phase Thresholds Indicator */}
                    {combatState.phases && combatState.phases.length > 0 && (
                        <HStack w="full" justify="space-around" spacing={2}>
                            {combatState.phases.map((phase) => {
                                const isPastPhase = combatState.currentPhase > phase.phase
                                const isCurrentPhase = combatState.currentPhase === phase.phase

                                return (
                                    <Badge
                                        key={phase.phase}
                                        colorScheme={isPastPhase ? 'gray' : isCurrentPhase ? tierColor : 'whiteAlpha'}
                                        fontSize="xs"
                                        variant={isCurrentPhase ? 'solid' : 'outline'}
                                        opacity={isPastPhase ? 0.5 : 1}
                                    >
                                        Phase {phase.phase} ({phase.hpThreshold}%)
                                    </Badge>
                                )
                            })}
                        </HStack>
                    )}
                </VStack>

                {/* Active Effects */}
                {combatState.activeEffects && combatState.activeEffects.length > 0 && (
                    <HStack w="full" spacing={2} flexWrap="wrap">
                        <Text fontSize="sm" color="gray.400">Effects:</Text>
                        {combatState.activeEffects.slice(0, 6).map((effect) => (
                            <Badge
                                key={effect.id}
                                colorScheme={effect.type === 'buff' ? 'green' : effect.type === 'debuff' ? 'red' : 'blue'}
                                fontSize="xs"
                                display="flex"
                                alignItems="center"
                                gap={1}
                            >
                                {effect.name} ({effect.duration || '∞'})
                            </Badge>
                        ))}
                        {combatState.activeEffects.length > 6 && (
                            <Badge colorScheme="gray" fontSize="xs">
                                +{combatState.activeEffects.length - 6} more
                            </Badge>
                        )}
                    </HStack>
                )}
            </VStack>
        </MotionBox>
    )
}
