/**
 * Combat Log Component - Battle Event Feed
 * 
 * Scrolling log of combat actions and events
 */

import './CombatLog.css'
import { Box, VStack, HStack, Text, Icon } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { CombatLogEntry } from './BossCombatScreen'
import {
    GiSwordWound,
    GiHeartPlus,
    GiShield,
    GiPoisonBottle,
    GiSparkles,
    GiCrossedSwords,
    GiHourglass
} from 'react-icons/gi'

const MotionBox = motion.create(Box)

interface CombatLogProps {
    entries: CombatLogEntry[]
}

function getCombatLogIcon(type: CombatLogEntry['type']) {
    switch (type) {
        case 'damage': return GiSwordWound
        case 'heal': return GiHeartPlus
        case 'buff': return GiShield
        case 'debuff': return GiPoisonBottle
        case 'ability': return GiSparkles
        case 'action': return GiCrossedSwords
        case 'phase': return GiSparkles
        case 'turn': return GiHourglass
        default: return GiCrossedSwords
    }
}

function getCombatLogColor(type: CombatLogEntry['type']) {
    switch (type) {
        case 'damage': return 'red.400'
        case 'heal': return 'green.400'
        case 'buff': return 'blue.400'
        case 'debuff': return 'orange.400'
        case 'ability': return 'purple.400'
        case 'action': return 'yellow.400'
        case 'phase': return 'pink.400'
        case 'turn': return 'gray.400'
        default: return 'white'
    }
}

export default function CombatLog({ entries }: CombatLogProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when new entries added
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [entries])

    return (
        <Box
            className="combat-log"
            bg="blackAlpha.700"
            borderWidth="2px"
            borderColor="gray.600"
            borderRadius="lg"
            p={4}
            h="full"
            display="flex"
            flexDirection="column"
            boxShadow="inset 0 2px 8px rgba(0, 0, 0, 0.6)"
        >
            {/* Header */}
            <HStack mb={3} pb={2} borderBottom="1px solid" borderColor="gray.700">
                <Icon as={GiCrossedSwords} boxSize={5} color="gray.400" />
                <Text
                    fontSize="md"
                    fontWeight="bold"
                    color="gray.300"
                    letterSpacing="wider"
                >
                    COMBAT LOG
                </Text>
            </HStack>

            {/* Log Entries */}
            <VStack
                ref={scrollRef}
                spacing={2}
                align="stretch"
                flex={1}
                overflow="auto"
                css={{
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                    },
                }}
            >
                {entries.length === 0 ? (
                    <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
                        Combat log is empty
                    </Text>
                ) : (
                    <AnimatePresence initial={false}>
                        {entries.map((entry) => {
                            const LogIcon = getCombatLogIcon(entry.type)
                            const color = getCombatLogColor(entry.type)

                            return (
                                <MotionBox
                                    key={entry.id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    bg="blackAlpha.500"
                                    borderRadius="md"
                                    p={2}
                                    borderLeft="3px solid"
                                    borderColor={color}
                                >
                                    <HStack spacing={2} align="start">
                                        <Icon
                                            as={LogIcon}
                                            boxSize={4}
                                            color={color}
                                            mt={0.5}
                                            flexShrink={0}
                                        />
                                        <VStack align="start" spacing={0} flex={1} minW={0}>
                                            <Text
                                                fontSize="sm"
                                                color="white"
                                                lineHeight="short"
                                            >
                                                {entry.message}
                                            </Text>
                                            {entry.value !== undefined && (
                                                <Text
                                                    fontSize="xs"
                                                    color={color}
                                                    fontWeight="bold"
                                                >
                                                    {entry.type === 'damage' ? '-' : '+'}{entry.value}
                                                </Text>
                                            )}
                                        </VStack>
                                        <Text
                                            fontSize="2xs"
                                            color="gray.500"
                                            flexShrink={0}
                                        >
                                            {new Date(entry.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })}
                                        </Text>
                                    </HStack>
                                </MotionBox>
                            )
                        })}
                    </AnimatePresence>
                )}
            </VStack>
        </Box>
    )
}
