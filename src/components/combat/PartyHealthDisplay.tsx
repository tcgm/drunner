/**
 * Party Health Display Component - Hero Health Bars for Combat
 * 
 * Displays all party members with health bars, effects, and positioning
 */

import { VStack, HStack, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import type { Hero, BossCombatState } from '@/types'
import { CombatHeroCard } from './CombatHeroCard'

interface PartyHealthDisplayProps {
    party: Hero[]
    combatState: BossCombatState
    onUseConsumable?: (heroId: string, slot: string) => void
}

export default function PartyHealthDisplay({ party, combatState, onUseConsumable }: PartyHealthDisplayProps) {
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
                            <CombatHeroCard
                                key={hero.id}
                                hero={hero}
                                position="frontline"
                                slotIndex={index}
                                isActive={activeHeroId === hero.id}
                                onUseConsumable={onUseConsumable}
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
                            <CombatHeroCard
                                key={hero.id}
                                hero={hero}
                                position="backline"
                                slotIndex={index + 2}
                                isActive={activeHeroId === hero.id}
                                onUseConsumable={onUseConsumable}
                            />
                        ))}
                    </HStack>
                </VStack>
            )}
        </VStack>
    )
}
