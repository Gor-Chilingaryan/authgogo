/**
 * Module: userSchema.js
 * Description: Mongoose schema and model for application users (profile fields, credentials, validation rules).
 * Role in request lifecycle: Persistence layer — queried by services/middleware; not invoked directly per HTTP request without going through Mongoose.
 */
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
    default: '/default_user.png'
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    minLength: 2,
    trim: true,
  },

  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: 2,
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    trim: true,
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'minimum password length is 8 characters'],
    validate: {
      /**
       * Enforces password complexity aligned with registration/reset services (digit + special, no whitespace).
       * @param {string} v - Plain-text password before hashing.
       * @returns {boolean} True when the password meets the regex policy.
       */
      validator: (v) => /^(?=.*\d)(?=.*[!@#$%^&*])\S+$/.test(v),
      message: 'Password must contain at least one number, one special character (!@#$%^&*) and no spaces.'
    }
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordTokenExpires: {
    type: Date,
    default: null
  }
})

const userModel = mongoose.model('User', userSchema)

export default userModel
