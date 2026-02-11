/**
 * Party Health Display Component - Hero Health Bars for Combat
 * 
 * Displays all party members with health bars, effects, and positioning
 */

import { Box, HStack, VStack, Text, Progress, Badge, Icon, Tooltip } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { Hero, BossCombatState } from '@/types'
import * as GameIcons from 'react-icons/gi'
import { GiHeartPlus, GiShield, GiSwordWound, GiSkullCrossedBones } from 'react-icons/gi'
import { calculateTotalStats } from '@/utils/statCalculator'

const MotionBox = motion.create(Box)

interface PartyHealthDisplayProps {
    party: Hero[]
    combatState: BossCombatState
}

interface HeroHealthCardProps {
    hero: Hero
    position: 'frontline' | 'backline'
    slotIndex: number
    isActive: boolean
}

function HeroHealthCard({ hero, position, slotIndex, isActive }: HeroHealthCardProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const HeroIcon = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman

    const totalStats = useMemo(() => calculateTotalStats(hero), [hero])
    const healthPercent = (hero.stats.hp / totalStats.maxHp) * 100
    const healthColor = healthPercent > 60 ? 'green' : healthPercent > 30 ? 'yellow' : 'red'

    // Get hero effects
    const effects = hero.combatEffects || []
    const buffs = effects.filter(e => e.type === 'buff')
    const debuffs = effects.filter(e => e.type === 'debuff')

    return (
        <MotionBox
            className={`hero-health-card ${isActive ? 'active' : ''}`}
            bg={hero.isAlive ? 'gray.800' : 'gray.900'}
            borderWidth="2px"
            borderColor={isActive ? 'yellow.400' : hero.isAlive ? 'gray.600' : 'red.900'}
            borderRadius="md"
            p={3}
            opacity={hero.isAlive ? 1 : 0.5}
            boxShadow={isActive ? '0 0 20px rgba(250, 204, 21, 0.6)' : 'none'}
            position="relative"
            overflow="hidden"
            flex={1}
            minW="180px"
            maxW="250px"
            animate={isActive ? {
                boxShadow: ['0 0 20px rgba(250, 204, 21, 0.6)', '0 0 30px rgba(250, 204, 21, 0.8)', '0 0 20px rgba(250, 204, 21, 0.6)']
            } : {}}
            // @ts-ignore - framer motion types
            transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
        >
            {/* Position Badge */}
            <Badge
                position="absolute"
                top={1}
                right={1}
                colorScheme={position === 'frontline' ? 'red' : 'blue'}
                fontSize="2xs"
            >
                {position === 'frontline' ? '⚔️ Front' : '🏹 Back'}
            </Badge>

            {/* Active Turn Indicator */}
            {isActive && (
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="2px"
                    bgGradient="linear(to-r, yellow.400, orange.400, yellow.400)"
                    animation="shimmer 2s linear infinite"
                />
            )}

            <VStack spacing={2} align="stretch">
                {/* Hero Header */}
                <HStack spacing={2}>
                    {/* Icon */}
                    <Box
                        bg={hero.isAlive ? `${hero.class.name.toLowerCase()}.900` : 'gray.900'}
                        borderRadius="md"
                        p={2}
                        borderWidth="1px"
                        borderColor={hero.isAlive ? `${hero.class.name.toLowerCase()}.600` : 'gray.700'}
                    >
                        <Icon
                            as={HeroIcon}
                            boxSize={6}
                            color={hero.isAlive ? `${hero.class.name.toLowerCase()}.300` : 'gray.600'}
                        />
                    </Box>

                    {/* Name & Level */}
                    <VStack align="start" spacing={0} flex={1} minW={0}>
                        <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="white"
                            noOfLines={1}
                        >
                            {hero.name}
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                            {hero.class.name} Lv{hero.level}
                        </Text>
                    </VStack>
                </HStack>

                {/* Health Bar */}
                <VStack spacing={1} align="stretch">
                    <HStack justify="space-between">
                        <Text fontSize="xs" color="gray.400">HP</Text>
                        <Text fontSize="xs" fontWeight="bold" color={`${healthColor}.300`}>
                            {hero.stats.hp} / {totalStats.maxHp}
                        </Text>
                    </HStack>

                    <Progress
                        value={healthPercent}
                        colorScheme={healthColor}
                        size="sm"
                        bg="gray.900"
                        borderRadius="full"
                        sx={{
                            '& > div': {
                                transition: 'width 0.3s ease-out',
                            }
                        }}
                    />
                </VStack>

                {/* Status & Effects */}
                {!hero.isAlive && (
                    <HStack spacing={1} justify="center">
                        <Icon as={GiSkullCrossedBones} boxSize={3} color="red.500" />
                        <Text fontSize="xs" color="red.500" fontWeight="bold">
                            DEFEATED
                        </Text>
                    </HStack>
                )}

                {hero.isAlive && effects.length > 0 && (
                    <HStack spacing={1} flexWrap="wrap">
                        {buffs.slice(0, 2).map((effect) => (
                            <Tooltip key={effect.id} label={`${effect.name}: +${effect.value} (${effect.duration})`}>
                                <Badge colorScheme="green" fontSize="2xs" display="flex" alignItems="center">
                                    <Icon as={GiHeartPlus} boxSize={2} mr={1} />
                                    {effect.stat?.slice(0, 3).toUpperCase()}
                                </Badge>
                            </Tooltip>
                        ))}
                        {debuffs.slice(0, 2).map((effect) => (
                            <Tooltip key={effect.id} label={`${effect.name}: ${effect.value} (${effect.duration})`}>
                                <Badge colorScheme="red" fontSize="2xs" display="flex" alignItems="center">
                                    <Icon as={GiSwordWound} boxSize={2} mr={1} />
                                    {effect.stat?.slice(0, 3).toUpperCase()}
                                </Badge>
                            </Tooltip>
                        ))}
                        {effects.length > 4 && (
                            <Badge colorScheme="gray" fontSize="2xs">
                                +{effects.length - 4}
                            </Badge>
                        )}
                    </HStack>
                )}

                {/* Quick Stats */}
                <HStack spacing={3} fontSize="xs" justify="space-between">
                    <Tooltip label="Attack">
                        <HStack spacing={1}>
                            <Text color="gray.500">⚔️</Text>
                            <Text color="red.300" fontWeight="bold">{totalStats.attack}</Text>
                        </HStack>
                    </Tooltip>
                    <Tooltip label="Defense">
                        <HStack spacing={1}>
                            <Text color="gray.500">🛡️</Text>
                            <Text color="blue.300" fontWeight="bold">{totalStats.defense}</Text>
                        </HStack>
                    </Tooltip>
                    <Tooltip label="Speed">
                        <HStack spacing={1}>
                            <Text color="gray.500">⚡</Text>
                            <Text color="green.300" fontWeight="bold">{totalStats.speed}</Text>
                        </HStack>
                    </Tooltip>
                </HStack>
            </VStack>
        </MotionBox>
    )
}

