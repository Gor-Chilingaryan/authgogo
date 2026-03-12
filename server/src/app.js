import express from 'express'
import cors from 'cors'
import userRouter from './routes/user.route.js'

const app = express()


// allows to share resources between different origins
app.use(cors())
// allows to parse the body of the request
app.use(express.json())

// routes
app.use(userRouter)

app.get('/', (req, res) => {
  res.send('Hello World')
})

export default app
