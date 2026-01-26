import { VStack, Heading, Text, Box } from '@chakra-ui/react'
import PartyMemberCard from '@components/party/PartyMemberCard'
import type { Hero } from '@/types'

interface PartySidebarProps {
  party: Hero[]
  heroEffects?: Record<string, Array<{ type: 'damage' | 'heal' | 'xp' | 'gold'; value: number; id: string }>>
}

export default function PartySidebar({ party, heroEffects = {} }: PartySidebarProps) {
  return (
    <Box w="240px" bg="gray.800" borderRadius="lg" p={3} overflowY="auto">
      <VStack spacing={3} align="stretch">
        <Heading size="sm" color="orange.400" px={1}>
          Party ({party.length})
        </Heading>
        
        {party.map((hero) => (
          <PartyMemberCard 
            key={hero.id} 
            hero={hero} 
            floatingEffects={heroEffects[hero.id] || []}
          />
        ))}
        
        {party.length === 0 && (
          <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
            No party members
          </Text>
        )}
      </VStack>
    </Box>
  )
}
