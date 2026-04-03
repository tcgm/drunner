import {
  VStack,
  HStack,
  Text,
  Box,
  Icon,
  Badge,
  Button,
  Progress,
  Tooltip,
} from '@chakra-ui/react'
import { GiCoins, GiStarsStack, GiScrollQuill, GiStairs } from 'react-icons/gi'
import { FaHourglass, FaCheck } from 'react-icons/fa'
import { getRarityColor, getRarityConfig } from '@/systems/rarity/raritySystem'
import {
  DIFFICULTY_COLOR,
  DIFFICULTY_LABEL,
  QUEST_TYPE_ICON,
  formatTimeLeft,
} from './questHelpers'
import type { Quest } from '@/types/quests'

export interface QuestCardProps {
  quest: Quest
  onAccept?: () => void
  onClaim?: () => void
}

export function QuestCard({ quest, onAccept, onClaim }: QuestCardProps) {
  const pct = quest.requirement > 0
    ? Math.min(100, Math.round((quest.progress / quest.requirement) * 100))
    : 0

  const safeRarity   = quest.rarity ?? 'common'
  const rarityColor  = getRarityColor(safeRarity)
  const rarityConfig = getRarityConfig(safeRarity)
  const diffColor    = DIFFICULTY_COLOR[quest.difficulty]
  const TypeIcon     = QUEST_TYPE_ICON[quest.type]

  const borderColor  = quest.status === 'completed' ? '#48BB78' : rarityColor
  const glowOpacity  = quest.status === 'completed' ? '33' : '28'
  const bgGrad       =
    quest.status === 'completed'
      ? 'linear-gradient(135deg,rgba(56,161,105,0.10) 0%,rgba(26,32,44,0.97) 100%)'
      : `linear-gradient(135deg,${rarityColor}0e 0%,rgba(26,32,44,0.97) 100%)`

  return (
    <Box
      background={bgGrad}
      border="1px solid"
      borderColor={`${borderColor}99`}
      borderRadius="xl"
      p={4}
      boxShadow={`0 0 10px ${borderColor}${glowOpacity}`}
      _hover={{
        borderColor: borderColor,
        boxShadow: `0 0 20px ${borderColor}44`,
      }}
      transition="all 0.15s"
      position="relative"
    >
      <HStack spacing={3} mb={2} align="flex-start">
        <Box
          bg="gray.900"
          border="1px solid"
          borderColor={`${rarityColor}66`}
          borderRadius="lg"
          p={2}
          flexShrink={0}
          boxShadow={`inset 0 0 8px ${rarityColor}18`}
        >
          <Icon as={TypeIcon} color={rarityColor} boxSize={5} />
        </Box>

        <VStack spacing={0.5} align="flex-start" flex={1} minW={0}>
          <HStack spacing={2} flexWrap="wrap" align="center">
            <Text
              color={rarityColor}
              fontWeight="bold"
              fontSize="sm"
              noOfLines={1}
              textShadow={`0 0 12px ${rarityColor}55`}
            >
              {quest.title}
            </Text>

            <Text
              as="span"
              color={rarityColor}
              fontWeight="semibold"
              fontSize="2xs"
              textTransform="capitalize"
              opacity={0.85}
              letterSpacing="wide"
              flexShrink={0}
            >
              [{rarityConfig.name}]
            </Text>

            <Badge colorScheme={diffColor} fontSize="2xs" textTransform="capitalize" flexShrink={0}>
              {DIFFICULTY_LABEL[quest.difficulty]}
            </Badge>

            {(quest.minFloor ?? 0) > 0 && (
              <Tooltip label={`Requires reaching Floor ${quest.minFloor}`} placement="top">
                <HStack spacing={0.5} flexShrink={0}>
                  <Icon as={GiStairs} boxSize={2.5} color="gray.500" />
                  <Text fontSize="2xs" color="gray.500">{quest.minFloor}+</Text>
                </HStack>
              </Tooltip>
            )}

            {quest.status === 'completed' && <Badge colorScheme="green"  fontSize="2xs">Complete!</Badge>}
            {quest.status === 'active'    && <Badge colorScheme="orange" fontSize="2xs">Active</Badge>}
          </HStack>
          <Text color="gray.400" fontSize="xs" noOfLines={2}>{quest.description}</Text>
        </VStack>
      </HStack>

      {(quest.status === 'active' || quest.status === 'completed') && (
        <Box mb={3}>
          <HStack justify="space-between" mb={1}>
            <Text fontSize="2xs" color="gray.500">Progress</Text>
            <Text fontSize="2xs" fontWeight="bold" style={{ color: quest.status === 'completed' ? '#48BB78' : rarityColor }}>
              {quest.progress.toLocaleString()} / {quest.requirement.toLocaleString()}
            </Text>
          </HStack>
          <Progress
            value={pct}
            size="xs"
            colorScheme={quest.status === 'completed' ? 'green' : 'orange'}
            bg="gray.700"
            borderRadius="full"
          />
        </Box>
      )}

      <HStack justify="space-between" align="center">
        <HStack spacing={3} fontSize="xs">
          <HStack spacing={1} color="yellow.400">
            <Icon as={GiCoins} boxSize={3.5} />
            <Text fontWeight="bold">{quest.reward.gold.toLocaleString()}g</Text>
          </HStack>
          <HStack spacing={1} color="cyan.400">
            <Icon as={GiStarsStack} boxSize={3.5} />
            <Text fontWeight="bold">{quest.reward.metaXp.toLocaleString()} XP</Text>
          </HStack>
        </HStack>
        <HStack spacing={2}>
          {quest.status === 'available' && (
            <>
              <Tooltip label={`Expires in ${formatTimeLeft(quest.expiresAt)}`} placement="top">
                <HStack spacing={1} fontSize="2xs" color="gray.500">
                  <Icon as={FaHourglass} boxSize={2.5} />
                  <Text>{formatTimeLeft(quest.expiresAt)}</Text>
                </HStack>
              </Tooltip>
              <Button
                size="xs"
                colorScheme="orange"
                onClick={onAccept}
                leftIcon={<Icon as={GiScrollQuill} />}
              >
                Accept
              </Button>
            </>
          )}
          {quest.status === 'completed' && (
            <Button
              size="xs"
              colorScheme="green"
              onClick={onClaim}
              leftIcon={<Icon as={FaCheck} />}
              _hover={{ transform: 'scale(1.05)' }}
              transition="transform 0.1s"
            >
              Claim Reward
            </Button>
          )}
        </HStack>
      </HStack>
    </Box>
  )
}
