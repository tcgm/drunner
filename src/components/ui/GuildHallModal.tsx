/**
 * GuildHallModal – immersive guild hall room with wandering heroes and quest board.
 */
import React, { useEffect, useState, useMemo, useRef } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Box,
  Icon,
  Badge,
  Button,
  Progress,
  Flex,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import {
  GiCrossedSwords,
  GiStarsStack,
  GiScrollQuill,
  GiSwordsPower,
  GiCoins,
  GiLevelThreeAdvanced,
  GiDragonHead,
  GiWalkingBoot,
  GiFireplace,
  GiBeerStein
} from 'react-icons/gi'
import { FaHourglass, FaCheck, FaTimes } from 'react-icons/fa'
import { useGameStore } from '@/core/gameStore'
import { HeroPortrait } from '@/components/party/HeroPortrait'
import { calculateTotalStats } from '@/utils/statCalculator'
import { GAME_CONFIG } from '@/config/gameConfig'
import { HeroName } from '@/components/ui/HeroName'
import { getRarityColor, getRarityConfig } from '@/systems/rarity/raritySystem'
import type { Quest, QuestDifficulty, QuestType } from '@/types/quests'
import type { Hero } from '@/types'

interface GuildHallModalProps {
  isOpen: boolean
  onClose: () => void
}

// ── Difficulty helpers ────────────────────────────────────────────────────

const DIFFICULTY_COLOR: Record<QuestDifficulty, string> = {
  easy:   'green',
  medium: 'orange',
  hard:   'red',
}

const DIFFICULTY_LABEL: Record<QuestDifficulty, string> = {
  easy:   'Easy',
  medium: 'Medium',
  hard:   'Hard',
}

const QUEST_TYPE_ICON: Record<QuestType, React.ElementType> = {
  kill_enemies:  GiSwordsPower,
  complete_runs: GiWalkingBoot,
  reach_floor:   GiLevelThreeAdvanced,
  defeat_bosses: GiDragonHead,
  earn_gold:     GiCoins,
}

