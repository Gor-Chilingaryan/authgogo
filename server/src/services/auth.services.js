import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import userModel from '../models/userSchema.js'
import { generateTokens } from '../utils/createToken.js'

const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};
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

  const mailOptions = {
    from: `"Admin" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #b14ee0;">Password Recovery</h2>
        <p>Click on the button below to set a new password:</p>
        <div style="margin: 20px 0;">
          <a href="${resetUrl}" 
             style="background: #b14ee0; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Reset password
          </a>
        </div>
      </div>
    `,
  };

  try {
    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);

    return { message: 'Password reset email sent' }
  } catch (err) {

    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();
    throw new Error('Failed to send reset email', { cause: err })
  }
}

export const newPasswordService = async (token, password) => {

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await userModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error('Token is invalid or has expired');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordTokenExpires = null;

  await user.save();

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
    const error = new Error('Invalid or expired refresh token')

    error.code = 'REFRESH_EXPIRED'
    throw error
  }
}
