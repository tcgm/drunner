import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    VStack,
    HStack,
    Text,
    Box,
    Icon,
    Badge,
    Button,
} from '@chakra-ui/react'
import { GiScrollQuill, GiVikingLonghouse } from 'react-icons/gi'
import { QuestCard } from '@/components/ui/GuildHall/QuestCard'
import type { Quest } from '@/types/quests'
import type { Run } from '@/types'

interface CurrentQuestsModalProps {
    isOpen: boolean
    onClose: () => void
    quests: Quest[]
    onGoToTown?: () => void
    /** Current active (in-progress) run – used to show pending progress mid-dungeon */
    activeRun?: Run | null
}

function getPendingDelta(quest: Quest, run: Run): number {
    switch (quest.type) {
        case 'kill_enemies': return run.enemiesDefeated ?? 0
        case 'defeat_bosses': return run.bossesDefeated ?? 0
        case 'earn_gold': return run.goldEarned ?? 0
        case 'reach_floor': {
            const floor = run.finalFloor ?? 0
            if (floor >= quest.requirement && quest.progress < quest.requirement) {
                return quest.requirement - quest.progress
            }
            return 0
        }
        case 'complete_runs': return 0 // can't count mid-run
        default: return 0
    }
}

export function CurrentQuestsModal({ isOpen, onClose, quests, onGoToTown, activeRun }: CurrentQuestsModalProps) {
    const completedQuests = quests.filter(q => q.status === 'completed')
    const activeQuests = quests.filter(q => q.status === 'active')
    const availableQuests = quests.filter(q => q.status === 'available')

    const handleGoToTown = () => {
        onClose()
        onGoToTown?.()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
            <ModalContent bg="gray.900" border="1px solid" borderColor="orange.800" maxH="80vh">
                <ModalHeader borderBottom="1px solid" borderColor="gray.800" pb={3}>
                    <HStack spacing={3}>
                        <Icon as={GiScrollQuill} color="orange.400" boxSize={5} />
                        <Text color="orange.300" fontWeight="bold">Current Quests</Text>
                        {completedQuests.length > 0 && (
                            <Badge colorScheme="green" borderRadius="full">{completedQuests.length} complete</Badge>
                        )}
                        {activeQuests.length > 0 && (
                            <Badge colorScheme="orange" borderRadius="full">{activeQuests.length} active</Badge>
                        )}
                    </HStack>
                </ModalHeader>
                <ModalCloseButton color="gray.400" />

                <ModalBody py={4}
                    css={{
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-track': { background: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { background: '#4A5568', borderRadius: '2px' },
                    }}
                >
                    {quests.filter(q => q.status !== 'claimed').length === 0 ? (
                        <VStack py={12} spacing={3} opacity={0.5}>
                            <Icon as={GiScrollQuill} color="gray.700" boxSize={10} />
                            <Text color="gray.600" textAlign="center" fontSize="sm">
                                No active quests.<br />Visit the Guild Hall to pick up quests.
                            </Text>
                        </VStack>
                    ) : (
                        <VStack spacing={3} align="stretch">
                            {completedQuests.map(q => (
                                <QuestCard key={q.id} quest={q} />
                            ))}
                            {activeQuests.map(q => (
                                <QuestCard
                                    key={q.id}
                                    quest={q}
                                    pendingProgress={activeRun?.result === 'active' ? getPendingDelta(q, activeRun!) : undefined}
                                />
                            ))}

                            {availableQuests.length > 0 && (activeQuests.length > 0 || completedQuests.length > 0) && (
                                <HStack spacing={3}>
                                    <Box flex={1} h="1px" bg="gray.800" />
                                    <Text fontSize="2xs" color="gray.600" flexShrink={0}>Available</Text>
                                    <Box flex={1} h="1px" bg="gray.800" />
                                </HStack>
                            )}

                            {availableQuests.map(q => (
                                <QuestCard key={q.id} quest={q} />
                            ))}
                        </VStack>
                    )}
                </ModalBody>

                <ModalFooter borderTop="1px solid" borderColor="gray.800" gap={3}>
                    <Text fontSize="xs" color="gray.500" flex={1}>
                        {onGoToTown
                            ? 'Go to the Guild Hall in town to accept, cancel, or claim quests.'
                            : 'Return to town after your run to manage quests at the Guild Hall.'}
                    </Text>
                    {onGoToTown && (
                        <Button
                            colorScheme="orange"
                            variant="outline"
                            size="sm"
                            leftIcon={<Icon as={GiVikingLonghouse} />}
                            onClick={handleGoToTown}
                        >
                            Go to Town
                        </Button>
                    )}
                    <Button variant="ghost" colorScheme="gray" size="sm" onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
