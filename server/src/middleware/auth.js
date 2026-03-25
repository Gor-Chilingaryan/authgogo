import jwt from 'jsonwebtoken'
import userModel from '../models/userSchema.js'
import 'dotenv/config'


const ACCESS_SECRET = process.env.ACCESS_SECRET

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken

    if (!token) {
      return res.status(401).json({ message: 'Access token missing' })
    }

    const decoded = jwt.verify(token, ACCESS_SECRET)

    const user = await userModel.findById(decoded.userId).select('-password')

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.user = user
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }

    res.status(500).json({ message: 'Server error', details: err.message })
  }
}

export default authMiddleware