function formatTimeLeft(expiresAt: number): string {
  const msLeft = expiresAt - Date.now()
  if (msLeft <= 0) return 'Expired'
  const h = Math.floor(msLeft / 3600000)
  const m = Math.floor((msLeft % 3600000) / 60000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

// ── Quest card ─────────────────────────────────────────────────────────────

function QuestCard({ quest, onAccept, onClaim }: {
  quest: Quest
  onAccept?: () => void
  onClaim?: () => void
}) {
  const pct = quest.requirement > 0
    ? Math.min(100, Math.round((quest.progress / quest.requirement) * 100))
    : 0

  // Guard against quests persisted before the rarity field was added
  const safeRarity   = quest.rarity ?? 'common'
  const rarityColor  = getRarityColor(safeRarity)
  const rarityConfig = getRarityConfig(safeRarity)
  const diffColor    = DIFFICULTY_COLOR[quest.difficulty]
  const TypeIcon     = QUEST_TYPE_ICON[quest.type]

  // Completed quests get a green overlay; active/available use the rarity color
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
        {/* Type icon tinted with rarity color */}
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
            {/* Title colored by rarity */}
            <Text
              color={rarityColor}
              fontWeight="bold"
              fontSize="sm"
              noOfLines={1}
              textShadow={`0 0 12px ${rarityColor}55`}
            >
              {quest.title}
            </Text>

            {/* Rarity label – styled like item rarity badges */}
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

            {/* Difficulty badge (secondary) */}
            <Badge colorScheme={diffColor} fontSize="2xs" textTransform="capitalize" flexShrink={0}>
              {DIFFICULTY_LABEL[quest.difficulty]}
            </Badge>

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

// ── Room scene ────────────────────────────────────────────────────────────

/** Level → hex border/glow color for hero tokens */
function heroLevelColor(level: number): string {
  if (level >= 18) return '#ffa500'
  if (level >= 14) return '#ffd700'
  if (level >= 10) return '#a855f7'
  if (level >= 6)  return '#3b82f6'
  if (level >= 3)  return '#22c55e'
  return '#9ca3af'
}

interface RoomSpot { id: string; x: number; y: number; label: string; flavor: string }

const ROOM_SPOTS: RoomSpot[] = [
  { id: 'fireplace',   x: 13, y: 47, label: 'Fireplace',   flavor: 'warming by the fire' },
  { id: 'table_l',     x: 33, y: 52, label: 'Table',       flavor: 'sharing tales of glory' },
  { id: 'table_r',     x: 48, y: 52, label: 'Table',       flavor: 'plotting the next run' },
  { id: 'bar',         x: 73, y: 48, label: 'Bar',         flavor: 'drinking hard-earned ale' },
  { id: 'noticeboard', x: 62, y: 20, label: 'Notice Board',flavor: 'scouting available quests' },
  { id: 'entrance',    x: 31, y: 76, label: 'Entrance',    flavor: 'just arrived from the dungeon' },
  { id: 'corner',      x: 17, y: 28, label: 'Corner',      flavor: 'keeping a watchful eye' },
]

interface HeroPos { x: number; y: number; spotId: string }

function HeroToken({ hero, pos, isSelected, inParty, floatDelay, onClick }: {
  hero: Hero
  pos: HeroPos
  isSelected: boolean
  inParty: boolean
  floatDelay: number
  onClick: () => void
}) {
  const col = heroLevelColor(hero.level)
  return (
    <Box
      position="absolute"
      zIndex={3}
      cursor="pointer"
      role="button"
      aria-label={hero.name}
      onClick={onClick}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: 'translate(-50%, -50%)',
        transition: 'left 2.5s cubic-bezier(0.4,0,0.2,1), top 2.5s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <Box
        sx={{
          '@keyframes guildHeroFloat': {
            '0%,100%': { transform: 'translateY(0px)' },
            '50%':     { transform: 'translateY(-5px)' },
          },
          animation: 'guildHeroFloat 3.2s ease-in-out infinite',
          animationDelay: `${floatDelay}s`,
        }}
      >
        {/* Selection ring */}
        {isSelected && (
          <Box
            position="absolute"
            inset="-6px"
            borderRadius="full"
            border="2px solid white"
            boxShadow={`0 0 18px ${col}cc, 0 0 36px ${col}55`}
            pointerEvents="none"
          />
        )}

        {/* Portrait */}
        <Box
          border="2px solid"
          borderColor={isSelected ? 'white' : col}
          borderRadius="full"
          overflow="hidden"
          w="46px"
          h="46px"
          boxShadow={`0 0 ${isSelected ? 18 : 8}px ${col}${isSelected ? 'cc' : '66'}`}
          _hover={{ boxShadow: `0 0 18px ${col}cc`, borderColor: 'white' }}
          transition="box-shadow 0.2s, border-color 0.2s"
          opacity={hero.isAlive ? 1 : 0.35}
        >
          <HeroPortrait hero={hero} boxSize="46px" color="orange.300" />
        </Box>

        {/* In-party pip */}
        {inParty && (
          <Box
            position="absolute"
            top="-2px"
            right="-2px"
            w="13px"
            h="13px"
            borderRadius="full"
            bg="orange.400"
            border="1px solid"
            borderColor="blackAlpha.900"
            boxShadow="0 0 6px #fb923c"
          />
        )}

        {/* Name label */}
        <Text
          fontSize="2xs"
          color={isSelected ? 'white' : 'gray.400'}
          textAlign="center"
          mt={1}
          textShadow="0 1px 6px rgba(0,0,0,1)"
          noOfLines={1}
          maxW="64px"
          mx="auto"
          pointerEvents="none"
          sx={{ display: 'block' }}
        >
          {hero.name}
        </Text>
      </Box>
    </Box>
  )
}

function RoomScene({ heroRoster, party, isOpen }: {
  heroRoster: Hero[]
  party: (Hero | null)[]
  isOpen: boolean
}) {
  const partyIds = useMemo(
    () => new Set(party.filter(Boolean).map(h => h!.id)),
    [party],
  )
  const aliveHeroes = useMemo(() => heroRoster.filter(h => h.isAlive), [heroRoster])

  // Positions lazy-initialised at mount (parent uses key={isOpen?1:0} so this component
  // remounts fresh on every open, giving us a clean slate each time).
  const [heroPositions, setHeroPositions] = useState<Record<string, HeroPos>>(() => {
    if (!isOpen) return {}
    const positions: Record<string, HeroPos> = {}
    const occ: Record<string, number> = {}
    aliveHeroes.forEach((hero, i) => {
      const spot    = ROOM_SPOTS[i % ROOM_SPOTS.length]
      const slotIdx = occ[spot.id] ?? 0
      occ[spot.id]  = slotIdx + 1
      positions[hero.id] = {
        x:      spot.x + (Math.random() - 0.5) * 4 + (slotIdx > 0 ? 5 : 0),
        y:      spot.y + (Math.random() - 0.5) * 3 + (slotIdx > 0 ? 3 : 0),
        spotId: spot.id,
      }
    })
    return positions
  })
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null)

  const selectedHero   = selectedHeroId ? (heroRoster.find(h => h.id === selectedHeroId) ?? null) : null
  const selectedStats  = selectedHero ? calculateTotalStats(selectedHero) : null

  // Deterministic per-hero float stagger (avoids sync)
  const floatDelays = useMemo(() => {
    const m: Record<string, number> = {}
    heroRoster.forEach(h => {
      const code = h.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      m[h.id] = (code % 35) / 10
    })
    return m
  }, [heroRoster])

  // Wandering
  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      setHeroPositions(prev => {
        const ids = Object.keys(prev)
        if (ids.length < 2) return prev

        const movingId = ids[Math.floor(Math.random() * ids.length)]
        const moving   = prev[movingId]

        const occ: Record<string, number> = {}
        Object.values(prev).forEach(p => { occ[p.spotId] = (occ[p.spotId] ?? 0) + 1 })

        const available = ROOM_SPOTS.filter(
          s => s.id !== moving.spotId && (occ[s.id] ?? 0) < 2,
        )
        if (!available.length) return prev

        const newSpot  = available[Math.floor(Math.random() * available.length)]
        const newOcc   = occ[newSpot.id] ?? 0
        return {
          ...prev,
          [movingId]: {
            x:      newSpot.x + (Math.random() - 0.5) * 4 + (newOcc > 0 ? 5 : 0),
            y:      newSpot.y + (Math.random() - 0.5) * 3 + (newOcc > 0 ? 3 : 0),
            spotId: newSpot.id,
          },
        }
      })
    }, 3800)
    return () => clearInterval(interval)
  }, [isOpen])

  return (
    <Box position="relative" w="full" h="full" overflow="hidden">

      {/* Back wall */}
      <Box
        position="absolute" top={0} left={0} right={0} h="33%"
        bg="linear-gradient(180deg, #080402 0%, #170b05 60%, #200f07 100%)"
        zIndex={0}
      />

      {/* Floor */}
      <Box
        position="absolute" top="33%" left={0} right={0} bottom={0}
        bg="linear-gradient(180deg, #2a1709 0%, #1f1007 50%, #180c05 100%)"
        zIndex={0}
      />

      {/* Floor boards */}
      <Box
        position="absolute" top="33%" left={0} right={0} bottom={0}
        zIndex={0} opacity={0.1} pointerEvents="none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 26px, #c47a38 26px, #c47a38 27px)',
        }}
      />

      {/* Wall/floor seam */}
      <Box
        position="absolute" top="33%" left={0} right={0} h="3px"
        bgGradient="linear(to-r, transparent, #6b3a1e 10%, #9c5228 45%, #a85c30 55%, #9c5228 90%, transparent)"
        zIndex={1}
      />

      {/* Centre warm glow */}
      <Box
        position="absolute" left="48%" top="55%" zIndex={0} pointerEvents="none"
        w="60%" h="40%" borderRadius="full"
        style={{ background: 'radial-gradient(ellipse, rgba(170,80,15,0.09) 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }}
      />

      {/* Sconce – left */}
      <Box
        position="absolute" left="28%" top="22%" w="8px" h="8px"
        borderRadius="full" bg="orange.400" zIndex={1} pointerEvents="none"
        boxShadow="0 0 22px 10px rgba(237,137,54,0.45)"
        sx={{
          '@keyframes sconceL': { '0%,100%': { opacity: 0.9 }, '50%': { opacity: 0.55 } },
          animation: 'sconceL 2.1s ease-in-out infinite',
        }}
      />
      {/* Sconce – right */}
      <Box
        position="absolute" right="26%" top="22%" w="8px" h="8px"
        borderRadius="full" bg="orange.400" zIndex={1} pointerEvents="none"
        boxShadow="0 0 22px 10px rgba(237,137,54,0.45)"
        sx={{
          '@keyframes sconceR': { '0%,100%': { opacity: 0.85 }, '33%': { opacity: 0.5 }, '66%': { opacity: 1 } },
          animation: 'sconceR 1.8s ease-in-out infinite',
          animationDelay: '0.6s',
        }}
      />

      {/* ── FIREPLACE ── */}
      <Tooltip label="Fireplace — heroes gather for warmth" hasArrow placement="right">
        <Box
          position="absolute" left="2%" top="22%" w="14%" h="17%"
          border="2px solid #5c3218" borderRadius="md"
          bg="linear-gradient(to-b, #1a0800, #0a0400)"
          display="flex" flexDir="column" alignItems="center" justifyContent="center"
          zIndex={2} cursor="default"
        >
          <Icon
            as={GiFireplace} boxSize={7}
            sx={{
              '@keyframes fireGlow': {
                '0%,100%': { filter: 'drop-shadow(0 0 6px rgba(255,100,0,0.8))' },
                '50%':     { filter: 'drop-shadow(0 0 16px rgba(255,160,0,1))' },
              },
              animation: 'fireGlow 1.6s ease-in-out infinite',
              color: '#f97316',
            }}
          />
          {/* Floor glow from fire */}
          <Box
            position="absolute" inset={0} borderRadius="md" pointerEvents="none"
            bg="radial-gradient(ellipse at 50% 90%, rgba(255,100,0,0.14) 0%, transparent 70%)"
          />
        </Box>
      </Tooltip>
      {/* Fire light on floor */}
      <Box
        position="absolute" left="-3%" top="36%" w="26%" h="22%" zIndex={0} pointerEvents="none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,100,0,0.06) 0%, transparent 70%)' }}
      />

      {/* ── LONG TABLE ── */}
      <Tooltip label="Tavern Table — adventurers share stories here" hasArrow placement="top">
        <Box
          position="absolute" left="28%" top="44%" w="26%" h="9%"
          bg="linear-gradient(to-b, #6b3f1e, #4a2a0f)"
          border="2px solid #8b5a2b" borderRadius="sm"
          zIndex={2} cursor="default"
        >
          <Box position="absolute" left="10%" bottom="-40%" w="3px" h="40%" bg="#4a2a0e" />
          <Box position="absolute" right="10%" bottom="-40%" w="3px" h="40%" bg="#4a2a0e" />
        </Box>
      </Tooltip>

      {/* ── BAR COUNTER ── */}
      <Tooltip label="Tavern Bar — a well-earned drink" hasArrow placement="left">
        <Box
          position="absolute" right="2%" top="28%" w="15%" h="23%"
          bg="linear-gradient(to-br, #4a2a0f, #2a1608)"
          border="1px solid #7c4e2a" borderRadius="md"
          display="flex" flexDir="column" alignItems="center" justifyContent="center" gap={2}
          zIndex={2} cursor="default"
        >
          <Icon as={GiBeerStein} boxSize={5} color="yellow.700" />
          <Text fontSize="3xs" color="gray.700" fontWeight="bold" letterSpacing="wider">BAR</Text>
        </Box>
      </Tooltip>

      {/* ── GUILD NOTICE BOARD (decorative) ── */}
      <Tooltip label="Guild Notice Board — posted quests" hasArrow placement="bottom">
        <Box
          position="absolute" left="52%" top="4%" w="20%" h="24%"
          bg="#1c1206" border="2px solid #7a6010" borderRadius="sm"
          p={1.5} zIndex={2} cursor="default"
        >
          <Text fontSize="3xs" color="yellow.700" textAlign="center" fontWeight="bold" letterSpacing="widest" mb={1.5}>
            GUILD BOARD
          </Text>
          {[
            { w: '88%', col: '#166534' },
            { w: '72%', col: '#9a3412' },
            { w: '94%', col: '#92400e' },
            { w: '78%', col: '#374151' },
            { w: '60%', col: '#1e3a5f' },
          ].map((b, i) => (
            <Box key={i} h="5px" bg={b.col} borderRadius="sm" mb="3px" w={b.w}
              border="1px solid rgba(255,255,255,0.06)" />
          ))}
        </Box>
      </Tooltip>

      {/* ── ENTRANCE ARCH ── */}
      <Box
        position="absolute" left="22%" bottom={0} w="14%" h="13%"
        bg="linear-gradient(to-b, #0a0604, #000)"
        border="2px solid #4a3518" borderBottom="none" borderTopRadius="full"
        zIndex={2} pointerEvents="none"
      />

      {/* ── HERO TOKENS ── */}
      {Object.entries(heroPositions).map(([heroId, pos]) => {
        const hero = heroRoster.find(h => h.id === heroId)
        if (!hero) return null
        return (
          <HeroToken
            key={heroId}
            hero={hero}
            pos={pos}
            isSelected={selectedHeroId === heroId}
            inParty={partyIds.has(heroId)}
            floatDelay={floatDelays[heroId] ?? 0}
            onClick={() => setSelectedHeroId(prev => prev === heroId ? null : heroId)}
          />
        )
      })}

      {aliveHeroes.length === 0 && (
        <Box
          position="absolute" inset={0} display="flex"
          alignItems="center" justifyContent="center"
          pointerEvents="none" zIndex={5}
        >
          <Text color="gray.700" fontSize="sm" fontStyle="italic" textAlign="center">
            The hall is quiet…<br />recruit heroes to bring it to life.
          </Text>
        </Box>
      )}

      {/* ── SELECTED HERO PANEL ── */}
      {selectedHero && selectedStats && (
        <Box
          position="absolute" bottom={0} left={0} right={0}
          bg="rgba(8, 4, 2, 0.96)"
          borderTop="2px solid" borderTopColor="orange.800"
          px={5} py={3} zIndex={10}
          backdropFilter="blur(4px)"
          sx={{
            '@keyframes guildSlideUp': {
              from: { transform: 'translateY(100%)' },
              to:   { transform: 'translateY(0)' },
            },
            animation: 'guildSlideUp 0.2s ease-out',
          }}
        >
          <HStack spacing={4} align="center">
            <Box
              border="2px solid" flexShrink={0}
              borderColor={heroLevelColor(selectedHero.level)}
              borderRadius="xl" overflow="hidden"
              boxShadow={`0 0 14px ${heroLevelColor(selectedHero.level)}88`}
            >
              <HeroPortrait hero={selectedHero} boxSize={16} color="orange.300" borderRadius="none" />
            </Box>

            <VStack align="start" spacing={0.5} flex={1} minW={0}>
              <HStack spacing={2} flexWrap="wrap">
                <Text color="orange.200" fontWeight="bold" fontSize="md" noOfLines={1}>
                  <HeroName hero={selectedHero} />
                </Text>
                {partyIds.has(selectedHero.id) && <Badge colorScheme="orange" fontSize="2xs">In Party</Badge>}
                {!selectedHero.isAlive    && <Badge colorScheme="red"    fontSize="2xs">Fallen</Badge>}
              </HStack>
              <Text color="gray.400" fontSize="xs">{selectedHero.class.name} · Level {selectedHero.level}</Text>
              {(() => {
                const spot = ROOM_SPOTS.find(s => s.id === heroPositions[selectedHero.id]?.spotId)
                return spot ? (
                  <Text color="gray.600" fontSize="2xs" fontStyle="italic">Currently {spot.flavor}…</Text>
                ) : null
              })()}
            </VStack>

            <HStack spacing={4} fontSize="sm" flexShrink={0}>
              {([
                ['attack',  'ATK'],
                ['defense', 'DEF'],
                ['speed',   'SPD'],
                ['luck',    'LCK'],
              ] as const).map(([stat, label]) => (
                <VStack key={stat} spacing={0} align="center">
                  <Text fontWeight="bold" color={GAME_CONFIG.colors.stats[stat].text}>
                    {selectedStats[stat]}
                  </Text>
                  <Text fontSize="2xs" color="gray.600">{label}</Text>
                </VStack>
              ))}
            </HStack>

            <Box
              as="button"
              onClick={() => setSelectedHeroId(null)}
              color="gray.600"
              _hover={{ color: 'white' }}
              p={1.5} flexShrink={0}
            >
              <Icon as={FaTimes} boxSize={3.5} />
            </Box>
          </HStack>
        </Box>
      )}
    </Box>
  )
}

