/**
 * Combat Actions Panel - Hero Action Buttons
 * 
 * Action buttons for attack, defend, abilities, items, and flee
 */

import {
    Box, HStack, VStack, Button, Text, Badge, Icon, Tooltip, SimpleGrid,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    useDisclosure
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import type { Hero, BossCombatState } from '@/types'
import { GiSwordman, GiShield, GiSparkles, GiRunningNinja } from 'react-icons/gi'
import { useMemo } from 'react'
import { ItemSlot } from '@/components/ui/ItemSlot'
import { calculateTotalStats } from '@/utils/statCalculator'

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
    const { isOpen, onOpen, onClose } = useDisclosure()

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

    // Get all abilities (show disabled if on cooldown or no charges)
    const allAbilities = activeHero?.abilities?.map(a => {
        const cooldown = combatState.abilityCooldowns?.get(`${activeHero.id}-${a.id}`) || 0
        const hasCharges = a.charges === undefined || a.charges > 0
        const isUsable = cooldown === 0 && hasCharges
        
        return { ability: a, isUsable, remainingCooldown: cooldown, hasCharges }
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
            p={2}
            boxShadow="0 0 20px rgba(249, 115, 22, 0.4)"
        >
            {isBossTurn ? (
                /* Boss Turn - Show End Turn Button */
                <VStack spacing={1}>
                    <Text fontSize="md" fontWeight="bold" color="red.400" textAlign="center">
                        ⚔️ BOSS TURN ⚔️
                    </Text>
                    <Button
                        size="md"
                        colorScheme="orange"
                        w="full"
                        isLoading={isProcessing}
                        onClick={onEndTurn}
                        leftIcon={<Icon as={GiSwordman} boxSize={5} />}
                        h="50px"
                        fontSize="lg"
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
                        <VStack spacing={2} align="stretch">
                    {/* Active Hero Info */}
                    <HStack justify="space-between" p={2} bg="orange.900" borderRadius="md">
                        <VStack align="start" spacing={0}>
                                    <Text fontSize="xs" color="gray.400">Active Hero</Text>
                                    <Text fontSize="md" fontWeight="bold" color="white">
                                {activeHero.name}
                            </Text>
                        </VStack>
                        <VStack align="end" spacing={0}>
                                    <Text fontSize="2xs" color="gray.400">Action Cost</Text>
                                    <Badge colorScheme="orange" fontSize="sm" px={2}>
                                {actionCost.toFixed(1)} / 2.0
                            </Badge>
                        </VStack>
                    </HStack>

                    {/* Main Actions */}
                            <SimpleGrid columns={!activeHero.isAlive ? 1 : 2} spacing={2}>
                        {/* Skip Turn (Dead Hero) */}
                        {!activeHero.isAlive && (
                            <MotionButton
                                colorScheme="gray"
                                variant="solid"
                                size="md"
                                h="60px"
                                flexDirection="column"
                                gap={0}
                                isDisabled={isProcessing}
                                onClick={onEndTurn}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Icon as={GiRunningNinja} boxSize={6} />
                                <Text fontSize="xs">Skip Turn (Dead)</Text>
                                <Badge colorScheme="gray" fontSize="2xs">Hero is dead</Badge>
                            </MotionButton>
                        )}
                        
                        {/* Attack */}
                        {activeHero.isAlive && (
                        <Tooltip label={`Deal damage to boss (Cost: ${actionCost})`}>
                            <MotionButton
                                colorScheme="red"
                                variant="outline"
                                        size="md"
                                        h="60px"
                                flexDirection="column"
                                        gap={0}
                                isDisabled={isProcessing}
                                onClick={() => onAction(activeHero.id, 'attack')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                        <Icon as={GiSwordman} boxSize={6} />
                                        <Text fontSize="xs">Attack</Text>
                                <Badge colorScheme="red" fontSize="2xs">{actionCost}</Badge>
                            </MotionButton>
                        </Tooltip>
                        )}

                        {/* Defend */}
                        {activeHero.isAlive && (
                        <Tooltip label={`Increase defense for this turn (Cost: ${actionCost})`}>
                            <MotionButton
                                colorScheme="blue"
                                variant="outline"
                                        size="md"
                                        h="60px"
                                flexDirection="column"
                                        gap={0}
                                isDisabled={isProcessing}
                                onClick={() => onAction(activeHero.id, 'defend')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                        <Icon as={GiShield} boxSize={6} />
                                        <Text fontSize="xs">Defend</Text>
                                <Badge colorScheme="blue" fontSize="2xs">{actionCost}</Badge>
                            </MotionButton>
                                </Tooltip>
                        )}
                    </SimpleGrid>

                    {/* Abilities */}
                    {allAbilities.length > 0 && (
                                <VStack align="stretch" spacing={1}>
                                    <Text fontSize="2xs" color="gray.400" fontWeight="bold" letterSpacing="wider">
                                ABILITIES
                            </Text>
                                    <VStack spacing={1}>
                                {allAbilities.map(({ ability, isUsable, remainingCooldown, hasCharges }) => {
                                    // Calculate ability power preview
                                    const heroStats = calculateTotalStats(activeHero)
                                    let effectValue = ability.effect.value
                                    if (ability.effect.scaling) {
                                        const scalingStat = heroStats[ability.effect.scaling.stat as keyof typeof heroStats]
                                        const bonus = Math.round((typeof scalingStat === 'number' ? scalingStat : 0) * ability.effect.scaling.ratio)
                                        effectValue += bonus
                                    }
                                    const duration = ability.effect.duration
                                    
                                    const powerText = ability.effect.type === 'heal' ? 
                                        (duration && duration > 1 ? `${effectValue} HP/turn × ${duration}` : `${effectValue} HP`) :
                                        ability.effect.type === 'damage' ? `${effectValue} DMG` : ''
                                    
                                    // Color-code by ability type
                                    const abilityColor = ability.effect.type === 'heal' ? 'green' :
                                                        ability.effect.type === 'damage' ? 'orange' :
                                                        ability.effect.type === 'buff' ? 'purple' :
                                                        ability.effect.type === 'debuff' ? 'red' : 'cyan'
                                    
                                    const textColor = ability.effect.type === 'heal' ? 'green.200' :
                                                     ability.effect.type === 'damage' ? 'orange.200' :
                                                     ability.effect.type === 'buff' ? 'purple.200' :
                                                     ability.effect.type === 'debuff' ? 'red.200' : 'cyan.200'
                                    
                                    return (
                                        <MotionButton
                                            key={ability.id}
                                            colorScheme={abilityColor}
                                            variant="outline"
                                            size="sm"
                                            w="full"
                                            h="auto"
                                            py={1}
                                            isDisabled={isProcessing || !activeHero.isAlive || !isUsable}
                                            onClick={() => onAction(activeHero.id, `ability:${ability.id}`)}
                                            opacity={isUsable ? 1 : 0.5}
                                            whileHover={{ scale: isUsable ? 1.02 : 1 }}
                                            whileTap={{ scale: isUsable ? 0.98 : 1 }}
                                        >
                                            <HStack w="full" justify="space-between" px={1}>
                                                <HStack spacing={2}>
                                                    <Icon as={ability.icon || GiSparkles} boxSize={5} />
                                                    <VStack align="start" spacing={0}>
                                                        <Text fontSize="xs" fontWeight="bold">{ability.name}</Text>
                                                        <Text fontSize="2xs" color={textColor} fontStyle="italic" noOfLines={1}>
                                                            {powerText || ability.description}
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                                <HStack spacing={1}>
                                                    {remainingCooldown > 0 && (
                                                        <Badge colorScheme="red" fontSize="2xs">{remainingCooldown} turn{remainingCooldown !== 1 ? 's' : ''}</Badge>
                                                    )}
                                                    {!hasCharges && (
                                                        <Badge colorScheme="gray" fontSize="2xs">No Charges</Badge>
                                                    )}
                                                    {remainingCooldown === 0 && ability.cooldown > 0 && (
                                                        <Badge colorScheme={abilityColor} fontSize="2xs" opacity={0.6}>CD:{ability.cooldown}</Badge>
                                                    )}
                                                    <Badge colorScheme="orange" fontSize="2xs">{actionCost}</Badge>
                                                </HStack>
                                            </HStack>
                                        </MotionButton>
                                    )
                                })}
                                    </VStack>
                        </VStack>
                    )}

                    {/* Consumables */}
                    {usableItems.length > 0 && (
                                <VStack align="stretch" spacing={1}>
                            <HStack justify="space-between">
                                        <Text fontSize="2xs" color="gray.400" fontWeight="bold" letterSpacing="wider">
                                    CONSUMABLES
                                </Text>
                                <Badge colorScheme="green" fontSize="2xs">
                                    Cost: {consumableCost} each
                                </Badge>
                            </HStack>
                                    <SimpleGrid columns={4} spacing={1}>
                                        {usableItems.slice(0, 4).map(({ slot, item }) => {
                                    if (!item) return null
                                            const consumable = item as import('@/types').Consumable
                                            const isRevive = consumable.effects?.some(effect => effect.type === 'revive') ?? false
                                            const canUse = (isRevive ? !activeHero.isAlive : activeHero.isAlive) && !isProcessing

                                    return (
                                        <Box
                                            key={slot}
                                            borderRadius="lg"
                                            opacity={canUse ? 1 : 0.4}
                                            cursor={canUse ? 'pointer' : 'not-allowed'}
                                            boxShadow={isRevive && canUse ? '0 0 8px 2px rgba(255, 215, 0, 0.6)' : undefined}
                                            transition="box-shadow 0.3s ease, opacity 0.2s ease"
                                            _hover={isRevive && canUse ? { boxShadow: '0 0 12px 3px rgba(255, 215, 0, 0.8)' } : undefined}
                                        >
                                            <ItemSlot
                                                item={item}
                                                size="sm"
                                                isClickable={canUse}
                                                iconOnly={true}
                                                onClick={canUse ? () => {
                                                    onAction(activeHero.id, `item:${slot}`)
                                                } : undefined}
                                            />
                                        </Box>
                                    )
                                })}
                            </SimpleGrid>
                        </VStack>
                    )}

                            {/* Flee Button */}
                            <Button
                                colorScheme="purple"
                                variant="outline"
                                size="sm"
                                isDisabled={isProcessing}
                                onClick={onOpen}
                                leftIcon={<Icon as={GiRunningNinja} />}
                            >
                                Flee from Combat
                            </Button>

                            {/* Flee Confirmation Modal */}
                            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                                <ModalOverlay bg="blackAlpha.800" />
                                <ModalContent bg="gray.800" borderColor="purple.500" borderWidth="2px">
                                    <ModalHeader color="purple.300">⚠️ Flee from Combat?</ModalHeader>
                                    <ModalBody>
                                        <VStack align="start" spacing={3}>
                                            <Text color="white">
                                                Are you sure you want to flee from this boss battle?
                                            </Text>
                                            <VStack align="start" spacing={1} w="full" p={3} bg="red.900" borderRadius="md">
                                                <Text fontSize="sm" fontWeight="bold" color="red.300">
                                                    Consequences:
                                                </Text>
                                                <Text fontSize="sm" color="red.200">
                                                    • You will lose this battle
                                                </Text>
                                                <Text fontSize="sm" color="red.200">
                                                    • No rewards will be earned
                                                </Text>
                                                <Text fontSize="sm" color="red.200">
                                                    • Boss will remain undefeated
                                                </Text>
                                            </VStack>
                                        </VStack>
                                    </ModalBody>
                                    <ModalFooter gap={3}>
                                        <Button colorScheme="gray" onClick={onClose}>
                                            Stay and Fight
                                        </Button>
                                        <Button 
                                            colorScheme="purple"
                                            onClick={() => {
                                                onClose()
                                                onFlee()
                                            }}
                                        >
                                            Flee
                                        </Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                </VStack>
            )}
        </Box>
    )
}
