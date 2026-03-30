import express from 'express'
import cors from 'cors'
import userRouter from './routes/auth.routes.js'
import navigateRouter from './routes/navigate.routes.js'
import userInfoRouter from './routes/userInfo.route.js'
import cookieParser from 'cookie-parser'

import chatRouter from './routes/chat.routes.js'
const app = express()

// allows to share resources between different origins
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
// allows to parse the body of the request
app.use(express.json())
app.use(cookieParser())

// routes
app.use(userRouter)
app.use(navigateRouter)
app.use(userInfoRouter)
app.use(chatRouter)

app.get('/', (req, res) => {
  res.send('Hello World')
})

export default app
