import { VStack, Text, HStack, Tooltip } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiSwordman, GiShield, GiRun, GiClover, GiMagicSwirl, GiSpellBook, GiTiedScroll } from 'react-icons/gi'
import { GAME_CONFIG } from '@/config/gameConfig'

interface QuickStatsProps {
  totalAttack: number
  totalDefense: number
  totalSpeed: number
  totalLuck: number
  totalMagic: number
  totalWisdom: number
  totalCharisma: number
  maxAttack: number
  maxDefense: number
  maxSpeed: number
  maxLuck: number
  maxMagic: number
  maxWisdom: number
  maxCharisma: number
  partySize: number
}

export default function QuickStats({ totalAttack, totalDefense, totalSpeed, totalLuck, totalMagic, totalWisdom, totalCharisma, maxAttack, maxDefense, maxSpeed, maxLuck, maxMagic, maxWisdom, maxCharisma, partySize }: QuickStatsProps) {
  const avgAttack = partySize > 0 ? Math.floor(totalAttack / partySize) : 0
  const avgDefense = partySize > 0 ? Math.floor(totalDefense / partySize) : 0
  const avgSpeed = partySize > 0 ? Math.floor(totalSpeed / partySize) : 0
  const avgLuck = partySize > 0 ? Math.floor(totalLuck / partySize) : 0
  const avgMagic = partySize > 0 ? Math.floor(totalMagic / partySize) : 0
  const avgWisdom = partySize > 0 ? Math.floor(totalWisdom / partySize) : 0
  const avgCharisma = partySize > 0 ? Math.floor(totalCharisma / partySize) : 0

  return (
    <>
      <Text className="quick-stats-title" fontSize="sm" fontWeight="bold" mb={1}>Quick Stats</Text>
      <VStack className="quick-stats" align="stretch" spacing={1} fontSize="sm">
        <HStack className="quick-stats-stat quick-stats-stat--attack">
          <Icon as={GiSwordman} color={GAME_CONFIG.colors.stats.attack} />
          <Text color="gray.400">ATK:</Text>
          <Text color={GAME_CONFIG.colors.stats.attack} fontWeight="bold">
            <Tooltip label="Total Attack" placement="top">
              <Text as="span">{totalAttack}</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Average Attack" placement="top">
              <Text as="span" color="gray.400">({avgAttack})</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Highest Attack" placement="top">
              <Text as="span" color={GAME_CONFIG.colors.stats.attack}>[{maxAttack}]</Text>
            </Tooltip>
          </Text>
        </HStack>
        <HStack className="quick-stats-stat quick-stats-stat--defense">
          <Icon as={GiShield} color={GAME_CONFIG.colors.stats.defense} />
          <Text color="gray.400">DEF:</Text>
          <Text color={GAME_CONFIG.colors.stats.defense} fontWeight="bold">
            <Tooltip label="Total Defense" placement="top">
              <Text as="span">{totalDefense}</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Average Defense" placement="top">
              <Text as="span" color="gray.400">({avgDefense})</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Highest Defense" placement="top">
              <Text as="span" color={GAME_CONFIG.colors.stats.defense}>[{maxDefense}]</Text>
            </Tooltip>
          </Text>
        </HStack>
        <HStack className="quick-stats-stat quick-stats-stat--speed">
          <Icon as={GiRun} color={GAME_CONFIG.colors.stats.speed} />
          <Text color="gray.400">SPD:</Text>
          <Text color={GAME_CONFIG.colors.stats.speed} fontWeight="bold">
            <Tooltip label="Total Speed" placement="top">
              <Text as="span">{totalSpeed}</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Average Speed" placement="top">
              <Text as="span" color="gray.400">({avgSpeed})</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Highest Speed" placement="top">
              <Text as="span" color={GAME_CONFIG.colors.stats.speed}>[{maxSpeed}]</Text>
            </Tooltip>
          </Text>
        </HStack>
        <HStack className="quick-stats-stat quick-stats-stat--luck">
          <Icon as={GiClover} color={GAME_CONFIG.colors.stats.luck} />
          <Text color="gray.400">LCK:</Text>
          <Text color={GAME_CONFIG.colors.stats.luck} fontWeight="bold">
            <Tooltip label="Total Luck" placement="top">
              <Text as="span">{totalLuck}</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Average Luck" placement="top">
              <Text as="span" color="gray.400">({avgLuck})</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Highest Luck" placement="top">
              <Text as="span" color={GAME_CONFIG.colors.stats.luck}>[{maxLuck}]</Text>
            </Tooltip>
          </Text>
        </HStack>
        <HStack className="quick-stats-stat quick-stats-stat--magic">
          <Icon as={GiMagicSwirl} color={GAME_CONFIG.colors.stats.magicPower} />
          <Text color="gray.400">MAG:</Text>
          <Text color={GAME_CONFIG.colors.stats.magicPower} fontWeight="bold">
            <Tooltip label="Total Magic Power" placement="top">
              <Text as="span">{totalMagic}</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Average Magic Power" placement="top">
              <Text as="span" color="gray.400">({avgMagic})</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Highest Magic Power" placement="top">
              <Text as="span" color={GAME_CONFIG.colors.stats.magicPower}>[{maxMagic}]</Text>
            </Tooltip>
          </Text>
        </HStack>
        <HStack className="quick-stats-stat quick-stats-stat--wisdom">
          <Icon as={GiSpellBook} color={GAME_CONFIG.colors.stats.wisdom} />
          <Text color="gray.400">WIS:</Text>
          <Text color={GAME_CONFIG.colors.stats.wisdom} fontWeight="bold">
            <Tooltip label="Total Wisdom" placement="top">
              <Text as="span">{totalWisdom}</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Average Wisdom" placement="top">
              <Text as="span" color="gray.400">({avgWisdom})</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Highest Wisdom" placement="top">
              <Text as="span" color={GAME_CONFIG.colors.stats.wisdom}>[{maxWisdom}]</Text>
            </Tooltip>
          </Text>
        </HStack>
        <HStack className="quick-stats-stat quick-stats-stat--charisma">
          <Icon as={GiTiedScroll} color={GAME_CONFIG.colors.stats.charisma} />
          <Text color="gray.400">CHA:</Text>
          <Text color={GAME_CONFIG.colors.stats.charisma} fontWeight="bold">
            <Tooltip label="Total Charisma" placement="top">
              <Text as="span">{totalCharisma}</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Average Charisma" placement="top">
              <Text as="span" color="gray.400">({avgCharisma})</Text>
            </Tooltip>
            {' '}
            <Tooltip label="Highest Charisma" placement="top">
              <Text as="span" color={GAME_CONFIG.colors.stats.charisma}>[{maxCharisma}]</Text>
            </Tooltip>
          </Text>
        </HStack>
      </VStack>
    </>
  )
}
