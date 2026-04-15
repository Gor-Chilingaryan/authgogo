
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Resend } from 'resend'
import crypto from 'crypto';
import userModel from '../models/userSchema.js'
import { generateTokens } from '../utils/createToken.js'

const resend = new Resend(process.env.RESEND_API_KEY)

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

  const resetToken = crypto.randomBytes(32).toString('hex')

  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  user.resetPasswordToken = hashedToken
  user.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000

  await user.save()

  const resetUrl = `${process.env.CLIENT_URL}/new-password/${resetToken}`
  console.log('--------------------------------', resetUrl);
  console.log('--------------------------------', user.email);
  console.log('--------------------------------', process.env.CLIENT_URL);
  console.log('--------------------------------', resetToken);
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Password Recovery</h2>
          <p>You received this email because you requested a password reset.</p>
          <p>Click on the button below to set a new password.:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset password
          </a>
          <p style="margin-top: 20px; font-size: 0.8em; color: #666;">
          The link is valid for 1 hour.
          </p>
        </div>
      `,
    })
    return { message: 'Password reset email sent' }
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    throw new Error('Failed to send reset email', { cause: err })
  }

}

export const newPasswordService = async (token, password) => {
  console.log('--- DEBUG START ---');
  console.log('Raw Password received:', password);

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await userModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    console.log('CRITICAL: User not found with this token!');
    throw new Error('Token is invalid or has expired');
  }

  console.log('User found:', user.email);

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed Password to save:', hashedPassword);

  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordTokenExpires = null;

  const savedUser = await user.save();
  console.log('Saved Password in DB:', savedUser.password);
  console.log('--- DEBUG END ---');

  return { message: 'Success', user: { id: user._id, email: user.email } };
}


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
