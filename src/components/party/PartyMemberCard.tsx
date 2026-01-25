import { Box, HStack, VStack, Text, Progress, Icon, useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import type { Hero } from '@/types'
import * as GameIcons from 'react-icons/gi'
import HeroModal from './HeroModal'
import HeroTooltip from './HeroTooltip'

interface PartyMemberCardProps {
  hero: Hero
}

export default function PartyMemberCard({ hero }: PartyMemberCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isHovered, setIsHovered] = useState(false)
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman
  const hpPercent = (hero.stats.hp / hero.stats.maxHp) * 100
  
  return (
    <>
      <HeroTooltip hero={hero}>
        <Box
          bg="gray.900"
          borderRadius="md"
          borderWidth="2px"
          borderColor={isHovered ? 'orange.500' : hero.isAlive ? 'gray.700' : 'red.600'}
          opacity={hero.isAlive ? 1 : 0.5}
          transition="all 0.2s"
          cursor="pointer"
          onClick={onOpen}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          _hover={{ transform: 'translateX(4px)' }}
        >
        <HStack spacing={2} p={2}>
          <Icon as={IconComponent} boxSize={8} color="orange.400" flexShrink={0} />
          
          <VStack spacing={1} align="stretch" flex={1} minW={0}>
            <HStack spacing={2}>
              <Text fontWeight="bold" fontSize="xs" noOfLines={1} flex={1}>
                {hero.name}
              </Text>
              <Text fontSize="xs" color="orange.300" flexShrink={0}>
                Lv{hero.level}
              </Text>
            </HStack>
            
            {/* HP Bar */}
            <Box>
              <Progress 
                value={hpPercent} 
                size="xs"
                colorScheme={hpPercent > 50 ? 'green' : hpPercent > 25 ? 'yellow' : 'red'}
                borderRadius="full"
                bg="gray.700"
              />
              <HStack justify="space-between" mt={0.5}>
                <Text fontSize="2xs" color="gray.500">HP</Text>
                <Text fontSize="2xs" color="gray.400">
                  {hero.stats.hp}/{hero.stats.maxHp}
                </Text>
          </VStack>
        </HStack>
        </Box>
      </HeroTooltip>

      <HeroModal hero={hero} isOpen={isOpen} onClose={onClose} />
    </>
  )
}   </>
  )
}
