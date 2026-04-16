import app from './src/app.js'
import 'dotenv/config'
import connectDB from './src/config/dataB.js'
import { Server } from 'socket.io'
import { createServer } from 'http'

const PORT = process.env.PORT || 3000

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true
  }
})

io.on('connection', (socket) => {
  const rawUserId =
    socket.handshake?.query?.userId ?? socket.handshake?.auth?.userId
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId

  if (userId && userId !== 'undefined') {
    socket.join(String(userId))
    console.log(`User connected: Socket ${socket.id} joined room ${userId} ✅`)
  } else {
    console.log('User connected: Socket not joined to room ❌')
  }

  socket.on('disconnect', () => {
    console.log('User disconnected ❌')
  })
})

connectDB()

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀🚀🚀`)
})

export { io }