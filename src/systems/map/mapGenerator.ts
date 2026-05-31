/**
 * Floor map generator — Slay the Spire-style branching node map per floor.
 *
 * Each floor generates a map with:
 *  - N rows of 2–3 event nodes (N = eventsRequiredThisFloor)
 *  - A final boss row
 *  - Connections between rows ensuring all nodes are reachable
 *  - Row 0 nodes start as 'available'; all others start as 'future'
 */

import type { Biome, MapNode, MapNodeType, FloorMap } from '@/types'

const BASE_NODE_TYPE_WEIGHTS: { type: Exclude<MapNodeType, 'boss'>; weight: number }[] = [
  { type: 'combat',   weight: 35 },
  { type: 'choice',   weight: 22 },
  { type: 'treasure', weight: 14 },
  { type: 'rest',     weight: 12 },
  { type: 'merchant', weight:  8 },
  { type: 'trap',     weight:  5 },
  { type: 'mining',   weight:  4 },
]

function buildWeights(
  biome?: Biome,
): { type: Exclude<MapNodeType, 'boss'>; weight: number }[] {
  if (!biome?.nodeTypeWeights) return BASE_NODE_TYPE_WEIGHTS
  return BASE_NODE_TYPE_WEIGHTS.map((w) => ({
    type: w.type,
    weight: biome.nodeTypeWeights![w.type] ?? w.weight,
  }))
}

function pickNodeType(biome?: Biome): Exclude<MapNodeType, 'boss'> {
  const weights = buildWeights(biome)
  const total = weights.reduce((s, w) => s + w.weight, 0)
  let roll = Math.random() * total
  for (const w of weights) {
    roll -= w.weight
    if (roll <= 0) return w.type
  }
  return 'combat'
}

export function generateFloorMap(eventsRequired: number, biome?: Biome): FloorMap {
  const nodes: MapNode[] = []
  let nodeId = 0

  // Build rows of normal event nodes
  const rowArrays: MapNode[][] = []

  for (let row = 0; row < eventsRequired; row++) {
    // 45 % chance of 2 nodes, 55 % chance of 3
    const colCount = Math.random() < 0.45 ? 2 : 3
    const rowNodes: MapNode[] = []

    for (let col = 0; col < colCount; col++) {
      rowNodes.push({
        id: `n${nodeId++}`,
        type: pickNodeType(biome),
        row,
        col,
        connections: [],
        status: row === 0 ? 'available' : 'future',
      })
    }

    rowArrays.push(rowNodes)
    nodes.push(...rowNodes)
  }

  // Final boss row (single node, centred)
  const bossNode: MapNode = {
    id: `n${nodeId++}`,
    type: 'boss',
    row: eventsRequired,
    col: 1,
    connections: [],
    status: eventsRequired === 0 ? 'available' : 'future',
  }
  rowArrays.push([bossNode])
  nodes.push(bossNode)

  // Guarantee at least one rest node per map when there are 4+ event rows
  if (eventsRequired >= 4 && !nodes.some(n => n.type === 'rest')) {
    const candidates = nodes.filter(n => n.type !== 'boss')
    if (candidates.length > 0) {
      candidates[Math.floor(Math.random() * candidates.length)].type = 'rest'
    }
  }

  // Build connections between consecutive rows
  for (let r = 0; r < rowArrays.length - 1; r++) {
    const curr = rowArrays[r]
    const next = rowArrays[r + 1]
    const nextReachable = new Set<string>()

    curr.forEach((node) => {
      // Map col position 0→1 (relative), then scale to next-row indices
      const relPos = curr.length === 1 ? 0.5 : node.col / (curr.length - 1)
      const primaryIdx = Math.round(relPos * (next.length - 1))
      const connections: string[] = [next[primaryIdx].id]
      nextReachable.add(next[primaryIdx].id)

      // ~35 % chance of a second connection to an adjacent node
      if (Math.random() < 0.35 && next.length > 1) {
        const altIdx = primaryIdx < next.length - 1 ? primaryIdx + 1 : primaryIdx - 1
        connections.push(next[altIdx].id)
        nextReachable.add(next[altIdx].id)
      }

      node.connections = connections
    })

    // Ensure every next-row node is reachable from at least one current-row node
    next.forEach((nextNode) => {
      if (!nextReachable.has(nextNode.id)) {
        const closest = curr.reduce(
          (best, n) => {
            const dist = Math.abs(n.col - nextNode.col)
            return dist < best.dist ? { node: n, dist } : best
          },
          { node: curr[0], dist: Infinity },
        )
        if (!closest.node.connections.includes(nextNode.id)) {
          closest.node.connections.push(nextNode.id)
        }
      }
    })
  }

  return { nodes, rows: rowArrays.length, currentNodeId: null, biomeId: biome?.id }
}

/**
 * Mark a completed node as 'visited' and unlock the nodes it connects to.
 * Clears currentNodeId.
 */
export function updateMapAfterEvent(
  floorMap: FloorMap,
  completedNodeId: string,
): FloorMap {
  const completedNode = floorMap.nodes.find((n) => n.id === completedNodeId)
  if (!completedNode) return floorMap

  const nextIds = new Set(completedNode.connections)

  return {
    ...floorMap,
    currentNodeId: null,
    nodes: floorMap.nodes.map((n) => {
      if (n.id === completedNodeId) return { ...n, status: 'visited' }
      if (nextIds.has(n.id)) return { ...n, status: 'available' }
      return n
    }),
  }
}
