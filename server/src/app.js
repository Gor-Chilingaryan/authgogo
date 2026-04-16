
import express from 'express'
import cors from 'cors'
import userRouter from './routes/auth.routes.js'
import navigateRouter from './routes/navigate.routes.js'
import userInfoRouter from './routes/userInfo.route.js'
import messageRouter from './routes/message.routes.js'
import cookieParser from 'cookie-parser'
import uploadRouter from './routes/uploud.routes.js'
const app = express()


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}))

app.use(express.json())
app.use(cookieParser())


app.use('/api/users', uploadRouter)

app.use(userRouter)
app.use(navigateRouter)
app.use(userInfoRouter)
app.use(messageRouter)
app.use(uploadRouter)


app.get('/', (req, res) => {
  res.send('Hello World')
})

export default app
