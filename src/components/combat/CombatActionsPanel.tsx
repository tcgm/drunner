/**
 * Combat Actions Panel - Hero Action Buttons
 * 
 * Action buttons for attack, defend, abilities, items, and flee
 */

import { Box, HStack, VStack, Button, Text, Badge, Icon, Tooltip, SimpleGrid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import type { Hero, BossCombatState } from '@/types'
import { GiSwordman, GiShield, GiSparkles, GiHealthPotion, GiRunningNinja } from 'react-icons/gi'
import { useMemo } from 'react'

const MotionButton = motion.create(Button)

interface CombatActionsPanelProps {
    party: Hero[]
    combatState: BossCombatState
    isProcessing: boolean
    onAction: (heroId: string, action: string) => void
    onEndTurn: () => void
    onFlee: () => void
}

export default function CombatActionsPanel({
    party,
    combatState,
    isProcessing,
    onAction,
    onEndTurn,
    onFlee,
}: CombatActionsPanelProps) {
    // Get current active hero
    const activeHero = useMemo(() => {
        if (!combatState.turnOrder || combatState.turnOrder.length === 0) return null
        const currentCombatant = combatState.turnOrder[combatState.currentTurnIndex || 0]
        if (!currentCombatant || currentCombatant.id === 'boss') return null
        return party.find(h => h.id === currentCombatant.id)
    }, [combatState.turnOrder, combatState.currentTurnIndex, party])

    const isBossTurn = useMemo(() => {
        if (!combatState.turnOrder || combatState.turnOrder.length === 0) return true
        const currentCombatant = combatState.turnOrder[combatState.currentTurnIndex || 0]
        return currentCombatant?.id === 'boss'
    }, [combatState.turnOrder, combatState.currentTurnIndex])

    // Get usable abilities and items for active hero
    const usableAbilities = activeHero?.abilities?.filter(a => {
        // Check cooldown
        const cooldown = combatState.abilityCooldowns?.get(`${activeHero.id}-${a.id}`) || 0
        if (cooldown > 0) return false

        // Check charges
        if (a.charges !== undefined && a.charges <= 0) return false

        return true
    }) || []

    const usableItems = activeHero ? Object.entries(activeHero.slots)
        .filter(([key, item]) =>
            key.startsWith('consumable') &&
            item &&
            'consumableType' in item &&
            item.usableInCombat
        )
        .map(([key, item]) => ({ slot: key, item }))
        : []

    const actionCost = 1.0 // Base action cost
    const consumableCost = 0.33 // Regular consumable cost

    return (
        <Box
            className="combat-actions-panel"
            w="full"
            bg="blackAlpha.700"
            borderWidth="2px"
            borderColor="orange.600"
            borderRadius="lg"
            p={4}
            boxShadow="0 0 20px rgba(249, 115, 22, 0.4)"
        >
            {isBossTurn ? (
                /* Boss Turn - Show End Turn Button */
                <VStack spacing={3}>
                    <Text fontSize="lg" fontWeight="bold" color="red.400" textAlign="center">
                        ⚔️ BOSS TURN ⚔️
                    </Text>
                    <Button
                        size="lg"
                        colorScheme="orange"
                        w="full"
                        isLoading={isProcessing}
                        onClick={onEndTurn}
                        leftIcon={<Icon as={GiSwordman} boxSize={6} />}
                        h="60px"
                        fontSize="xl"
                    >
                        Process Boss Turn
                    </Button>
                </VStack>
            ) : !activeHero ? (
                /* No Active Hero */
                <Text fontSize="sm" color="gray.500" textAlign="center">
                    Waiting for turn...
                </Text>
            ) : (
                /* Hero Turn - Show Actions */
                <VStack spacing={4} align="stretch">
                    {/* Active Hero Info */}
                    <HStack justify="space-between" p={2} bg="orange.900" borderRadius="md">
                        <VStack align="start" spacing={0}>
                            <Text fontSize="sm" color="gray.400">Active Hero</Text>
                            <Text fontSize="lg" fontWeight="bold" color="white">
                                {activeHero.name}
                            </Text>
                        </VStack>
                        <VStack align="end" spacing={0}>
                            <Text fontSize="xs" color="gray.400">Action Cost</Text>
                            <Badge colorScheme="orange" fontSize="lg" px={3}>
                                {actionCost.toFixed(1)} / 2.0
                            </Badge>
                        </VStack>
                    </HStack>

                    {/* Main Actions */}
                    <SimpleGrid columns={3} spacing={2}>
                        {/* Attack */}
                        <Tooltip label={`Deal damage to boss (Cost: ${actionCost})`}>
                            <MotionButton
                                colorScheme="red"
                                size="lg"
                                h="80px"
                                flexDirection="column"
                                gap={1}
                                isDisabled={isProcessing || !activeHero.isAlive}
                                onClick={() => onAction(activeHero.id, 'attack')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Icon as={GiSwordman} boxSize={8} />
                                <Text fontSize="sm">Attack</Text>
                                <Badge colorScheme="red" fontSize="2xs">{actionCost}</Badge>
                            </MotionButton>
                        </Tooltip>

                        {/* Defend */}
                        <Tooltip label={`Increase defense for this turn (Cost: ${actionCost})`}>
                            <MotionButton
                                colorScheme="blue"
                                size="lg"
                                h="80px"
                                flexDirection="column"
                                gap={1}
                                isDisabled={isProcessing || !activeHero.isAlive}
                                onClick={() => onAction(activeHero.id, 'defend')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Icon as={GiShield} boxSize={8} />
                                <Text fontSize="sm">Defend</Text>
                                <Badge colorScheme="blue" fontSize="2xs">{actionCost}</Badge>
                            </MotionButton>
                        </Tooltip>

                        {/* Flee */}
                        <Tooltip label="Attempt to flee from combat">
                            <MotionButton
                                colorScheme="purple"
                                size="lg"
                                h="80px"
                                flexDirection="column"
                                gap={1}
                                isDisabled={isProcessing}
                                onClick={onFlee}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Icon as={GiRunningNinja} boxSize={8} />
                                <Text fontSize="sm">Flee</Text>
                                <Badge colorScheme="purple" fontSize="2xs">Exit</Badge>
                            </MotionButton>
                        </Tooltip>
                    </SimpleGrid>

                    {/* Abilities */}
                    {usableAbilities.length > 0 && (
                        <VStack align="stretch" spacing={2}>
                            <Text fontSize="xs" color="gray.400" fontWeight="bold" letterSpacing="wider">
                                ABILITIES
                            </Text>
                            <SimpleGrid columns={2} spacing={2}>
                                {usableAbilities.slice(0, 4).map((ability) => (
                                    <Tooltip
                                        key={ability.id}
                                        label={`${ability.description} (Cost: ${actionCost})`}
                                    >
                                        <MotionButton
                                            colorScheme="cyan"
                                            size="sm"
                                            h="60px"
                                            flexDirection="column"
                                            gap={1}
                                            fontSize="xs"
                                            isDisabled={isProcessing || !activeHero.isAlive}
                                            onClick={() => onAction(activeHero.id, `ability:${ability.id}`)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Icon as={GiSparkles} boxSize={5} />
                                            <Text noOfLines={1}>{ability.name}</Text>
                                            {ability.cooldown > 0 && (
                                                <Badge colorScheme="cyan" fontSize="2xs">CD:{ability.cooldown}</Badge>
                                            )}
                                        </MotionButton>
                                    </Tooltip>
                                ))}
                            </SimpleGrid>
                        </VStack>
                    )}

                    {/* Consumables */}
                    {usableItems.length > 0 && (
                        <VStack align="stretch" spacing={2}>
                            <HStack justify="space-between">
                                <Text fontSize="xs" color="gray.400" fontWeight="bold" letterSpacing="wider">
                                    CONSUMABLES
                                </Text>
                                <Badge colorScheme="green" fontSize="2xs">
                                    Cost: {consumableCost} each
                                </Badge>
                            </HStack>
                            <SimpleGrid columns={3} spacing={2}>
                                {usableItems.slice(0, 3).map(({ slot, item }) => {
                                    if (!item) return null
                                    return (
                                        <Tooltip
                                            key={slot}
                                            label={`${item.description} (Cost: ${consumableCost})`}
                                        >
                                            <MotionButton
                                                colorScheme="green"
                                                size="sm"
                                                h="50px"
                                                flexDirection="column"
                                                gap={1}
                                                fontSize="2xs"
                                                isDisabled={isProcessing || !activeHero.isAlive}
                                                onClick={() => onAction(activeHero.id, `item:${slot}`)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Icon as={GiHealthPotion} boxSize={4} />
                                                <Text noOfLines={1}>{item.name}</Text>
                                            </MotionButton>
                                        </Tooltip>
                                    )
                                })}
                            </SimpleGrid>
                        </VStack>
                    )}

                    {/* End Turn Button */}
                    <Button
                        colorScheme="orange"
                        size="lg"
                        isLoading={isProcessing}
                        onClick={onEndTurn}
                        isDisabled={!activeHero.isAlive}
                    >
                        ⏩ End Turn
                    </Button>
                </VStack>
            )}
        </Box>
    )
}
