/**
 * Boss Combat Screen - Epic Boss Battle UI
 * 
 * Full-screen dedicated combat interface for boss encounters
 */

import './combat-animations.css'
import './BossCombatScreen.css'
import { Box, VStack, HStack, Text, useToast, Icon, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import type { DungeonEvent, Hero, BossCombatState } from '@/types'
import type { ParticleEffect } from './CombatParticles'
import * as GameIcons from 'react-icons/gi'
import { GiSkullCrossedBones, GiSwordman, GiScrollUnfurled } from 'react-icons/gi'
import BossDisplay from './BossDisplay'
import PartyHealthDisplay from './PartyHealthDisplay'
import TurnOrderDisplay from './TurnOrderDisplay'
import CombatActionsPanel from './CombatActionsPanel'
import CombatLog from './CombatLog'
import CombatParticles from './CombatParticles'
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
    getCurrentCombatant,
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
    const [updateTrigger, setUpdateTrigger] = useState(0)
    const [isBossActing, setIsBossActing] = useState(false)
    const [particleEffect, setParticleEffect] = useState<ParticleEffect | null>(null)
    const [particlePosition, setParticlePosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 })
    const combatInitialized = useRef(false)
    const combatEnded = useRef(false)
    const isUnmounting = useRef(false) // Prevent any actions after unmount starts
    const toast = useToast()
    
    // Combat log modal for portrait mode
    const { isOpen: isCombatLogOpen, onOpen: onCombatLogOpen, onClose: onCombatLogClose } = useDisclosure()

    // Cleanup on unmount - stop all processing
    useEffect(() => {
        return () => {
            isUnmounting.current = true
            combatEnded.current = true
        }
    }, [])

    // Add log entry helper
    const addLogEntry = (
        type: CombatLogEntry['type'],
        message: string,
        target?: string,
        value?: number
    ) => {
        // Don't add logs if unmounting
        if (isUnmounting.current) return
        
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

    // Trigger particle effect helper
    const triggerParticles = (effect: ParticleEffect, position: { x: number; y: number } = { x: 50, y: 50 }) => {
        // Don't trigger particles if unmounting
        if (isUnmounting.current) return
        
        setParticleEffect(effect)
        setParticlePosition(position)
    }

    // Helper to process boss turn with animations and delays
    const processBossTurnWithAnimations = async (bossTurnResult: any) => {
        if (isUnmounting.current) return // Don't process if unmounting
        
        setIsBossActing(true)

        // Passive healing animation
        if (bossTurnResult.passiveHealing) {
            if (isUnmounting.current) return
            addLogEntry('heal', `Boss regenerates ${bossTurnResult.passiveHealing} HP`, 'boss', bossTurnResult.passiveHealing)
            triggerParticles('heal', { x: 50, y: 30 })
            setUpdateTrigger(prev => prev + 1)
            await new Promise(resolve => setTimeout(resolve, 600))
        }

        // Phase transition animation
        if (bossTurnResult.phaseTransition) {
            if (isUnmounting.current) return
            addLogEntry('phase', `Boss enters Phase ${bossTurnResult.phaseTransition.newPhase}!`)
            triggerParticles('phase', { x: 50, y: 30 })
            setUpdateTrigger(prev => prev + 1)
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        // Abilities animations
        if (bossTurnResult.abilitiesUsed.length > 0) {
            for (const abilityResult of bossTurnResult.abilitiesUsed) {
                if (isUnmounting.current) return
                addLogEntry('ability', `Boss uses ${abilityResult.ability.name}!`)
                setUpdateTrigger(prev => prev + 1)
                await new Promise(resolve => setTimeout(resolve, 500))

                // Show each effect with delay
                if (abilityResult.effects) {
                    for (const effect of abilityResult.effects) {
                        if (isUnmounting.current) return
                        if (effect.description) {
                            addLogEntry('action', effect.description)
                            setUpdateTrigger(prev => prev + 1)
                            await new Promise(resolve => setTimeout(resolve, 400))
                        }
                    }
                }
            }
        }

        // Attack animation
        if (bossTurnResult.attackResult) {
            if (isUnmounting.current) return
            const pattern = bossTurnResult.attackResult.pattern
            if (pattern) {
                addLogEntry('action', `Boss uses ${pattern.name}!`)
                setUpdateTrigger(prev => prev + 1)
                await new Promise(resolve => setTimeout(resolve, 700))
            }

            // Show damage with delays between each target
            if (bossTurnResult.attackResult.damage && bossTurnResult.attackResult.damage.length > 0) {
                for (const dmg of bossTurnResult.attackResult.damage) {
                    if (isUnmounting.current) return
                    if (dmg.isDodge) {
                        addLogEntry('action', `${dmg.heroName} dodged!`)
                        triggerParticles('dodge', { x: 50, y: 70 })
                    } else {
                        const critText = dmg.isCrit ? ' (Critical Hit!)' : ''
                        addLogEntry('damage', `${dmg.heroName} takes ${dmg.damage} damage${critText}`, dmg.heroId, dmg.damage)
                        triggerParticles(dmg.isCrit ? 'critical' : 'damage', { x: 50, y: 70 })
                    }
                    setUpdateTrigger(prev => prev + 1)
                    await new Promise(resolve => setTimeout(resolve, 500))
                }
            } else {
                if (isUnmounting.current) return
                addLogEntry('action', 'Boss attacks but misses!')
                setUpdateTrigger(prev => prev + 1)
                await new Promise(resolve => setTimeout(resolve, 500))
            }
        } else {
            if (isUnmounting.current) return
            addLogEntry('action', 'Boss readies for the next attack...')
            setUpdateTrigger(prev => prev + 1)
            await new Promise(resolve => setTimeout(resolve, 500))
        }

        setIsBossActing(false)
    }

    // Initialize combat on mount
    useEffect(() => {
        if (event.combatState && !combatInitialized.current && !isUnmounting.current) {
            combatInitialized.current = true
            addLogEntry('turn', 'Combat begins!')
            // Start first round (modifies state in place)
            startCombatRound(event.combatState, party.filter(h => h !== null) as Hero[])

            // Process boss turns if boss goes first
            const processInitialBossTurns = async () => {
                let currentCombatant = getCurrentCombatant(event.combatState!)
                while (currentCombatant && currentCombatant.type === 'boss') {
                    // Check if combat ended or unmounting
                    if (combatEnded.current || isUnmounting.current) break
                    
                    await new Promise(resolve => setTimeout(resolve, 800))
                    addLogEntry('turn', 'Processing boss turn...')
                    setUpdateTrigger(prev => prev + 1)
                    await new Promise(resolve => setTimeout(resolve, 400))

                    const bossTurnResult = processBossTurn(event.combatState!, party.filter(h => h !== null) as Hero[])

                    // Animate boss actions with delays
                    await processBossTurnWithAnimations(bossTurnResult)

                    // Advance turn
                    const continues = advanceTurn(event.combatState!)
                    if (!continues) {
                        break
                    }
                    currentCombatant = getCurrentCombatant(event.combatState!)
                }
            }

            processInitialBossTurns()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Check victory/defeat conditions
    useEffect(() => {
        if (!event.combatState || isProcessing || combatEnded.current || isUnmounting.current) return

        const victory = checkVictory(event.combatState)
        const defeat = checkDefeat(party.filter(h => h !== null) as Hero[])

        if (victory) {
            combatEnded.current = true
            isUnmounting.current = true // Mark as unmounting immediately
            addLogEntry('phase', '🎉 Victory! The boss has been defeated!')
            triggerParticles('victory', { x: 50, y: 50 })
            
            // Close combat log modal if open (important for mobile)
            if (isCombatLogOpen) {
                onCombatLogClose()
            }
            
            const victoryTimer = setTimeout(() => {
                if (!isUnmounting.current) return // Safety check
                onVictory()
            }, 1500) // Reduced from 2000ms for faster transition
            
            // Cleanup timer on unmount
            return () => clearTimeout(victoryTimer)
        } else if (defeat) {
            combatEnded.current = true
            isUnmounting.current = true // Mark as unmounting immediately
            addLogEntry('phase', '💀 Defeat... Your party has fallen...')
            
            // Close combat log modal if open (important for mobile)
            if (isCombatLogOpen) {
                onCombatLogClose()
            }
            
            const defeatTimer = setTimeout(() => {
                if (!isUnmounting.current) return // Safety check
                onDefeat()
            }, 1500)
            
            // Cleanup timer on unmount
            return () => clearTimeout(defeatTimer)
        }
    }, [updateTrigger, event.combatState, party, onVictory, onDefeat, isProcessing, isCombatLogOpen, onCombatLogClose])

    const handleHeroAction = async (heroId: string, action: string) => {
        if (isProcessing || !event.combatState || combatEnded.current || isUnmounting.current) return

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
                    triggerParticles('damage', { x: 50, y: 30 })
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
                    // Log the ability effects
                    if (result.damage) {
                        addLogEntry('damage', `${hero.name} used ${ability.name} for ${result.damage} damage!`, 'boss', result.damage)
                        triggerParticles('critical', { x: 50, y: 30 })
                    } else if (result.healing) {
                        addLogEntry('heal', `${hero.name} used ${ability.name} to heal ${result.healing} HP!`, hero.id, result.healing)
                        triggerParticles('heal', { x: 50, y: 70 })
                    } else {
                        addLogEntry('ability', result.message)
                    }
                    
                    // Log additional effects
                    for (const effect of result.effects) {
                        if (effect.description && !effect.description.includes('healed') && !effect.description.includes('damage')) {
                            addLogEntry('buff', effect.description)
                        }
                    }
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
                triggerParticles('heal', { x: 50, y: 70 })
            } else if (action === 'flee') {
                // Handled by parent component
                return
            }

            // Force update to check victory
            setUpdateTrigger(prev => prev + 1)

            // Check if boss is defeated before advancing turn
            if (checkVictory(event.combatState)) {
                setIsProcessing(false)
                return
            }

            // Advance to next turn
            const roundContinues = advanceTurn(event.combatState)
            if (checkVictory(event.combatState)) {
                setIsProcessing(false)
                return
            }

            // If round ended after hero turn, start new round
            if (!roundContinues) {
                processRoundEnd(event.combatState, party.filter(h => h !== null) as Hero[])
                addLogEntry('turn', `Round ${event.combatState.combatDepth} complete`)
                await new Promise(resolve => setTimeout(resolve, 400))
                startCombatRound(event.combatState, party.filter(h => h !== null) as Hero[])
                setUpdateTrigger(prev => prev + 1)
            }

            // Process any consecutive boss turns until we reach the next hero turn or end of round
            let currentCombatant = getCurrentCombatant(event.combatState)
            while (currentCombatant && currentCombatant.type === 'boss') {
                // Check if combat ended or unmounting
                if (combatEnded.current || isUnmounting.current) break
                
                // Process boss turn
                await new Promise(resolve => setTimeout(resolve, 800))
                addLogEntry('turn', 'Processing boss turn...')
                setUpdateTrigger(prev => prev + 1)
                await new Promise(resolve => setTimeout(resolve, 400))

                const bossTurnResult = processBossTurn(event.combatState, party.filter(h => h !== null) as Hero[])

                // Animate boss actions with delays
                await processBossTurnWithAnimations(bossTurnResult)

                // Check for hero defeat after boss turn
                if (checkDefeat(party.filter(h => h !== null) as Hero[])) {
                    setIsProcessing(false)
                    return
                }

                // Advance to next turn
                const continues = advanceTurn(event.combatState)
                if (!continues) {
                    // End of round - process round end and start new round
                    const roundEndResult = processRoundEnd(event.combatState, party.filter(h => h !== null) as Hero[])
                    
                    // Log status effects (HoTs, DoTs, etc.)
                    if (roundEndResult.effectsProcessed && roundEndResult.effectsProcessed.length > 0) {
                        for (const effect of roundEndResult.effectsProcessed) {
                            if (effect.healing) {
                                addLogEntry('heal', `${effect.target} regenerates ${effect.healing} HP from ${effect.effectName}`, effect.target, effect.healing)
                            } else if (effect.damage) {
                                addLogEntry('damage', `${effect.target} takes ${effect.damage} damage from ${effect.effectName}`, effect.target, effect.damage)
                            }
                        }
                    }
                    
                    addLogEntry('turn', `Round ${event.combatState.combatDepth} complete`)
                    startCombatRound(event.combatState, party.filter(h => h !== null) as Hero[])
                    setUpdateTrigger(prev => prev + 1)
                    // Update currentCombatant to reflect the new round
                    currentCombatant = getCurrentCombatant(event.combatState)
                    // Continue loop to check if boss goes first in new round
                    continue
                }

                // Check next combatant
                currentCombatant = getCurrentCombatant(event.combatState)
            }

            // Note: Round end is now handled inside the while loop
            // No need for duplicate round-end-processing here
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
        if (isProcessing || !event.combatState || combatEnded.current || isUnmounting.current) return

        setIsProcessing(true)
        addLogEntry('turn', 'Processing boss turn...')
        setUpdateTrigger(prev => prev + 1)
        await new Promise(resolve => setTimeout(resolve, 400))

        try {
            // Check if combat ended or unmounting
            if (combatEnded.current || isUnmounting.current) {
                setIsProcessing(false)
                return
            }
            
            // Process boss turn (returns result object)
            const bossTurnResult = processBossTurn(event.combatState, party.filter(h => h !== null) as Hero[])

            // Animate boss actions with delays
            await processBossTurnWithAnimations(bossTurnResult)

            // Check if combat ended or unmounting
            if (combatEnded.current || isUnmounting.current) {
                setIsProcessing(false)
                return
            }

            // End round (modifies state in place, returns result object)
            const roundEndResult = processRoundEnd(event.combatState, party.filter(h => h !== null) as Hero[])

            // Log status effects (HoTs, DoTs, etc.)
            if (roundEndResult.effectsProcessed && roundEndResult.effectsProcessed.length > 0) {
                for (const effect of roundEndResult.effectsProcessed) {
                    if (effect.healing) {
                        addLogEntry('heal', `${effect.target} regenerates ${effect.healing} HP from ${effect.effectName}`, effect.target, effect.healing)
                        triggerParticles('heal', { x: 50, y: 70 })
                    } else if (effect.damage) {
                        addLogEntry('damage', `${effect.target} takes ${effect.damage} damage from ${effect.effectName}`, effect.target, effect.damage)
                        triggerParticles('damage', { x: 50, y: 70 })
                    }
                }
            }

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

    // Handler for using consumables from party display
    const handleUseConsumableFromParty = (heroId: string, slot: string) => {
        // Only allow consumable use during hero's turn and not during boss actions
        if (isProcessing || isBossActing || isUnmounting.current) return

        const currentCombatant = getCurrentCombatant(event.combatState!)
        if (!currentCombatant || currentCombatant.id !== heroId) {
            // Not this hero's turn
            return
        }

        // Use the existing hero action handler
        handleHeroAction(heroId, `item:${slot}`)
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

            {/* Main Combat Layout - Three Column Design */}
            <HStack
                className="boss-combat-screen flex-responsive"
                position="relative"
                zIndex={1}
                h="full"
                spacing={3}
                align="stretch"
                p={{ base: 2, md: 4 }}
            >
                {/* Left Sidebar - Turn Order & Combat Info */}
                <VStack
                    className="combat-left-sidebar landscape-only"
                    flex="0 0 250px"
                    spacing={4}
                    align="stretch"
                    h="full"
                >
                    <TurnOrderDisplay
                        combatState={combatState}
                        party={activeHeroes}
                    />

                    {/* Combat Stats */}
                    <Box
                        bg="blackAlpha.700"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                        p={3}
                        flex="1"
                        minH={0}
                    >
                        <VStack align="stretch" spacing={2} fontSize="sm">
                            <Box>
                                <Text color="whiteAlpha.600">Round</Text>
                                <Text color="white" fontSize="xl" fontWeight="bold">
                                    {combatState.combatDepth}
                                </Text>
                            </Box>
                            <Box>
                                <Text color="whiteAlpha.600">Boss Phase</Text>
                                <Text color="white" fontSize="xl" fontWeight="bold">
                                    {combatState.currentPhase + 1}
                                </Text>
                            </Box>
                        </VStack>
                    </Box>
                </VStack>

                {/* Center Column - Boss & Party */}
                <VStack
                    flex="1"
                    spacing={{ base: 0, md: 4 }}
                    justify="flex-start"
                    align="stretch"
                    h="full"
                    minH={0}
                    minW={0}
                    overflow="hidden"
                >
                    {/* Portrait Mode: Combat Info Header */}
                    <HStack className="combat-info-header-portrait portrait-only" display="none">
                        <Box>
                            <Text>Round</Text>
                            <Text>{combatState.combatDepth}</Text>
                        </Box>
                        <Box>
                            <Text>Phase</Text>
                            <Text>{combatState.currentPhase + 1}</Text>
                        </Box>
                    </HStack>

                    {/* Portrait Mode: Horizontal Turn Order */}
                    <HStack className="turn-order-horizontal-portrait portrait-only" display="none">
                        {combatState.turnOrder && combatState.turnOrder.map((combatant, index) => {
                            const isBoss = combatant.id === 'boss'
                            const hero = isBoss ? null : activeHeroes.find(h => h.id === combatant.id)
                            const isCurrent = index === (combatState.currentTurnIndex || 0)
                            const isPast = index < (combatState.currentTurnIndex || 0)
                            
                            const CombatantIcon = isBoss 
                                ? GiSkullCrossedBones 
                                : hero 
                                    ? (GameIcons as any)[hero.class.icon] || GiSwordman
                                    : GiSwordman

                            return (
                                <Box
                                    key={`turn-${combatant.id}-${index}`}
                                    className={`turn-indicator-portrait ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''} ${isBoss ? 'boss' : 'hero'}`}
                                >
                                    <Icon as={CombatantIcon} />
                                    <Text>{isBoss ? 'Boss' : hero?.name || '?'}</Text>
                                </Box>
                            )
                        })}
                    </HStack>

                    {/* Boss Display */}
                    <Box flex="0 0 auto" className="landscape-only">
                        <BossDisplay
                            event={event}
                            combatState={combatState}
                            isActing={isBossActing}
                            onPhaseChange={(phase: number) => addLogEntry('phase', `Boss enters Phase ${phase}!`)}
                        />
                    </Box>

                    {/* Party Health Display */}
                    <Box flex="0 0 auto" w="full" className="landscape-only">
                        <PartyHealthDisplay
                            party={activeHeroes}
                            combatState={combatState}
                            onUseConsumable={handleUseConsumableFromParty}
                        />
                    </Box>

                    {/* Portrait Mode: Scrollable Content Area */}
                    <VStack 
                        className="combat-content-portrait portrait-only" 
                        display="none"
                        flex="1"
                        minH={0}
                        overflowY="auto"
                        overflowX="hidden"
                        w="full"
                        spacing={2}
                        pb={2}
                    >
                        <Box w="full">
                            <BossDisplay
                                event={event}
                                combatState={combatState}
                                isActing={isBossActing}
                                onPhaseChange={(phase: number) => addLogEntry('phase', `Boss enters Phase ${phase}!`)}
                            />
                        </Box>
                        <Box w="full">
                            <PartyHealthDisplay
                                party={activeHeroes}
                                combatState={combatState}
                                onUseConsumable={handleUseConsumableFromParty}
                            />
                        </Box>
                    </VStack>
                    
                    {/* Mobile Combat Actions - Portrait Only - Fixed at Bottom */}
                    <Box className="combat-actions-portrait portrait-only" display="none" flex="0 0 auto" w="full">
                        <CombatActionsPanel
                            party={activeHeroes}
                            combatState={combatState}
                            isProcessing={isProcessing}
                            onAction={handleHeroAction}
                            onEndTurn={handleEndTurn}
                            onFlee={onFlee}
                        />
                    </Box>
                </VStack>

                {/* Right Sidebar - Combat Actions & Log */}
                <VStack
                    className="combat-right-sidebar landscape-only"
                    flex="0 0 250px"
                    spacing={1}
                    align="stretch"
                    h="full"
                    minH={0}
                    overflow="hidden"
                >
                    {/* Combat Actions */}
                    <Box flex="0 0 auto">
                        <CombatActionsPanel
                            party={activeHeroes}
                            combatState={combatState}
                            isProcessing={isProcessing}
                            onAction={handleHeroAction}
                            onEndTurn={handleEndTurn}
                            onFlee={onFlee}
                        />
                    </Box>

                    {/* Combat Log */}
                    <Box flex="1" minH={0} overflow="hidden">
                        <CombatLog entries={combatLog} />
                    </Box>
                </VStack>
            </HStack>

            {/* Particle Effects */}
            <CombatParticles
                effect={particleEffect}
                position={particlePosition}
                onComplete={() => setParticleEffect(null)}
            />

            {/* Floating Combat Log Button - Portrait Only */}
            <Box className="combat-log-fab-container portrait-only" display="none">
                <IconButton
                    aria-label="View Combat Log"
                    icon={<GiScrollUnfurled size={24} />}
                    colorScheme="purple"
                    size="lg"
                    isRound
                    onClick={onCombatLogOpen}
                    boxShadow="0 4px 12px rgba(139, 92, 246, 0.5)"
                    _active={{ transform: "scale(0.9)" }}
                />
            </Box>

            {/* Combat Log Modal - Portrait Only */}
            <Modal isOpen={isCombatLogOpen} onClose={onCombatLogClose} size="full" scrollBehavior="inside">
                <ModalOverlay bg="blackAlpha.900" backdropFilter="blur(4px)" />
                <ModalContent bg="gray.900" maxH="90vh" mx={2}>
                    <ModalHeader color="purple.400">Combat Log</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6} px={2}>
                        <CombatLog entries={combatLog} />
                    </ModalBody>
                </ModalContent>
            </Modal>

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
                        pointerEvents="none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MotionBox
                            fontSize={{ base: "4xl", md: "6xl" }}
                            fontWeight="bold"
                            color={checkVictory(combatState) ? 'green.400' : 'red.400'}
                            textShadow="0 0 20px currentColor"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            {checkVictory(combatState) ? 'VICTORY!' : 'DEFEAT'}
                        </MotionBox>
                    </MotionBox>
                )}
            </AnimatePresence>
        </MotionBox>
    )
}
