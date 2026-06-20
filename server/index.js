/**
 * Dungeon Runner – Socket.io relay server
 *
 * Handles room creation/joining and relays messages between players.
 * One player is the authoritative "host"; guests send action requests
 * to the host and receive state broadcasts in return.
 *
 * Start: node server/index.js  (or: npm run server)
 */

import { createServer } from 'http'
import { networkInterfaces } from 'os'
import { Server } from 'socket.io'

/** Returns the first non-loopback IPv4 address on this machine. */
function getLanIp() {
  const nets = networkInterfaces()
  for (const ifaces of Object.values(nets)) {
    for (const iface of (ifaces ?? [])) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address
    }
  }
  return '127.0.0.1'
}

const httpServer = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method === 'GET' && req.url === '/') {
    res.setHeader('Content-Type', 'text/html')
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dungeon Runner Relay</title>
  <style>
    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0d0d0d; color: #e8d5a3; }
    .card { text-align: center; border: 1px solid #3a2e1e; border-radius: 8px; padding: 2rem 3rem; background: #1a1410; }
    h1 { margin: 0 0 0.5rem; font-size: 2rem; }
    p { margin: 0; color: #a08060; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Dungeon Runner Relay</h1>
    <p>Socket.io multiplayer relay server is running.</p>
  </div>
</body>
</html>`)
    return
  }

  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'GET' && req.url === '/info') {
    res.end(JSON.stringify({ ip: getLanIp() }))
    return
  }

  if (req.method === 'GET' && req.url === '/room') {
    const code = rooms.size > 0 ? [...rooms.keys()][0] : null
    res.end(JSON.stringify({ code }))
    return
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: 'Not found' }))
})

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

// roomCode → { hostId: string, players: Array<{ id: string, name: string }> }
const rooms = new Map()

function generateCode() {
  // Unambiguous characters – excludes I, O, 0, 1
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

io.on('connection', (socket) => {
  console.log(`[Server] Client connected: ${socket.id}`)

  // ── Host: create a new room ───────────────────────────────────────────────
  socket.on('create-room', ({ playerName }, callback) => {
    if (typeof callback !== 'function') return

    // Generate a unique 4-char code
    let code
    do { code = generateCode() } while (rooms.has(code))

    rooms.set(code, {
      hostId: socket.id,
      players: [{ id: socket.id, name: playerName || 'Host' }],
    })

    socket.join(code)
    socket.data.roomCode = code
    socket.data.playerName = playerName || 'Host'

    console.log(`[Server] Room ${code} created by ${socket.id} (${playerName})`)
    callback({ code })
  })

  // ── Guest: join an existing room ─────────────────────────────────────────
  socket.on('join-room', ({ code, playerName }, callback) => {
    if (typeof callback !== 'function') return

    const normalised = (code || '').toUpperCase().trim()
    const room = rooms.get(normalised)

    if (!room) return callback({ error: 'Room not found. Check the code and try again.' })
    if (room.players.length >= 4) return callback({ error: 'Room is full (max 4 players).' })

    const player = { id: socket.id, name: playerName || 'Guest' }
    room.players.push(player)

    socket.join(normalised)
    socket.data.roomCode = normalised
    socket.data.playerName = playerName || 'Guest'

    // Notify existing players
    socket.to(normalised).emit('player-joined', { player })

    console.log(`[Server] ${socket.id} (${playerName}) joined room ${normalised}`)
    callback({ success: true, hostId: room.hostId, players: room.players })
  })

  // ── Host → Guests: broadcast game state ──────────────────────────────────
  socket.on('state-update', ({ code, state }) => {
    socket.to(code).emit('state-update', state)
  })

  // ── Host → Guests: broadcast boss combat start ────────────────────────────
  socket.on('boss-combat-start', ({ code, event }) => {
    const room = rooms.get(code)
    const roomSize = room ? room.players.length : 0
    console.log(`[Server] boss-combat-start from ${socket.id}, room ${code}, players: ${roomSize}`)
    socket.to(code).emit('boss-combat-start', { event })
  })

  // ── Host → specific guest: send boss combat state on late join ────────────
  socket.on('boss-combat-start-to', ({ event, targetId }) => {
    console.log(`[Server] boss-combat-start-to: from ${socket.id} to ${targetId}`)
    io.to(targetId).emit('boss-combat-start', { event })
  })

  // ── Host → Guests: broadcast boss combat end ──────────────────────────────
  socket.on('boss-combat-end', ({ code }) => {
    socket.to(code).emit('boss-combat-end')
  })

  // ── Guest → Host: request current boss state (continue run / reconnect) ───
  socket.on('request-boss-state', ({ code }) => {
    const room = rooms.get(code)
    console.log(`[Server] request-boss-state from ${socket.id}, code: ${code}, room found: ${!!room}, hostId: ${room?.hostId}`)
    if (!room) return
    io.to(room.hostId).emit('request-boss-state', { requesterId: socket.id })
  })

  // ── Guest → Host: request a game action ──────────────────────────────────
  socket.on('guest-action', ({ code, action }) => {
    const room = rooms.get(code)
    if (!room) return

    io.to(room.hostId).emit('guest-action', {
      playerId: socket.id,
      playerName: socket.data.playerName || 'Guest',
      action,
    })
  })

  // ── Guest → Host: claim a party slot with a hero snapshot ─────────────────
  socket.on('claim-slot', ({ code, slotIndex, heroSnapshot, heroSourceId }) => {
    const room = rooms.get(code)
    if (!room) return

    io.to(room.hostId).emit('guest-slot-claimed', {
      playerId: socket.id,
      playerName: socket.data.playerName || 'Guest',
      slotIndex,
      heroSnapshot,
      heroSourceId,
    })
  })

  // ── Guest → Host: release a previously claimed slot ───────────────────────
  socket.on('release-slot', ({ code, slotIndex }) => {
    const room = rooms.get(code)
    if (!room) return

    io.to(room.hostId).emit('guest-slot-released', {
      playerId: socket.id,
      slotIndex,
    })
  })

  // ── Host → All: broadcast updated slot assignment map ─────────────────────
  // Sent by host after processing a claim/release so all clients stay in sync.
  socket.on('slot-assignments-update', ({ code, assignments }) => {
    socket.to(code).emit('slot-assignments-update', { assignments })
  })

  // ── Any → Others: request all peers to re-send their profiles ──────────────
  socket.on('request-profiles', ({ code }) => {
    const room = rooms.get(code)
    if (!room) return
    socket.to(code).emit('profile-request', { requesterId: socket.id })
  })

  // ── Any → All: broadcast player profile (roster preview, location) ─────────
  socket.on('broadcast-profile', ({ code, profile }) => {
    const room = rooms.get(code)
    if (!room) return

    // Relay to everyone else in the room (not back to sender)
    socket.to(code).emit('player-profile-update', {
      playerId: socket.id,
      profile,
    })
  })

  // ── Host → Guests: distribute run rewards after the run ends ──────────────
  // heroReturnsByPlayer: { [socketId]: { [heroSourceId]: updatedHero } }
  // lootByPlayer:        { [socketId]: Item[] }
  // goldByPlayer:        { [socketId]: number }
  // run:                 Run record for quest processing
  socket.on('run-ended', ({ code, heroReturnsByPlayer, lootByPlayer, goldByPlayer, run }) => {
    const room = rooms.get(code)
    if (!room) return

    // Send personalised payload to each guest
    for (const player of room.players) {
      if (player.id === room.hostId) continue // host handles their own data
      io.to(player.id).emit('run-ended', {
        heroReturns: heroReturnsByPlayer[player.id] ?? {},
        loot:        lootByPlayer[player.id]        ?? [],
        gold:        goldByPlayer[player.id]        ?? 0,
        run,
      })
    }
  })

  // ── Host → All: sync run stats for quest processing (all players) ─────────
  socket.on('run-stats-sync', ({ code, run }) => {
    socket.to(code).emit('run-stats-sync', { run })
  })

  // ── Any → Host: cast a vote for an event choice ───────────────────────────
  socket.on('cast-vote', ({ code, choiceIndex }) => {
    const room = rooms.get(code)
    if (!room) return
    io.to(room.hostId).emit('cast-vote', { playerId: socket.id, choiceIndex })
  })

  // ── Host → All: broadcast current vote tally ─────────────────────────────
  socket.on('vote-update', ({ code, votes, totalPlayers }) => {
    socket.to(code).emit('vote-update', { votes, totalPlayers })
  })

  // ── Host → All: start loot draft at run end ───────────────────────────────
  socket.on('draft-start', ({ code, pool, goldByPlayer, heroReturnsByPlayer, order, run }) => {
    socket.to(code).emit('draft-start', { pool, goldByPlayer, heroReturnsByPlayer, order, run })
  })

  // ── Any → Host: pick an item from the draft pool ─────────────────────────
  socket.on('draft-pick', ({ code, itemIndex }) => {
    const room = rooms.get(code)
    if (!room) return
    io.to(room.hostId).emit('draft-pick', { playerId: socket.id, itemIndex })
  })

  // ── Host → All: updated draft state after each pick ──────────────────────
  socket.on('draft-update', ({ code, pool, picks, currentPickerIndex, order }) => {
    socket.to(code).emit('draft-update', { pool, picks, currentPickerIndex, order })
  })

  // ── Host → All: draft complete — send personalised run-ended to each guest ─
  socket.on('draft-complete', ({ code, heroReturnsByPlayer, lootByPlayer, goldByPlayer, run }) => {
    const room = rooms.get(code)
    if (!room) return
    for (const player of room.players) {
      if (player.id === room.hostId) continue
      io.to(player.id).emit('run-ended', {
        heroReturns: heroReturnsByPlayer[player.id] ?? {},
        loot:        lootByPlayer[player.id]        ?? [],
        gold:        goldByPlayer[player.id]        ?? 0,
        run,
      })
    }
  })

  // ── Host → Guests: navigate to a screen ──────────────────────────────────
  socket.on('navigate', ({ code, destination }) => {
    socket.to(code).emit('navigate', { destination })
  })

  // ── Any → Host: player signals they are ready to enter the dungeon ────────
  socket.on('player-ready', ({ code }) => {
    const room = rooms.get(code)
    if (!room) return
    io.to(room.hostId).emit('player-ready', { playerId: socket.id })
  })

  // ── Host → All: broadcast current ready-player list ──────────────────────
  socket.on('ready-update', ({ code, readyPlayers }) => {
    socket.to(code).emit('ready-update', { readyPlayers })
  })

  // ── Disconnect cleanup ────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`[Server] Client disconnected: ${socket.id}`)

    const code = socket.data.roomCode
    if (!code) return

    const room = rooms.get(code)
    if (!room) return

    room.players = room.players.filter((p) => p.id !== socket.id)

    if (room.players.length === 0) {
      rooms.delete(code)
      console.log(`[Server] Room ${code} deleted (empty)`)
    } else if (room.hostId === socket.id) {
      // Host left – notify guests and close room
      io.to(code).emit('host-left')
      rooms.delete(code)
      console.log(`[Server] Room ${code} closed – host disconnected`)
    } else {
      io.to(code).emit('player-left', { playerId: socket.id })
    }
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`[Server] Dungeon Runner multiplayer relay running on port ${PORT}`)
})
