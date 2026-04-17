import { Server } from 'socket.io'

let io;
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
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
    }
  })
}

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}