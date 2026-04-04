import {
  VStack,
  HStack,
  Text,
  Box,
  Icon,
  Badge,
} from '@chakra-ui/react'
import { GiScrollQuill } from 'react-icons/gi'
import { FaHourglass } from 'react-icons/fa'
import { QuestCard } from './QuestCard'
import type { Quest } from '@/types/quests'

interface QuestBoardProps {
  quests: Quest[]
  onAccept: (questId: string) => void
  onCancel: (questId: string) => void
  onClaim: (quest: Quest) => void
  refreshLabel: string
}

export function QuestBoard({ quests, onAccept, onCancel, onClaim, refreshLabel }: QuestBoardProps) {
  const completedQuests = quests.filter(q => q.status === 'completed')
  const activeQuests    = quests.filter(q => q.status === 'active')
  const availableQuests = quests.filter(q => q.status === 'available')

  return (
    <Box flex={{ base: 'none', md: '0 0 40%' }} display="flex" flexDirection="column" overflow="hidden" minH={0}>

      {/* Board header */}
      <Box
        px={5} py={3}
        borderBottom="1px solid" borderColor="gray.800"
        bgGradient="linear(to-r,rgba(120,53,15,0.15),transparent)"
        flexShrink={0}
      >
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Icon as={GiScrollQuill} color="orange.400" boxSize={5} />
            <Text color="orange.300" fontWeight="bold" fontSize="md" letterSpacing="wide">
              Quest Board
            </Text>
            {completedQuests.length > 0 && (
              <Badge colorScheme="green"  fontSize="xs" borderRadius="full">{completedQuests.length} complete</Badge>
            )}
            {activeQuests.length > 0 && (
              <Badge colorScheme="orange" fontSize="xs" borderRadius="full">{activeQuests.length} active</Badge>
            )}
          </HStack>
          <HStack spacing={1} fontSize="2xs" color="gray.600">
            <Icon as={FaHourglass} boxSize={2.5} />
            <Text>Refreshes {refreshLabel}</Text>
          </HStack>
        </HStack>
      </Box>

      {/* Quest list */}
      <Box
        flex={1} overflowY="auto" px={5} py={4}
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: '#4A5568', borderRadius: '2px' },
        }}
      >
        <VStack spacing={3} align="stretch">
          {completedQuests.map(q => (
            <QuestCard key={q.id} quest={q} onClaim={() => onClaim(q)} />
          ))}
          {activeQuests.map(q => (
            <QuestCard key={q.id} quest={q} onCancel={() => onCancel(q.id)} />
          ))}

          {availableQuests.length > 0 && (activeQuests.length > 0 || completedQuests.length > 0) && (
            <HStack spacing={3}>
              <Box flex={1} h="1px" bg="gray.800" />
              <Text fontSize="2xs" color="gray.600" flexShrink={0}>Available</Text>
              <Box flex={1} h="1px" bg="gray.800" />
            </HStack>
          )}

          {availableQuests.map(q => (
            <QuestCard key={q.id} quest={q} onAccept={() => onAccept(q.id)} />
          ))}

          {quests.filter(q => q.status !== 'claimed').length === 0 && (
            <VStack py={12} spacing={3} opacity={0.5}>
              <Icon as={GiScrollQuill} color="gray.700" boxSize={10} />
              <Text color="gray.600" textAlign="center" fontSize="sm">
                The board is empty.<br />New quests will appear shortly.
              </Text>
            </VStack>
          )}
        </VStack>
      </Box>
    </Box>
  )
}
