/**
 * Module: app.js
 * Description: Express application factory — configures global middleware (CORS, JSON body parsing, cookies) and mounts all API route modules.
 * Role in request lifecycle: Central wiring layer. Every HTTP request passes through middleware registered here before reaching route handlers and controllers.
 */
import express from 'express'
import cors from 'cors'
import userRouter from './routes/auth.routes.js'
import navigateRouter from './routes/navigate.routes.js'
import userInfoRouter from './routes/userInfo.route.js'
import messageRouter from './routes/message.routes.js'
import cookieParser from 'cookie-parser'
import uploadRouter from './routes/uploud.routes.js'
const app = express()

// CORS: allow the browser SPA origin to call this API with cookies (Authorization via HttpOnly cookies + credentials: true).
// CLIENT_ORIGIN must match the Vite dev server or deployed frontend URL, or the browser will block cross-origin responses.
// app.js

// 1. Убедись, что CORS стоит ПЕРВЫМ среди middleware
app.use(cors({
  origin: process.env.CLIENT_URL, // Пишем напрямую для теста
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}))

app.use(express.json())
app.use(cookieParser())

// ... роуты
app.use('/api/users', uploadRouter)

app.use(express.json())
app.use(cookieParser())

app.use(userRouter)
app.use(navigateRouter)
app.use(userInfoRouter)
app.use(messageRouter)
app.use(uploadRouter)
/**
 * Lightweight root handler for uptime checks or manual browser hits.
 * @param {import('express').Request} req - Incoming HTTP request.
 * @param {import('express').Response} res - Express response used to send plain text.
 * @returns {void} Sends "Hello World" with default 200 status.
 */
app.get('/', (req, res) => {
  res.send('Hello World')
})

export default app