export default function PartyHealthDisplay({ party, combatState }: PartyHealthDisplayProps) {
    // Determine which hero is active based on turn order
    const activeHeroId = useMemo(() => {
        if (!combatState.turnOrder || combatState.turnOrder.length === 0) return null
        const currentCombatant = combatState.turnOrder[combatState.currentTurnIndex || 0]
        return currentCombatant?.id.startsWith('hero-') ? currentCombatant.id : null
    }, [combatState.turnOrder, combatState.currentTurnIndex])

    // Separate frontline (slots 0-1) and backline (slots 2-3)
    const frontline = party.filter((h, i) => i <= 1)
    const backline = party.filter((h, i) => i > 1)

    return (
        <VStack className="party-health-display" w="full" spacing={3}>
            {/* Frontline */}
            {frontline.length > 0 && (
                <VStack w="full" spacing={2}>
                    <Text fontSize="xs" color="gray.500" fontWeight="bold" letterSpacing="wider">
                        FRONTLINE
                    </Text>
                    <HStack w="full" spacing={3} justify="center">
                        {frontline.map((hero, index) => (
                            <HeroHealthCard
                                key={hero.id}
                                hero={hero}
                                position="frontline"
                                slotIndex={index}
                                isActive={activeHeroId === hero.id}
                            />
                        ))}
                    </HStack>
                </VStack>
            )}

            {/* Backline */}
            {backline.length > 0 && (
                <VStack w="full" spacing={2}>
                    <Text fontSize="xs" color="gray.500" fontWeight="bold" letterSpacing="wider">
                        BACKLINE
                    </Text>
                    <HStack w="full" spacing={3} justify="center">
                        {backline.map((hero, index) => (
                            <HeroHealthCard
                                key={hero.id}
                                hero={hero}
                                position="backline"
                                slotIndex={index + 2}
                                isActive={activeHeroId === hero.id}
                            />
                        ))}
                    </HStack>
                </VStack>
            )}
        </VStack>
    )
}
