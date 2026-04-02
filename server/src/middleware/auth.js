/**
 * Module: auth.js
 * Description: Express middleware that validates the access JWT from cookies, loads the user document, and attaches it to the request.
 * Role in request lifecycle: Runs after routing for protected endpoints — blocks unauthenticated or invalid requests before controllers execute.
 */
import jwt from 'jsonwebtoken'
import userModel from '../models/userSchema.js'
import 'dotenv/config'

const ACCESS_SECRET = process.env.ACCESS_SECRET

/**
 * Verifies `accessToken` cookie, resolves the user, and calls `next()` or responds with an error status.
 * User id is **not** read from a separate cookie — it is extracted from the JWT payload (`decoded.userId`) after verification.
 * @param {import('express').Request} req - Request; expects `req.cookies.accessToken` set by login/refresh handlers.
 * @param {import('express').Response} res - Response for JSON error bodies or pass-through.
 * @param {import('express').NextFunction} next - Continues to the route controller when authentication succeeds.
 * @returns {Promise<void>} Either invokes `next()` or sends 401/500 JSON.
 * @throws {Error} Does not propagate — JWT and DB errors are mapped to HTTP responses inside the catch block.
 */
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
    next();
  } catch (err) {
    // TokenExpiredError / JsonWebTokenError: client must refresh or re-login — 401 Unauthorized (not authenticated).
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }

    // Unexpected errors (e.g. DB failure) — 500 Internal Server Error.
    res.status(500).json({ message: 'Server error', details: err.message })
  }
}

export default authMiddleware
