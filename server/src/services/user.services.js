import bcrypt from "bcryptjs"
import userModel from "../models/userSchema.js"
import { createToken } from "../utils/createToken.js"

export const createUserService = async (userBody) => {
  // destructuring user body
  const { firstName, lastName, email, password } = userBody

  // checking if all fields are required
  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required")
  }

  // checking if user already exists
  const existingUser = await userModel.findOne({ email })

  if (existingUser) {
    const err = new Error("User already exists")
    err.code = "EMAIL_EXISTS"
    throw err
  }

  // hashing password
  const hashedPassword = await bcrypt.hash(password, 10)

  // creating user
  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword
  })


  const token = createToken(user._id)

  // returning user and token
  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    },
    token
  }
}

export const loginUserService = async (userBody) => {
  // destructuring user body
  const { email, password } = userBody

  // checking if email and password are required
  if (!email || !password) {
    throw new Error("Email and password required")
  }

  // finding user by email
  const user = await userModel.findOne({ email })

  // if user not found
  if (!user) {
    const err = new Error("Invalid credentials")
    err.code = "INVALID_CREDENTIALS"
    throw err
  }

  // comparing password
  const isMatch = await bcrypt.compare(password, user.password)

  // if password is not correct
  if (!isMatch) {
    const err = new Error("Invalid credentials")
    err.code = "INVALID_CREDENTIALS"
    throw err
  }

  // creating token
  const token = createToken(user._id)

  // returning user and token
  return {
    user: {
      id: user._id,
      email: user.email
    },
    token
  }
}

export const forgotPasswordService = async (email) => {
  if (!email) {
    throw new Error("Email is required")
  }

  const user = await userModel.findOne({ email })

  if (!user) {
    throw new Error("User not found")
  }

  return user
}
