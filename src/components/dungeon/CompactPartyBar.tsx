import { HStack, Box, Text, Progress } from '@chakra-ui/react'
import type { Hero } from '@/types'
import { calculateTotalStats } from '@/utils/statCalculator'

interface CompactPartyBarProps {
  party: Hero[]
  onClick?: () => void
}

export default function CompactPartyBar({ party, onClick }: CompactPartyBarProps) {
  return (
    <HStack 
      className="compact-party-bar"
      display={{ base: "flex", lg: "none" }}
      bg="gray.800" 
      borderRadius="md" 
      p={2} 
      spacing={1}
      overflowX="auto"
      cursor={onClick ? "pointer" : "default"}
      onClick={onClick}
      _hover={onClick ? { bg: "gray.750" } : undefined}
      transition="background 0.2s"
    >
      {party.map((hero) => {
        const totalStats = calculateTotalStats(hero)
        const hpPercent = (hero.stats.hp / totalStats.maxHp) * 100
        const isAlive = hero.isAlive
        
        // Determine HP color
        let hpColor = "green.400"
        if (hpPercent < 25) hpColor = "red.500"
        else if (hpPercent < 50) hpColor = "orange.500"
        else if (hpPercent < 75) hpColor = "yellow.500"
        
        return (
          <Box 
            key={hero.id}
            minW="80px"
            maxW="120px"
            flex="1 1 0"
            bg={isAlive ? "gray.700" : "gray.900"}
            borderRadius="md"
            p={1.5}
            borderWidth="1px"
            borderColor={isAlive ? "gray.600" : "red.900"}
            opacity={isAlive ? 1 : 0.5}
          >
            <Text 
              fontSize="xs" 
              fontWeight="bold" 
              color={isAlive ? "orange.300" : "gray.500"}
              isTruncated
              mb={0.5}
            >
              {hero.name}
            </Text>
            <Text fontSize="2xs" color="gray.400" mb={1}>
              Lv{hero.level}
            </Text>
            {isAlive ? (
              <>
                <Progress 
                  value={hpPercent} 
                  size="xs" 
                  colorScheme={hpColor.split('.')[0]} 
                  borderRadius="full"
                  mb={0.5}
                />
                <Text fontSize="2xs" color="gray.300" textAlign="center">
                  {hero.stats.hp}/{totalStats.maxHp}
                </Text>
              </>
            ) : (
              <Text fontSize="2xs" color="red.400" textAlign="center" fontWeight="bold">
                💀 KO
              </Text>
            )}
          </Box>
        )
      })}
      
      {party.length === 0 && (
        <Text fontSize="sm" color="gray.500" textAlign="center" w="full">
          No party members
        </Text>
      )}
    </HStack>
  )
}
