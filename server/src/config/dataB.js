/**
 * Module: dataB.js
 * Description: MongoDB connection helper using Mongoose and the MONGODB_URI environment variable.
 * Role in request lifecycle: Infrastructure — establishes the database session before requests are served; queries in services depend on this connection.
 */
import mongoose from 'mongoose'
import 'dotenv/config'

/**
 * Connects to MongoDB once at application startup.
 * @returns {Promise<void>} Resolves when connected; logs errors without throwing (process may continue in a degraded state).
 * @throws {Error} Not thrown explicitly — connection failures are caught and logged only.
 */
export default async () => {
  console.log("--------------------------------", process.env.MONGODB_URI)
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB 🚀🚀🚀')
  } catch (err) {
    // Catches Mongoose/network/auth errors during initial connect (e.g. bad URI, unreachable host).
    // Logged here because the server still starts; API routes may return 500 until DB is available.
    console.log('Error connecting to MongoDB 🚨🚨🚨', err)
  }
}
