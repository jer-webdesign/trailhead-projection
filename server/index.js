import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN ?? '*',
    methods: ['GET', 'POST'],
  },
})

app.use(cors())
app.use(express.json())

// Track current selection state
let currentSelection = {
  homesiteId: null,
  timestamp: 0,
  source: null,
}

// REST endpoint for OBS Python controller to poll / push
app.get('/api/state', (_req, res) => {
  res.json(currentSelection)
})

app.post('/api/select', (req, res) => {
  const { homesiteId, source } = req.body
  currentSelection = { homesiteId: homesiteId ?? null, timestamp: Date.now(), source: source ?? 'api' }
  io.emit('selection', currentSelection)
  res.json({ ok: true, state: currentSelection })
})

io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`)

  // Send current state immediately on connect
  socket.emit('selection', currentSelection)

  socket.on('selection', (event) => {
    // Validate event shape
    if (typeof event !== 'object' || event === null) return
    const { homesiteId, timestamp, source } = event

    currentSelection = {
      homesiteId: typeof homesiteId === 'string' ? homesiteId : (homesiteId === null ? null : null),
      timestamp: typeof timestamp === 'number' ? timestamp : Date.now(),
      source: typeof source === 'string' ? source : null,
    }

    // Broadcast to all OTHER clients
    socket.broadcast.emit('selection', currentSelection)
    console.log(`[selection] ${currentSelection.source} → ${currentSelection.homesiteId ?? 'none'}`)
  })

  socket.on('disconnect', () => {
    console.log(`[socket] disconnected: ${socket.id}`)
  })
})

const PORT = process.env.PORT ?? 3001
httpServer.listen(PORT, () => {
  console.log(`Trailhead WebSocket server running on port ${PORT}`)
})
