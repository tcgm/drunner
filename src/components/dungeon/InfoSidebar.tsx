import { VStack, Heading, Box, Text, HStack, Divider } from '@chakra-ui/react'
import type { Hero, Run } from '@/types'
import FloorStats from './FloorStats'
import PartyStatusStats from './PartyStatusStats'
import QuickStats from './QuickStats'
import { GAME_CONFIG } from '@/config/gameConfig'

interface InfoSidebarProps {
  party: Hero[]
  activeRun: Run | null
}

export default function InfoSidebar({ party, activeRun }: InfoSidebarProps) {
  const aliveCount = party.filter(h => h.isAlive).length
  const avgLevel = party.length > 0 
    ? Math.floor(party.reduce((sum, h) => sum + h.level, 0) / party.length) 
    : 0
  const totalHp = party.reduce((sum, h) => sum + h.stats.hp, 0)
  const totalMaxHp = party.reduce((sum, h) => sum + h.stats.maxHp, 0)
  const totalAttack = party.reduce((sum, h) => sum + h.stats.attack, 0)
  const totalDefense = party.reduce((sum, h) => sum + h.stats.defense, 0)
  const totalSpeed = party.reduce((sum, h) => sum + h.stats.speed, 0)
  const totalLuck = party.reduce((sum, h) => sum + h.stats.luck, 0)
  const totalMagic = party.reduce((sum, h) => sum + (h.stats.magicPower ?? 0), 0)
  
  // Calculate max values
  const maxAttack = party.length > 0 ? Math.max(...party.map(h => h.stats.attack)) : 0
  const maxDefense = party.length > 0 ? Math.max(...party.map(h => h.stats.defense)) : 0
  const maxSpeed = party.length > 0 ? Math.max(...party.map(h => h.stats.speed)) : 0
  const maxLuck = party.length > 0 ? Math.max(...party.map(h => h.stats.luck)) : 0
  const maxMagic = party.length > 0 ? Math.max(...party.map(h => h.stats.magicPower ?? 0)) : 0

  return (
    <Box className="info-sidebar" w="250px" bg="gray.800" borderRadius="lg" p={4} overflowY="auto" maxH="100%">
      <VStack spacing={4} align="stretch">
        <Heading size="md" color="orange.400">Info</Heading>
        
        <Box>
          <FloorStats 
            eventsCleared={0} 
            enemiesDefeated={0} 
            treasureFound={0} 
          />
        </Box>
        
        <Box>
          <PartyStatusStats
            aliveCount={aliveCount}
            totalCount={party.length}
            avgLevel={avgLevel}
            currentHp={totalHp}
            maxHp={totalMaxHp}
          />
        </Box>
        
        <Box>
          <QuickStats
            totalAttack={totalAttack}
            totalDefense={totalDefense}
            totalSpeed={totalSpeed}
            totalLuck={totalLuck}
            totalMagic={totalMagic}
            maxAttack={maxAttack}
            maxDefense={maxDefense}
            maxSpeed={maxSpeed}
            maxLuck={maxLuck}
            maxMagic={maxMagic}
            partySize={party.length}
          />
        </Box>
        
        {activeRun && (
          <>
            <Divider />
            <Box>
              <Heading size="xs" color={GAME_CONFIG.colors.xp.base} mb={2}>Overflow XP</Heading>
              <HStack justify="space-between" fontSize="xs">
                <Text color="gray.400">Mentored:</Text>
                <Text color="cyan.300" fontWeight="bold">{activeRun.xpMentored || 0}</Text>
              </HStack>
              <HStack justify="space-between" fontSize="xs">
                <Text color="gray.400">Meta XP:</Text>
                <Text color={GAME_CONFIG.colors.xp.light} fontWeight="bold">{activeRun.metaXpGained || 0}</Text>
              </HStack>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  )
}
