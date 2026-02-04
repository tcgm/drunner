import { VStack, Heading, Text, Box } from '@chakra-ui/react'
import PartyMemberCard from '@components/party/PartyMemberCard'
import type { Hero } from '@/types'

interface PartySidebarProps {
  party: Hero[]
  heroEffects?: Record<string, Array<{ type: 'damage' | 'heal' | 'xp' | 'gold'; value: number; id: string }>>
}

export default function PartySidebar({ party, heroEffects = {} }: PartySidebarProps) {
  return (
    <Box className="party-sidebar" w="240px" bg="gray.800" borderRadius="lg" p={1} pt={0} overflowY="auto">
      <VStack className="party-sidebar-content" spacing={1} align="stretch">
        <Heading className="party-sidebar-title" size="sm" color="orange.400" px={1}>
          Party ({party.length})
        </Heading>
        
        {party.map((hero) => (
          <PartyMemberCard 
            key={hero.id} 
            hero={hero} 
            floatingEffects={heroEffects[hero.id] || []}
            isDungeon={true}
          />
        ))}
        
        {party.length === 0 && (
          <Text className="party-sidebar-empty" fontSize="sm" color="gray.500" textAlign="center" py={4}>
            No party members
          </Text>
        )}
      </VStack>
    </Box>
  )
}
