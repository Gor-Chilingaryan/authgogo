import mongoose from 'mongoose'
import 'dotenv/config'

// creating connection to database
export default async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB 🚀🚀🚀')
  } catch (err) {
    console.log('Error connecting to MongoDB 🚨🚨🚨', err)
  }
}