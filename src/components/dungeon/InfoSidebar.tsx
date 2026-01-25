import { VStack, Heading, Box } from '@chakra-ui/react'
import type { Hero } from '@/types'
import FloorStats from './FloorStats'
import PartyStatusStats from './PartyStatusStats'
import QuickStats from './QuickStats'

interface InfoSidebarProps {
  party: Hero[]
}

export default function InfoSidebar({ party }: InfoSidebarProps) {
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

  return (
    <Box w="250px" bg="gray.800" borderRadius="lg" p={4}>
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
            partySize={party.length}
          />
        </Box>
      </VStack>
    </Box>
  )
}
