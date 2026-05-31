/**
 * FloorMapScreen – Slay the Spire-style node map for the current floor.
 *
 * Layout
 * ------
 * Rows flow top-to-bottom, Row 0 at the top (first events), boss at the bottom.
 * SVG bezier curves connect parent nodes to their children.
 * Nodes are absolutely positioned over the SVG canvas.
 */

import { useRef, useState, useEffect, useCallback } from 'react'
import { Box, VStack, Text, Heading, HStack, Badge, Icon } from '@chakra-ui/react'
import {
  GiCrossedSwords,
  GiScrollUnfurled,
  GiTreasureMap,
  GiCampfire,
  GiTwoCoins,
  GiSpikedFence,
  GiMining,
  GiDragonHead,
  GiCheckMark,
  GiLockedChest,
} from 'react-icons/gi'
import type { FloorMap, MapNode, MapNodeType, MapNodeStatus } from '@/types'

// ─── visual constants ───────────────────────────────────────────────────────
const NODE_W = 72
const NODE_H = 72
const ROW_H  = 110  // vertical distance between row centres
const PAD_X  = 44   // horizontal padding on each side

// ─── per-type metadata ──────────────────────────────────────────────────────
type NodeMeta = { label: string; icon: React.ComponentType; color: string }

const NODE_META: Record<MapNodeType, NodeMeta> = {
  combat:   { label: 'Combat',   icon: GiCrossedSwords, color: 'red.400'    },
  choice:   { label: 'Event',    icon: GiScrollUnfurled,color: 'blue.300'   },
  treasure: { label: 'Treasure', icon: GiTreasureMap,   color: 'yellow.400' },
  rest:     { label: 'Rest',     icon: GiCampfire,       color: 'green.400'  },
  merchant: { label: 'Shop',     icon: GiTwoCoins,       color: 'yellow.300' },
  trap:     { label: 'Trap',     icon: GiSpikedFence,    color: 'orange.400' },
  mining:   { label: 'Mine',     icon: GiMining,         color: 'gray.300'   },
  boss:     { label: 'Boss',     icon: GiDragonHead,     color: 'purple.400' },
}

// Status-driven ring colour
const STATUS_RING: Record<MapNodeStatus, string> = {
  available: '#ED8936', // orange.400
  current:   '#ECC94B', // yellow.400
  visited:   '#4A5568', // gray.600
  future:    '#2D3748', // gray.700
}

// ─── helpers ────────────────────────────────────────────────────────────────
function groupByRow(nodes: MapNode[]): Record<number, MapNode[]> {
  return nodes.reduce<Record<number, MapNode[]>>((acc, n) => {
    ;(acc[n.row] ??= []).push(n)
    return acc
  }, {})
}

/** Compute the pixel centre of a node given the container width. */
function nodeCenter(
  node: MapNode,
  rowNodes: MapNode[],
  containerWidth: number,
): { x: number; y: number } {
  const usable = containerWidth - PAD_X * 2
  const n = rowNodes.length
  const x = n === 1
    ? PAD_X + usable / 2
    : PAD_X + (node.col / (n - 1)) * usable
  const y = node.row * ROW_H + NODE_H / 2
  return { x, y }
}

// ─── sub-components ─────────────────────────────────────────────────────────
interface NodeButtonProps {
  node: MapNode
  center: { x: number; y: number }
  onClick: () => void
}

function NodeButton({ node, center, onClick }: NodeButtonProps) {
  const meta  = NODE_META[node.type]
  const isAvailable = node.status === 'available'
  const isVisited   = node.status === 'visited'
  const isFuture    = node.status === 'future'
  const isBoss      = node.type === 'boss'

  return (
    <Box
      position="absolute"
      left={center.x - NODE_W / 2 + 'px'}
      top={center.y  - NODE_H / 2 + 'px'}
      w={NODE_W  + 'px'}
      h={isBoss ? NODE_H + 8 + 'px' : NODE_H + 'px'}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="2px"
      borderRadius={isBoss ? 'lg' : 'md'}
      borderWidth="2px"
      borderColor={STATUS_RING[node.status]}
      bg={isVisited ? 'gray.700' : isFuture ? 'gray.800' : isBoss ? 'purple.900' : 'gray.750'}
      opacity={isFuture ? 0.45 : 1}
      cursor={isAvailable ? 'pointer' : 'default'}
      transition="all 0.15s"
      _hover={isAvailable ? { borderColor: 'orange.300', bg: 'gray.600', transform: 'scale(1.06)' } : {}}
      onClick={isAvailable ? onClick : undefined}
      boxShadow={
        isAvailable
          ? '0 0 10px rgba(237,137,54,0.45)'
          : node.status === 'current'
            ? '0 0 14px rgba(236,201,75,0.55)'
            : 'none'
      }
      aria-label={`${meta.label} node – ${node.status}`}
      role={isAvailable ? 'button' : undefined}
      zIndex={1}
    >
      {isVisited ? (
        <Icon as={GiCheckMark} color="gray.500" boxSize={5} />
      ) : isFuture ? (
        <Icon as={GiLockedChest} color="gray.600" boxSize={5} />
      ) : (
        <Icon as={meta.icon as React.ComponentType} color={meta.color} boxSize={isBoss ? 7 : 6} />
      )}
      <Text
        fontSize={isBoss ? 'xs' : '2xs'}
        fontWeight="semibold"
        color={isVisited ? 'gray.500' : isFuture ? 'gray.600' : meta.color}
        textAlign="center"
        letterSpacing="wide"
        textTransform="uppercase"
        lineHeight="1"
      >
        {isVisited ? 'Done' : meta.label}
      </Text>
    </Box>
  )
}

