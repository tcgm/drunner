import { VStack, Text, HStack } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiSwordman, GiShield, GiRun, GiClover, GiMagicSwirl } from 'react-icons/gi'
import { GAME_CONFIG } from '@/config/gameConfig'

interface QuickStatsProps {
  totalAttack: number
  totalDefense: number
  totalSpeed: number
  totalLuck: number
  totalMagic: number
  partySize: number
}

export default function QuickStats({ totalAttack, totalDefense, totalSpeed, totalLuck, totalMagic, partySize }: QuickStatsProps) {
  const avgSpeed = partySize > 0 ? Math.floor(totalSpeed / partySize) : 0
  const avgLuck = partySize > 0 ? Math.floor(totalLuck / partySize) : 0
  const avgMagic = partySize > 0 ? Math.floor(totalMagic / partySize) : 0

  return (
    <>
      <Text fontSize="sm" fontWeight="bold" mb={2}>Quick Stats</Text>
      <VStack align="stretch" spacing={2} fontSize="xs">
        <HStack>
          <Icon as={GiSwordman} color={GAME_CONFIG.colors.stats.attack} />
          <Text color="gray.400">ATK:</Text>
          <Text color={GAME_CONFIG.colors.stats.attack} fontWeight="bold">
            {totalAttack}
          </Text>
        </HStack>
        <HStack>
          <Icon as={GiShield} color={GAME_CONFIG.colors.stats.defense} />
          <Text color="gray.400">DEF:</Text>
          <Text color={GAME_CONFIG.colors.stats.defense} fontWeight="bold">
            {totalDefense}
          </Text>
        </HStack>
        <HStack>
          <Icon as={GiRun} color={GAME_CONFIG.colors.stats.speed} />
          <Text color="gray.400">SPD:</Text>
          <Text color={GAME_CONFIG.colors.stats.speed} fontWeight="bold">
            {totalSpeed} ({avgSpeed})
          </Text>
        </HStack>
        <HStack>
          <Icon as={GiClover} color={GAME_CONFIG.colors.stats.luck} />
          <Text color="gray.400">LCK:</Text>
          <Text color={GAME_CONFIG.colors.stats.luck} fontWeight="bold">
            {totalLuck} ({avgLuck})
          </Text>
        </HStack>
        <HStack>
          <Icon as={GiMagicSwirl} color={GAME_CONFIG.colors.stats.magicPower} />
          <Text color="gray.400">MAG:</Text>
          <Text color={GAME_CONFIG.colors.stats.magicPower} fontWeight="bold">
            {totalMagic} ({avgMagic})
          </Text>
        </HStack>
      </VStack>
    </>
  )
}
