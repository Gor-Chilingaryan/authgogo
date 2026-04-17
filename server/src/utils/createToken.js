import jwt from 'jsonwebtoken'
import 'dotenv/config'

const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET
const ACCESS_EXPIRATION = process.env.ACCESS_EXPIRATION
const REFRESH_EXPIRATION = process.env.REFRESH_EXPIRATION

export function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRATION
  })

  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRATION
  })

  return {
    accessToken,
    refreshToken
  }
}

export default {
  generateTokens
}
