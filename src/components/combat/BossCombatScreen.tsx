/**
 * Boss Combat Screen - Epic Boss Battle UI
 * 
 * Full-screen dedicated combat interface for boss encounters
 */

import './combat-animations.css'
import { Box, VStack, HStack, useToast } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { DungeonEvent, Hero, BossCombatState } from '@/types'
import BossDisplay from './BossDisplay'
import PartyHealthDisplay from './PartyHealthDisplay'
import TurnOrderDisplay from './TurnOrderDisplay'
import CombatActionsPanel from './CombatActionsPanel'
import CombatLog from './CombatLog'
import {
    startCombatRound,
    processBossTurn,
    processRoundEnd,
    checkVictory,
    checkDefeat,
    executeAttack,
    executeDefend,
    executeHeroAbility,
    useConsumable,
    advanceTurn,
} from '@/systems/combat'

const MotionBox = motion.create(Box)

interface BossCombatScreenProps {
    event: DungeonEvent
    party: (Hero | null)[]
    onVictory: () => void
    onDefeat: () => void
    onFlee: () => void
}

export interface CombatLogEntry {
    id: string
    type: 'damage' | 'heal' | 'buff' | 'debuff' | 'phase' | 'turn' | 'ability' | 'action'
    message: string
    timestamp: number
    target?: string
    value?: number
}

