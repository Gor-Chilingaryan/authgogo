
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userSchema.js'
import { generateTokens } from '../utils/createToken.js'



export const createUserService = async (userBody) => {
  const { firstName, lastName, email, password } = userBody

  if (!firstName || !lastName || !email || !password) {
    throw new Error('All fields are required')
  }

  const existingUser = await userModel.findOne({ email })

  if (existingUser) {
    const err = new Error('User already exists')
    err.code = 'EMAIL_EXISTS'
    throw err
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword
  })


  const token = generateTokens(user._id)

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    },
    ...token
  }
}

export const loginUserService = async (userBody) => {
  const { email, password } = userBody

  if (!email || !password) {
    throw new Error('Email and password required')
  }

  const user = await userModel.findOne({ email })

  if (!user) {
    const err = new Error('Invalid credentials')
    err.code = 'INVALID_CREDENTIALS'
    throw err
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    const err = new Error('Invalid credentials')
    err.code = 'INVALID_CREDENTIALS'
    throw err
  }

  const token = generateTokens(user._id)

  return {
    user: {
      id: user._id,
      email: user.email
    },
    ...token
  }
}

export const forgotPasswordService = async (email) => {
  if (!email) {
    throw new Error('Email is required')
  }

  const user = await userModel.findOne({ email })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export const newPasswordService = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*\_])\S+$/
  if (!passwordRegex.test(password) || password.length < 8) {
    throw new Error('Password must contain at least one number, one special character (!@#$%^&*) and no spaces. and must be at least 8 characters long')
  }

  const user = await userModel.findOne({ email })

  if (!user) {
    throw new Error('User not found')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  user.password = hashedPassword
  await user.save()

  const token = generateTokens(user._id)
  return {
    message: 'Password updated successfully',
    user: {
      id: user._id,
      email: user.email
    },
    ...token
  }
}


/**
 * Verifies refresh JWT with `REFRESH_SECRET` and mints a fresh access/refresh pair.
 * @param {string} refreshToken - From `req.cookies.refreshToken`.
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 * @throws {Error} `'Refresh token is required'` when absent.
 * @throws {Error & { code: 'REFRESH_EXPIRED' }} When verify fails (expired/signature mismatch).
 */
export const refreshServices = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token is required')
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
    const tokens = generateTokens(decoded.userId)

    return tokens
  } catch (err) {
    // Catches TokenExpiredError, JsonWebTokenError, and malformed tokens from `jwt.verify`.
    const error = new Error('Invalid or expired refresh token')

    error.code = 'REFRESH_EXPIRED'
    throw error
  }
}
