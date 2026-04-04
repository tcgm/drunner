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
import { useState } from 'react'
import { GiCoins, GiStarsStack, GiScrollQuill, GiStairs, GiCrystalShine } from 'react-icons/gi'
import { FaHourglass, FaCheck } from 'react-icons/fa'
import { getRarityColor, getRarityConfig } from '@/systems/rarity/raritySystem'
import { getMaterialById } from '@data/items/materials'
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
  onCancel?: () => void
  onClaim?: () => void
}

export function QuestCard({ quest, onAccept, onCancel, onClaim }: QuestCardProps) {
  const [pendingCancel, setPendingCancel] = useState(false)
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

    {quest.status === 'active' && onCancel && (
      <Box position="absolute" top={2} right={2}>
        {pendingCancel ? (
          <HStack spacing={1}>
            <Button
              size="xs" variant="ghost" colorScheme="gray" fontSize="2xs"
              onClick={() => setPendingCancel(false)}
            >
              Keep
            </Button>
            <Button
              size="xs" colorScheme="red" fontSize="2xs"
              onClick={() => { setPendingCancel(false); onCancel() }}
            >
              Abandon
            </Button>
          </HStack>
        ) : (
          <Tooltip label="Abandon quest" placement="top">
            <Button
              size="xs" variant="ghost" color="gray.600" fontSize="xs"
              _hover={{ color: 'red.400' }}
              onClick={() => setPendingCancel(true)}
              aria-label="Abandon quest"
            >
              ✕
            </Button>
          </Tooltip>
        )}
      </Box>
    )}

      {(quest.status === 'active' || quest.status === 'completed') && (
        <Box mb={2}>
          <HStack justify="space-between" mb={1}>
            <Text fontSize="xs" color="gray.400">
              Progress
            </Text>
            <Text fontSize="xs" color="gray.300" fontWeight="medium">
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
        <HStack spacing={3} fontSize="xs" flexWrap="wrap">
          <HStack spacing={1} color="yellow.400">
            <Icon as={GiCoins} boxSize={3.5} />
            <Text fontWeight="bold">{quest.reward.gold.toLocaleString()}g</Text>
          </HStack>
          <HStack spacing={1} color="cyan.400">
            <Icon as={GiStarsStack} boxSize={3.5} />
            <Text fontWeight="bold">{quest.reward.metaXp.toLocaleString()} XP</Text>
          </HStack>
          {(quest.reward.items ?? []).map((reward, i) => {
            if (reward.type !== 'material_fragment') return null
            const mat = getMaterialById(reward.materialId)
            const matColor = getRarityColor(mat?.rarity ?? 'common')
            return (
              <Tooltip key={i} label={`${mat?.name ?? reward.materialId} Fragment ×${reward.quantity}`} placement="top">
                <HStack spacing={1} style={{ color: matColor }}>
                  <Icon as={mat?.icon ?? GiCrystalShine} boxSize={3.5} />
                  <Text fontWeight="bold" fontSize="2xs">
                    {mat?.name ?? reward.materialId} ×{reward.quantity}
                  </Text>
                </HStack>
              </Tooltip>
            )
          })}
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