export default function BossCombatScreen({
    event,
    party,
    onVictory,
    onDefeat,
    onFlee
}: BossCombatScreenProps) {
    const [combatLog, setCombatLog] = useState<CombatLogEntry[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const toast = useToast()

    // Add log entry helper
    const addLogEntry = (
        type: CombatLogEntry['type'],
        message: string,
        target?: string,
        value?: number
    ) => {
        const entry: CombatLogEntry = {
            id: `${Date.now()}-${Math.random()}`,
            type,
            message,
            timestamp: Date.now(),
            target,
            value,
        }
        setCombatLog(prev => [...prev, entry].slice(-50)) // Keep last 50 entries
    }

    // Initialize combat on mount
    useEffect(() => {
        if (event.combatState) {
            addLogEntry('turn', 'Combat begins!')
            // Start first round (modifies state in place)
            startCombatRound(event.combatState, party.filter(h => h !== null) as Hero[])
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Check victory/defeat conditions
    useEffect(() => {
        if (!event.combatState) return

        const victory = checkVictory(event.combatState)
        const defeat = checkDefeat(party.filter(h => h !== null) as Hero[])

        if (victory) {
            addLogEntry('phase', '🎉 Victory! The boss has been defeated!')
            setTimeout(() => onVictory(), 2000)
        } else if (defeat) {
            addLogEntry('phase', '💀 Defeat... Your party has fallen...')
            setTimeout(() => onDefeat(), 2000)
        }
    }, [event.combatState, party, onVictory, onDefeat])

    const handleHeroAction = async (heroId: string, action: string) => {
        if (isProcessing || !event.combatState) return

        setIsProcessing(true)

        try {
            const hero = party.find(h => h?.id === heroId) as Hero | null
            if (!hero) {
                throw new Error('Hero not found')
            }

            // Parse action type
            if (action === 'attack') {
                const result = executeAttack(hero, event.combatState)
                if (result.success) {
                    addLogEntry('damage', `${hero.name} attacks for ${result.damage} damage!`, 'boss', result.damage)
                } else {
                    addLogEntry('action', result.message)
                }
            } else if (action === 'defend') {
                const result = executeDefend(hero, event.combatState)
                addLogEntry('buff', `${hero.name} takes a defensive stance!`)
            } else if (action.startsWith('ability:')) {
                const abilityId = action.split(':')[1]
                const ability = hero.abilities?.find(a => a.id === abilityId)
                if (ability) {
                    const result = executeHeroAbility(
                        hero,
                        ability,
                        event.combatState,
                        party.filter(h => h !== null) as Hero[]
                    )
                    addLogEntry('ability', result.message)
                }
            } else if (action.startsWith('item:')) {
                const slot = action.split(':')[1]
                const item = hero.slots[slot]
                if (!item || !('consumableType' in item)) {
                    throw new Error('Invalid consumable')
                }
                const consumable = item as import('@/types').Consumable
                const result = useConsumable(
                    hero,
                    consumable,
                    slot,
                    event.combatState,
                    party.filter(h => h !== null) as Hero[]
                )
                addLogEntry('heal', result.message)
            } else if (action === 'flee') {
                // Handled by parent component
                return
            }

            // Advance to next turn
            advanceTurn(event.combatState)
        } catch (error) {
            console.error('Hero action error:', error)
            toast({
                title: 'Action Failed',
                description: error instanceof Error ? error.message : 'Unknown error',
                status: 'error',
                duration: 3000,
            })
        }

        setIsProcessing(false)
    }

    const handleEndTurn = async () => {
        if (isProcessing || !event.combatState) return

        setIsProcessing(true)
        addLogEntry('turn', 'Processing boss turn...')

        try {
            // Process boss turn (returns result object)
            const bossTurnResult = processBossTurn(event.combatState, party.filter(h => h !== null) as Hero[])

            // Log boss actions
            if (bossTurnResult.passiveHealing) {
                addLogEntry('heal', `Boss regenerates ${bossTurnResult.passiveHealing} HP`, 'boss', bossTurnResult.passiveHealing)
            }
            if (bossTurnResult.phaseTransition) {
                addLogEntry('phase', `Boss transitions to Phase ${bossTurnResult.phaseTransition.newPhase}!`)
            }
            if (bossTurnResult.abilitiesUsed.length > 0) {
                bossTurnResult.abilitiesUsed.forEach(ability => {
                    addLogEntry('ability', `Boss uses ${ability.name}!`)
                })
            }
            if (bossTurnResult.attackResult) {
                addLogEntry('damage', 'Boss attacks!', bossTurnResult.attackResult.targets?.[0])
            }

            // End round (modifies state in place, returns result object)
            processRoundEnd(event.combatState, party.filter(h => h !== null) as Hero[])

            addLogEntry('turn', `Round ${event.combatState.combatDepth} complete`)

            // Start next round (modifies state in place)
            startCombatRound(event.combatState, party.filter(h => h !== null) as Hero[])
        } catch (error) {
            console.error('Combat processing error:', error)
            toast({
                title: 'Combat Error',
                description: 'An error occurred during combat',
                status: 'error',
                duration: 3000,
            })
        }

        setIsProcessing(false)
    }

    if (!event.combatState) {
        return (
            <Box w="full" h="100vh" display="flex" alignItems="center" justifyContent="center">
                <Box>Loading combat...</Box>
            </Box>
        )
    }

    const combatState = event.combatState
    const activeHeroes = party.filter(h => h !== null) as Hero[]

    return (
        <MotionBox
            className="boss-combat-screen"
            w="full"
            h="100vh"
            bg="black"
            position="relative"
            overflow="hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Epic Background Effects */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bgGradient="radial-gradient(circle at 50% 30%, rgba(139, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 50%, black 100%)"
                zIndex={0}
            />

            {/* Animated Background Particles */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                opacity={0.15}
                backgroundImage="radial-gradient(circle, rgba(255, 0, 0, 0.3) 1px, transparent 1px)"
                backgroundSize="50px 50px"
                animation="pulse 4s ease-in-out infinite"
                zIndex={0}
            />

            {/* Main Combat Layout */}
            <VStack
                position="relative"
                zIndex={1}
                h="full"
                spacing={0}
                justify="space-between"
                p={4}
            >
                {/* Top Section - Boss Display */}
                <Box w="full" flex="0 0 auto">
                    <BossDisplay
                        event={event}
                        combatState={combatState}
                        onPhaseChange={(phase: number) => addLogEntry('phase', `Boss enters Phase ${phase}!`)}
                    />
                </Box>

                {/* Middle Section - Turn Order & Combat Log */}
                <HStack
                    w="full"
                    flex="1"
                    spacing={4}
                    align="stretch"
                    minH={0}
                >
                    {/* Turn Order */}
                    <Box flex="0 0 200px">
                        <TurnOrderDisplay
                            combatState={combatState}
                            party={activeHeroes}
                        />
                    </Box>

                    {/* Combat Log */}
                    <Box flex="1" minW={0}>
                        <CombatLog entries={combatLog} />
                    </Box>
                </HStack>

                {/* Bottom Section - Party & Actions */}
                <VStack w="full" spacing={3} flex="0 0 auto">
                    <PartyHealthDisplay
                        party={activeHeroes}
                        combatState={combatState}
                    />

                    <CombatActionsPanel
                        party={activeHeroes}
                        combatState={combatState}
                        isProcessing={isProcessing}
                        onAction={handleHeroAction}
                        onEndTurn={handleEndTurn}
                        onFlee={onFlee}
                    />
                </VStack>
            </VStack>

            {/* Victory/Defeat Overlay */}
            <AnimatePresence>
                {(checkVictory(combatState) || checkDefeat(activeHeroes)) && (
                    <MotionBox
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        bg="blackAlpha.800"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        zIndex={10}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <MotionBox
                            fontSize="6xl"
                            fontWeight="bold"
                            color={checkVictory(combatState) ? 'green.400' : 'red.400'}
                            textShadow="0 0 20px currentColor"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            {checkVictory(combatState) ? 'VICTORY!' : 'DEFEAT'}
                        </MotionBox>
                    </MotionBox>
                )}
            </AnimatePresence>
        </MotionBox>
    )
}
