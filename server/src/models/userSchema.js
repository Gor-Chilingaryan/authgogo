import mongoose from 'mongoose'

// creating user schema
const userSchema = new mongoose.Schema({
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

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'minimum password length is 8 characters'],
    validate: {
      validator: (v) => /^(?=.*\d)(?=.*[!@#$%^&*])\S+$/.test(v),
      message: 'Password must contain at least one number, one special character (!@#$%^&*) and no spaces.'
    }
  }
})




// creating user model
const userModel = mongoose.model('User', userSchema)

export default userModel 
