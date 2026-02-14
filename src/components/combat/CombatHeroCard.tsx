/**
 * Combat Hero Card - Individual hero display in boss combat
 * 
 * Styled similar to PartyMemberCard but optimized for combat view
 */

import { Box, HStack, VStack, Text, Badge, Icon, Tooltip } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { Hero } from '@/types'
import * as GameIcons from 'react-icons/gi'
import { GiHeartPlus, GiSwordWound, GiSkullCrossedBones, GiSparkles } from 'react-icons/gi'
import { calculateTotalStats } from '@/utils/statCalculator'
import StatBar from '@/components/ui/StatBar'
import { EquipmentPips } from '@/components/party/EquipmentPips'
import type { Item, Consumable } from '@/types'
import { ItemSlot } from '@/components/ui/ItemSlot'
import { restoreItemIcon } from '@/utils/itemUtils'

const MotionBox = motion.create(Box)

interface CombatHeroCardProps {
    hero: Hero
    position: 'frontline' | 'backline'
    slotIndex: number
    isActive: boolean
    onUseConsumable?: (heroId: string, slot: string) => void
}

export function CombatHeroCard({ hero, position, slotIndex, isActive, onUseConsumable }: CombatHeroCardProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const HeroIcon = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman

    const totalStats = useMemo(() => calculateTotalStats(hero), [hero])
    const healthPercent = (hero.stats.hp / totalStats.maxHp) * 100

    // Get hero effects
    const effects = hero.combatEffects || []
    const buffs = effects.filter(e => e.type === 'buff')
    const debuffs = effects.filter(e => e.type === 'debuff')
    const statusEffects = effects.filter(e => e.type === 'status')

    const consumableSlots = ['consumable1', 'consumable2', 'consumable3']

    return (
        <MotionBox
            className={`combat-hero-card ${isActive ? 'active' : ''}`}
            position="relative"
            bg={hero.isAlive ? 'gray.800' : 'gray.900'}
            borderRadius="md"
            borderWidth="2px"
            borderColor={isActive ? 'yellow.400' : hero.isAlive ? 'orange.600' : 'red.900'}
            boxShadow={isActive ? '0 0 20px rgba(250, 204, 21, 0.6)' : 'none'}
            overflow="hidden"
            flex={1}
            minW="clamp(150px, 20vw, 200px)"
            maxW="clamp(220px, 28vw, 320px)"
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
                zIndex={1}
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
                    h="clamp(1px, 0.2vh, 3px)"
                    bgGradient="linear(to-r, yellow.400, orange.400, yellow.400)"
                    animation="shimmer 2s linear infinite"
                />
            )}

            <HStack spacing={2} p={2} opacity={hero.isAlive ? 1 : 0.5}>
                {/* Left: Icon + Equipment Pips */}
                <HStack spacing={1} flexShrink={0}>
                    <Icon
                        as={HeroIcon}
                        boxSize={8}
                        color={hero.isAlive ? 'orange.400' : 'gray.600'}
                        flexShrink={0}
                    />

                    {/* Equipment pips */}
                    <VStack spacing={0.5} align="start">
                        <EquipmentPips
                            items={Object.values(hero.slots || {}).filter((item): item is Item => item !== null && 'stats' in item)}
                            layout="vertical"
                            size="sm"
                        />
                    </VStack>
                </HStack>

                {/* Middle: Hero Info */}
                <VStack spacing={1} align="stretch" flex={1} minW={0}>
                    {/* Name & Level */}
                    <HStack spacing={2}>
                        <Text fontWeight="bold" fontSize="xs" noOfLines={1} flex={1} color="white">
                            {hero.name}
                        </Text>
                        <Text fontSize="xs" color="orange.300" flexShrink={0}>
                            Lv{hero.level}
                        </Text>
                    </HStack>

                    {/* HP Bar */}
                    <StatBar
                        label="HP"
                        current={hero.stats.hp}
                        max={totalStats.maxHp}
                        colorScheme="green"
                    />

                    {/* Status & Effects */}
                    {!hero.isAlive ? (
                        <HStack spacing={1} justify="center">
                            <Icon as={GiSkullCrossedBones} boxSize={3} color="red.500" />
                            <Text fontSize="xs" color="red.500" fontWeight="bold">
                                DEFEATED
                            </Text>
                        </HStack>
                    ) : effects.length > 0 ? (
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
                            {statusEffects.slice(0, 2).map((effect) => {
                                // Determine badge color and icon based on effect behavior
                                const isHeal = effect.behavior?.type === 'healPerTurn'
                                const isDamage = effect.behavior?.type === 'damagePerTurn'
                                const colorScheme = isHeal ? 'cyan' : isDamage ? 'orange' : 'purple'
                                const icon = isHeal ? GiHeartPlus : isDamage ? GiSwordWound : GiSparkles
                                
                                return (
                                    <Tooltip key={effect.id} label={`${effect.name} (${effect.duration} turns)`}>
                                        <Badge colorScheme={colorScheme} fontSize="2xs" display="flex" alignItems="center">
                                            <Icon as={icon} boxSize={2} mr={1} />
                                            {effect.name.slice(0, 5)}
                                        </Badge>
                                    </Tooltip>
                                )
                            })}
                            {effects.length > 4 && (
                                <Badge colorScheme="gray" fontSize="2xs">
                                    +{effects.length - 4}
                                </Badge>
                            )}
                        </HStack>
                    ) : (
                        <Box h="clamp(12px, 1.5vh, 18px)" /> // Spacer to maintain consistent height
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

                {/* Right: Consumables */}
                <VStack spacing={0.5} flexShrink={0}>
                    {consumableSlots.map(slotId => {
                        const item = hero.slots[slotId] ? restoreItemIcon(hero.slots[slotId]) : null
                        const consumable = item && 'consumableType' in item ? item as Consumable : null
                        const isRevive = consumable?.effects?.some((effect: any) => effect.type === 'revive') ?? false
                        const canUse = isRevive ? !hero.isAlive : hero.isAlive

                        if (!consumable) {
                            // Empty slot
                            return (
                                <Box
                                    key={slotId}
                                    w="clamp(20px, 2vw, 28px)"
                                    h="clamp(20px, 2vw, 28px)"
                                    bg="gray.900"
                                    borderRadius="md"
                                    borderWidth="1px"
                                    borderColor="gray.700"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    opacity={0.3}
                                >
                                    <Icon as={GameIcons.GiApothecary} boxSize={4} color="gray.600" />
                                </Box>
                            )
                        }

                        return (
                            <Box
                                key={slotId}
                                w="clamp(20px, 2vw, 28px)"
                                h="clamp(20px, 2vw, 28px)"
                                cursor={canUse ? 'pointer' : 'not-allowed'}
                                opacity={canUse ? 1 : 0.4}
                                borderRadius="lg"
                                boxShadow={isRevive && canUse ? '0 0 8px 2px rgba(255, 215, 0, 0.6)' : undefined}
                                transition="box-shadow 0.3s ease"
                                _hover={isRevive && canUse ? { boxShadow: '0 0 12px 3px rgba(255, 215, 0, 0.8)' } : undefined}
                            >
                                <ItemSlot
                                    item={consumable}
                                    size="sm"
                                    isClickable={canUse}
                                    iconOnly={true}
                                    onClick={canUse && onUseConsumable ? () => {
                                        onUseConsumable(hero.id, slotId)
                                    } : undefined}
                                />
                            </Box>
                        )
                    })}
                </VStack>
            </HStack>
        </MotionBox>
    )
}