// ─── main component ──────────────────────────────────────────────────────────
interface FloorMapScreenProps {
  floorMap: FloorMap
  floor: number
  onSelectNode: (nodeId: string) => void
}

export default function FloorMapScreen({ floorMap, floor, onSelectNode }: FloorMapScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(360)

  // Measure container width so node positions scale with available space
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setWidth(w)
    })
    ro.observe(el)
    setWidth(el.clientWidth || 360)
    return () => ro.disconnect()
  }, [])

  const byRow   = groupByRow(floorMap.nodes)
  const totalH  = floorMap.rows * ROW_H + NODE_H

  /** Pre-compute all node centres once width is known */
  const centres = useCallback((): Record<string, { x: number; y: number }> => {
    const map: Record<string, { x: number; y: number }> = {}
    floorMap.nodes.forEach((n) => {
      const rowNodes = byRow[n.row] ?? [n]
      map[n.id] = nodeCenter(n, rowNodes, width)
    })
    return map
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorMap.nodes, width])()

  // Build connection list for SVG rendering
  const connections: Array<{ from: { x: number; y: number }; to: { x: number; y: number }; active: boolean }> = []
  floorMap.nodes.forEach((node) => {
    const fc = centres[node.id]
    node.connections.forEach((targetId) => {
      const tc = centres[targetId]
      if (!tc) return
      const active = node.status === 'visited' || node.status === 'current'
      connections.push({
        from: { x: fc.x, y: fc.y + NODE_H / 2 },
        to:   { x: tc.x, y: tc.y - NODE_H / 2 },
        active,
      })
    })
  })

  const availableCount = floorMap.nodes.filter(n => n.status === 'available').length

  return (
    <VStack spacing={2} flex={1} minH={0} overflowY="auto" pb={2}>
      {/* Header */}
      <HStack w="full" justify="space-between" px={2} pt={1}>
        <Heading size="sm" color="orange.300">
          Floor {floor} — Choose Your Path
        </Heading>
        {availableCount > 0 && (
          <Badge colorScheme="orange" variant="subtle" fontSize="xs">
            {availableCount} available
          </Badge>
        )}
      </HStack>

      {/* Map canvas */}
      <Box
        ref={containerRef}
        position="relative"
        w="full"
        flexShrink={0}
        style={{ height: totalH + 'px' }}
      >
        {/* SVG connection lines */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: totalH,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          {connections.map((c, i) => {
            const midY = (c.from.y + c.to.y) / 2
            const d = `M ${c.from.x} ${c.from.y} C ${c.from.x} ${midY}, ${c.to.x} ${midY}, ${c.to.x} ${c.to.y}`
            return (
              <path
                key={i}
                d={d}
                stroke={c.active ? '#ED8936' : '#2D3748'}
                strokeWidth={c.active ? 2 : 1.5}
                fill="none"
                opacity={c.active ? 0.7 : 0.35}
              />
            )
          })}
        </svg>

        {/* Nodes */}
        {floorMap.nodes.map((node) => (
          <NodeButton
            key={node.id}
            node={node}
            center={centres[node.id]}
            onClick={() => onSelectNode(node.id)}
          />
        ))}
      </Box>

      {/* Legend */}
      <HStack spacing={3} wrap="wrap" justify="center" px={2} opacity={0.65}>
        {Object.entries(NODE_META)
          .filter(([t]) => t !== 'boss')
          .map(([type, meta]) => (
            <HStack key={type} spacing={1}>
              <Icon as={meta.icon as React.ComponentType} color={meta.color} boxSize={3} />
              <Text fontSize="2xs" color="gray.400">{meta.label}</Text>
            </HStack>
          ))}
      </HStack>
    </VStack>
  )
}
