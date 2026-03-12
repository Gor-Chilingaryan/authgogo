import jwt from 'jsonwebtoken'
import 'dotenv/config'

const jwtSecret = process.env.JWT_SECRET
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION

// creating JWT token for user
export function createToken(userId) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: TOKEN_EXPIRATION })
}

export default {
  createToken
}