// ── Main modal ─────────────────────────────────────────────────────────────

export function GuildHallModal({ isOpen, onClose }: GuildHallModalProps) {
  const toast = useToast()

  const heroRoster          = useGameStore(state => state.heroRoster)
  const party               = useGameStore(state => state.party)
  const bankGold            = useGameStore(state => state.bankGold)
  const metaXp              = useGameStore(state => state.metaXp)
  const quests              = useGameStore(state => state.quests)
  const questsLastRefreshed = useGameStore(state => state.questsLastRefreshed)

  const acceptQuest       = useGameStore(state => state.acceptQuest)
  const claimQuestReward  = useGameStore(state => state.claimQuestReward)
  const refreshQuestBoard = useGameStore(state => state.refreshQuestBoard)

  useEffect(() => {
    if (isOpen) refreshQuestBoard()
  }, [isOpen, refreshQuestBoard])

  const completedQuests = quests.filter(q => q.status === 'completed')
  const activeQuests    = quests.filter(q => q.status === 'active')
  const availableQuests = quests.filter(q => q.status === 'available')

  // Capture wall-clock time when the modal mounts so the refresh label stays stable
  // across re-renders without calling Date.now() in the render path.
  const [openedAt] = useState<number>(() => Date.now())
  const refreshLabel = useMemo(() => {
    const ms = Math.max(0, (questsLastRefreshed ?? 0) + 2 * 60 * 60 * 1000 - openedAt)
    if (ms <= 0) return 'Ready'
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    return `${h}h ${m}m`
  }, [questsLastRefreshed, openedAt])

  const handleAccept = (questId: string) => {
    if (activeQuests.length >= 3) {
      toast({
        title: 'Quest slots full',
        description: 'You may only hold 3 active quests at a time.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      })
      return
    }
    acceptQuest(questId)
    toast({ title: 'Quest accepted!', status: 'success', duration: 2000, isClosable: true, position: 'bottom-right' })
  }

  const handleClaim = (quest: Quest) => {
    claimQuestReward(quest.id)
    toast({
      title: 'Reward claimed!',
      description: `+${quest.reward.gold.toLocaleString()}g  ·  +${quest.reward.metaXp.toLocaleString()} Meta XP`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'bottom-right',
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside" isCentered>
      <ModalOverlay bg="blackAlpha.900" backdropFilter="blur(8px)" />
      <ModalContent
        bg="gray.950"
        border="1px solid"
        borderColor="orange.900"
        boxShadow="0 0 80px rgba(249,115,22,0.18),inset 0 0 120px rgba(0,0,0,0.6)"
        maxW={{ base: '100vw', md: '98vw' }}
        maxH={{ base: '100vh', md: '96vh' }}
        my={{ base: 0, md: '2vh' }}
        borderRadius={{ base: 0, md: 'xl' }}
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        {/* Top bar */}
        <Box h="3px" bgGradient="linear(to-r,transparent,orange.700,yellow.500,orange.700,transparent)" flexShrink={0} />

        {/* Header */}
        <Box
          px={{ base: 4, md: 8 }} py={3}
          borderBottom="1px solid" borderColor="gray.800"
          bgGradient="linear(to-b,rgba(30,15,5,0.98),rgba(26,32,44,0.90))"
          flexShrink={0}
        >
          <HStack justify="space-between">
            <HStack spacing={4}>
              <Box
                bg="orange.900" border="2px solid" borderColor="orange.600"
                borderRadius="xl" p={2.5}
                boxShadow="0 0 20px rgba(249,115,22,0.3)"
              >
                <Icon as={GiCrossedSwords} color="orange.300" boxSize={7} />
              </Box>
              <VStack spacing={0} align="flex-start">
                <Text
                  color="orange.200" fontWeight="extrabold"
                  fontSize={{ base: 'xl', md: '2xl' }}
                  letterSpacing="wide" textShadow="0 0 20px rgba(249,115,22,0.5)"
                >
                  Guild Hall
                </Text>
                <HStack spacing={3}>
                  <Text color="gray.500" fontSize="xs" fontStyle="italic">Adventurers' Sanctum</Text>
                  <Text color="gray.700" fontSize="xs">·</Text>
                  <HStack spacing={1}>
                    <Icon as={GiCoins} color="yellow.500" boxSize={3} />
                    <Text color="yellow.400" fontSize="xs" fontWeight="bold">{bankGold.toLocaleString()}g</Text>
                  </HStack>
                  <Text color="gray.700" fontSize="xs">·</Text>
                  <HStack spacing={1}>
                    <Icon as={GiStarsStack} color="cyan.500" boxSize={3} />
                    <Text color="cyan.400" fontSize="xs" fontWeight="bold">{metaXp.toLocaleString()} XP</Text>
                  </HStack>
                </HStack>
              </VStack>
            </HStack>
            <ModalCloseButton
              color="gray.400" top={3} right={{ base: 4, md: 8 }}
              size="lg" _hover={{ color: 'orange.300' }}
            />
          </HStack>
        </Box>

        {/* Body */}
        <ModalBody p={0} flex={1} overflow="hidden" display="flex">
          <Flex direction={{ base: 'column', md: 'row' }} w="full" h="full" overflow="hidden">

            {/* LEFT: immersive room view */}
            <Box
              flex={{ base: 'none', md: '1 1 60%' }}
              h={{ base: '52vh', md: 'auto' }}
              borderRight={{ base: 'none', md: '1px solid' }}
              borderBottom={{ base: '1px solid', md: 'none' }}
              borderColor="gray.800"
              overflow="hidden"
            >
              <RoomScene key={isOpen ? 1 : 0} heroRoster={heroRoster} party={party} isOpen={isOpen} />
            </Box>

            {/* RIGHT: quest board */}
            <Box
              flex={{ base: 'none', md: '0 0 40%' }}
              display="flex" flexDirection="column" overflow="hidden"
            >
              {/* Board header */}
              <Box
                px={5} py={3}
                borderBottom="1px solid" borderColor="gray.800"
                bgGradient="linear(to-r,rgba(120,53,15,0.15),transparent)"
                flexShrink={0}
              >
                <HStack justify="space-between">
                  <HStack spacing={2}>
                    <Icon as={GiScrollQuill} color="orange.400" boxSize={5} />
                    <Text color="orange.300" fontWeight="bold" fontSize="md" letterSpacing="wide">
                      Quest Board
                    </Text>
                    {completedQuests.length > 0 && (
                      <Badge colorScheme="green"  fontSize="xs" borderRadius="full">{completedQuests.length} complete</Badge>
                    )}
                    {activeQuests.length > 0 && (
                      <Badge colorScheme="orange" fontSize="xs" borderRadius="full">{activeQuests.length} active</Badge>
                    )}
                  </HStack>
                  <HStack spacing={1} fontSize="2xs" color="gray.600">
                    <Icon as={FaHourglass} boxSize={2.5} />
                    <Text>Refreshes {refreshLabel}</Text>
                  </HStack>
                </HStack>
              </Box>

              {/* Quest list */}
              <Box
                flex={1} overflowY="auto" px={5} py={4}
                css={{
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                  '&::-webkit-scrollbar-thumb': { background: '#4A5568', borderRadius: '2px' },
                }}
              >
                <VStack spacing={3} align="stretch">
                  {completedQuests.map(q => (
                    <QuestCard key={q.id} quest={q} onClaim={() => handleClaim(q)} />
                  ))}
                  {activeQuests.map(q => (
                    <QuestCard key={q.id} quest={q} />
                  ))}

                  {availableQuests.length > 0 && (activeQuests.length > 0 || completedQuests.length > 0) && (
                    <HStack spacing={3}>
                      <Box flex={1} h="1px" bg="gray.800" />
                      <Text fontSize="2xs" color="gray.600" flexShrink={0}>Available</Text>
                      <Box flex={1} h="1px" bg="gray.800" />
                    </HStack>
                  )}

                  {availableQuests.map(q => (
                    <QuestCard key={q.id} quest={q} onAccept={() => handleAccept(q.id)} />
                  ))}

                  {quests.filter(q => q.status !== 'claimed').length === 0 && (
                    <VStack py={12} spacing={3} opacity={0.5}>
                      <Icon as={GiScrollQuill} color="gray.700" boxSize={10} />
                      <Text color="gray.600" textAlign="center" fontSize="sm">
                        The board is empty.<br />New quests will appear shortly.
                      </Text>
                    </VStack>
                  )}
                </VStack>
              </Box>
            </Box>

          </Flex>
        </ModalBody>

        {/* Bottom bar */}
        <Box h="2px" bgGradient="linear(to-r,transparent,orange.900,orange.700,orange.900,transparent)" flexShrink={0} />
      </ModalContent>
    </Modal>
  )
}
