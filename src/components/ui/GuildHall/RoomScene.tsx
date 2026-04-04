import { useEffect, useState, useMemo } from 'react'
import {
  VStack,
  HStack,
  Text,
  Box,
  Icon,
  Badge,
  Tooltip,
} from '@chakra-ui/react'
import {
  GiFireplace,
  GiBeerStein,
  GiScrollQuill,
  GiStarFormation,
} from 'react-icons/gi'
import { FaTimes } from 'react-icons/fa'
import { HeroPortrait } from '@/components/party/HeroPortrait'
import { calculateTotalStats } from '@/utils/statCalculator'
import { GAME_CONFIG } from '@/config/gameConfig'
import { HeroName } from '@/components/ui/HeroName'
import type { Hero } from '@/types'
import { ROOM_SPOTS, heroLevelColor } from './roomSceneData'
import type { RoomSpot } from './roomSceneData'

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

export interface RoomSceneProps {
  heroRoster: Hero[]
  party: (Hero | null)[]
  isOpen: boolean
  onBoardSelect?: (board: 'quests' | 'heroes') => void
  activeBoard?: 'quests' | 'heroes'
}

export function RoomScene({ heroRoster, party, isOpen, onBoardSelect, activeBoard }: RoomSceneProps) {
  const partyIds = useMemo(
    () => new Set(party.filter(Boolean).map(h => h!.id)),
    [party],
  )
  const aliveHeroes = useMemo(() => heroRoster.filter(h => h.isAlive), [heroRoster])

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

  const selectedHero  = selectedHeroId ? (heroRoster.find(h => h.id === selectedHeroId) ?? null) : null
  const selectedStats = selectedHero ? calculateTotalStats(selectedHero) : null

  const floatDelays = useMemo(() => {
    const m: Record<string, number> = {}
    heroRoster.forEach(h => {
      const code = h.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      m[h.id] = (code % 35) / 10
    })
    return m
  }, [heroRoster])

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

      {/* ── GUILD NOTICE BOARD (Quest Board) ── */}
      <Tooltip label="Quest Board — click to view active quests" hasArrow placement="bottom">
        <Box
          position="absolute" left="52%" top="4%" w="20%" h="24%"
          bg={activeBoard === 'quests' ? '#261a04' : '#1c1206'}
          border="2px solid"
          borderColor={activeBoard === 'quests' ? '#f97316' : '#7a6010'}
          borderRadius="sm"
          p={1.5} zIndex={2} cursor="pointer"
          onClick={() => onBoardSelect?.('quests')}
          boxShadow={activeBoard === 'quests' ? '0 0 14px rgba(249,115,22,0.4)' : 'none'}
          _hover={{ borderColor: '#f97316', boxShadow: '0 0 12px rgba(249,115,22,0.3)' }}
          transition="all 0.15s"
        >
          <HStack spacing={1} justify="center" mb={1}>
            <Icon as={GiScrollQuill} boxSize={2.5} color={activeBoard === 'quests' ? 'orange.400' : 'yellow.700'} />
            <Text fontSize="3xs" color={activeBoard === 'quests' ? 'orange.400' : 'yellow.700'} textAlign="center" fontWeight="bold" letterSpacing="widest">
              QUESTS
            </Text>
          </HStack>
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

      {/* ── ADVENTURERS' HIRE BOARD ── */}
      <Tooltip label="Adventurers' Board — click to hire new heroes" hasArrow placement="bottom">
        <Box
          position="absolute" left="75%" top="4%" w="20%" h="24%"
          bg={activeBoard === 'heroes' ? '#1a0e2e' : '#130a20'}
          border="2px solid"
          borderColor={activeBoard === 'heroes' ? '#a855f7' : '#4a2880'}
          borderRadius="sm"
          p={1.5} zIndex={2} cursor="pointer"
          onClick={() => onBoardSelect?.('heroes')}
          boxShadow={activeBoard === 'heroes' ? '0 0 14px rgba(168,85,247,0.4)' : 'none'}
          _hover={{ borderColor: '#a855f7', boxShadow: '0 0 12px rgba(168,85,247,0.3)' }}
          transition="all 0.15s"
        >
          <HStack spacing={1} justify="center" mb={1}>
            <Icon as={GiStarFormation} boxSize={2.5} color={activeBoard === 'heroes' ? 'purple.400' : 'purple.800'} />
            <Text fontSize="3xs" color={activeBoard === 'heroes' ? 'purple.400' : 'purple.800'} textAlign="center" fontWeight="bold" letterSpacing="widest">
              HIRE
            </Text>
          </HStack>
          {[
            { w: '82%', col: '#4c1d95' },
            { w: '65%', col: '#6b21a8' },
            { w: '90%', col: '#581c87' },
            { w: '70%', col: '#3b0764' },
            { w: '55%', col: '#2e1065' },
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
