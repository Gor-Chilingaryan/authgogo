import jwt from 'jsonwebtoken'
import userModel from '../models/userSchema.js'
import 'dotenv/config'

const jwtSecret = process.env.JWT_SECRET

// for get token  request
const authMiddleware = async (req, res, next) => {
  try {
    // getting authorization header
    const authHeader = req.header('Authorization');
    // if there is no authorization header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'There is no access token' })
    } 

    // getting token
    const token = authHeader.replace('Bearer ', '')
    // verifying token
    const decoded = jwt.verify(token, jwtSecret);
    // finding user by id
    const user = await userModel.findById(decoded.userId).select('-password')
    // if user not found
    if (!user) {
      return res.status(401).json({ message: 'The user was not found' })
    }

    req.user = user
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }

    res.status(500).json({ message: 'Server error', details: err.message })
  }
}

export default authMiddleware