import app from './src/app.js'
import 'dotenv/config'
import connectDB from './src/config/Db.js'
import { initSocket } from './src/socket.js'
import { createServer } from 'http'

const PORT = process.env.PORT || 3000

const httpServer = createServer(app)


initSocket(httpServer)

connectDB()

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀🚀🚀`)
})

