import express from 'express'
import cors from 'cors'
import userRouter from './routes/auth.routes.js'
import navigateRouter from './routes/navigate.routes.js'
const app = express()


// allows to share resources between different origins
app.use(cors())
// allows to parse the body of the request
app.use(express.json())

// routes
app.use(userRouter)
app.use(navigateRouter)
app.get('/', (req, res) => {
  res.send('Hello World')
})

export default app
