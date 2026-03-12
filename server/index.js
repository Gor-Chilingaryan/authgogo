import app from './src/app.js'
import 'dotenv/config'
import connectDB from './src/config/dataB.js'

const PORT = process.env.PORT || 3000

// connect to database
connectDB()

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀🚀🚀`)
})
